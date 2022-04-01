import 'reflect-metadata';

const SERIALIZED_NAME = Symbol('SERIALIZED_NAME');
const SERIALIZED_BY = Symbol('SERIALIZED_BY');
const IGNORE_SERIALIZATION = Symbol('IGNORE_SERIALIZATION');

interface SerializedNameMapping {
    [serializedName: string]: string;
}

interface SerializedConfig<T> {
    name?: string;
    class?: ClassConstructor<T>;
    creator?: InstanceCreator<T>;
    isArray?: boolean;
}

// @Annotation
export function JsonTranslation<T extends {}>(config: SerializedConfig<T>): PropertyDecorator {
    return (target: T, propName: string) => {
        const clazz = target.constructor as ClassConstructor<T>;
        if (config.name) {
            registerSerializedName(clazz, propName, config.name);
        }
        // When running UT with Jest, Reflect.metadata will not work as expected( cannot step into at all)
        // After read Reflect implementation, we can use Reflect.defineMetadata, which equals to Reflect.metadata in function
        Reflect.defineMetadata(SERIALIZED_BY, config, clazz, propName);
    };
}

// @Annotation
export function SerializedName<T extends {}>(serializedName: string): PropertyDecorator {
    return (target: T, propName: string) => {
        registerSerializedName(target.constructor as ClassConstructor<T>, propName, serializedName);
    };
}

// @Annotation
export function IgnoreSerialization<T extends {}>(target: T, propName: string): void {
    Reflect.defineMetadata(IGNORE_SERIALIZATION, true, target.constructor, propName);
}

function registerSerializedName<T extends {}>(clazz: ClassConstructor<T>, propName: string, serializedName: string) {
    const serializedNameMapping = (Reflect.getMetadata(SERIALIZED_NAME, clazz) as SerializedNameMapping) || [];
    serializedNameMapping[serializedName] = propName;
    Reflect.defineMetadata(SERIALIZED_NAME, serializedNameMapping, clazz);
    Reflect.defineMetadata(SERIALIZED_NAME, serializedName, clazz, propName);
}

function buildClassCreator<T extends {}>(classConstructor: new () => T): InstanceCreator<T> {
    return (data: {}) => {
        const newObject = new classConstructor();
        deserializeFrom(data, newObject);
        return newObject;
    };
}

function buildCreator<T>(config: SerializedConfig<T>): InstanceCreator<T> | InstanceCreator<T[]> {
    let creator: InstanceCreator<T> | InstanceCreator<T[]>;
    if (config.creator) {
        creator = config.creator;
    } else if (config.class && config.class instanceof Function) {
        const constructor = config.class;
        creator = buildClassCreator(constructor);
    } else {
        creator = (data: {}) => data as T;
    }
    if (config.isArray) {
        creator = buildArrayCreator(creator);
    }
    return creator;
}

function buildArrayCreator<T extends {}>(creator: InstanceCreator<T>): InstanceCreator<T[]> {
    return (data: {}) => {
        if (!(data instanceof Array)) {
            return [];
        }
        const newArrayValue: T[] = [];
        const arrayValue = data as [];
        arrayValue.forEach((item) => {
            const newItem = creator(item);
            newArrayValue.push(newItem);
        });
        return newArrayValue;
    };
}

type InstanceCreator<T> = (data: {}) => T;
type ClassConstructor<T> = new () => T;
type DataObject = {};

/**
 * serialize an object to json string
 */
export function serialize<T extends {}>(object: T): string {
    return JSON.stringify(serializeToData(object));
}

/**
 * convert an object to data object
 */
export function serializeToData<T extends {}>(object: T): DataObject {
    if (object instanceof Array) {
        return (object as Array<any>).map(serializeToData);
    }
    const clazz = object.constructor;
    const jsonMappingObject = {};

    Object.entries(object).forEach((entry) => {
        const propName = entry[0];
        if (Reflect.getMetadata(IGNORE_SERIALIZATION, clazz, propName)) {
            return;
        }
        let value = entry[1];
        const serializedName = Reflect.getMetadata(SERIALIZED_NAME, clazz, propName) || propName;
        const serializedConfig = Reflect.getMetadata(SERIALIZED_BY, clazz, propName) as SerializedConfig<T>;
        if (serializedConfig) {
            if (serializedConfig.isArray) {
                value = (value as []).map((arrayItem) => serializeToData(arrayItem));
            } else {
                value = serializeToData(value as {});
            }
        }
        jsonMappingObject[serializedName] = value;
    });
    return jsonMappingObject;
}

export function deserialize<T extends {}>(json: string | DataObject, constructorOrTarget?: ClassConstructor<T> | T): T | undefined {
    let target: T;
    try {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        if (constructorOrTarget instanceof Function) {
            target = new constructorOrTarget();
        } else if (constructorOrTarget !== undefined) {
            target = constructorOrTarget;
        } else {
            target = {} as T;
        }
        deserializeFrom(data, target);
        return target
    } catch (e) {
        console.error('failed to deserialize', json, e);
    }
}

export function deserializeArray<T extends {}>(json: string | Array<DataObject>, constructor?: ClassConstructor<T> | ClassConstructor<T[]>): T[] {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (!(data instanceof Array)) {
        return [];
    }
    return data.compactMap((item) => deserialize(item, constructor as ClassConstructor<T>));
}

export function deserializeFrom<T extends {}>(data: {}, target: T): void {
    const clazz = target.constructor;
    const serializedNameMapping = (Reflect.getMetadata(SERIALIZED_NAME, clazz) as SerializedNameMapping) || [];

    if (data) {
        Object.keys(data).forEach((serializedName) => {
            const propName = serializedNameMapping[serializedName] || serializedName;
            if (Reflect.getMetadata(IGNORE_SERIALIZATION, clazz, propName)) {
                return;
            }
            let value = data[serializedName];
            const serializedConfig = Reflect.getMetadata(SERIALIZED_BY, clazz, propName) as SerializedConfig<T>;
            if (serializedConfig) {
                const creator = buildCreator(serializedConfig);
                value = creator(value);
            }
            target[propName] = value;
        });
    }
}
