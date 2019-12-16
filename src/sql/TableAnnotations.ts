import "reflect-metadata";
import { decamelize } from "@/utils/Camelize";

type ValueConverter = (v: any) => any;

const FIELD_KEY = Symbol("Field");
const FIELD_MAPPING_KEY = Symbol("FieldMapping");
const TABLE_KEY = Symbol("Table");
const IGNORED_FIELDS_KEY = Symbol("IngoredFields");
let CAMELIZE = true;

export enum FieldType {
    VARCHAR,
    NUMBER,
    DATE
}

class TableDef {
    schema?: string;
    tableName: string;
    defaultInclude? = false;
    sequenceName?: string;
    hasCreateDate? = false;
    hasUpdateDate? = false;
}

class FieldDef {
    fieldName?: string;
    propName?: string;
    type?: FieldType;
    isPrimaryKey?: boolean;
}

type ConstructorFunction<T extends Object> = new (...args: any[]) => T;

export function Table(tableDef: TableDef): ClassDecorator {
    if (tableDef.defaultInclude === undefined) {
        tableDef.defaultInclude = true;
    }
    return function<TFunction extends Function>(target: TFunction) {
        Reflect.metadata(TABLE_KEY, tableDef)(target);
    };
}

export function Field<T>(fieldDef?): PropertyDecorator {
    return function(target: T, propName: string) {
        fieldDef = fieldDef || {};
        let fieldName = fieldDef.fieldName || getFieldName(propName);
        let fieldType = fieldDef.type || FieldType.VARCHAR;
        let isPK = !!fieldDef.isPrimaryKey;
        registerFieldDef(target, propName, fieldName, fieldType, isPK);
    };
}

export const IgnoreField: PropertyDecorator = <T extends Object>(target: T, propName: string) => {
    const clazz = target.constructor as ConstructorFunction<T>;
    let fieldList: string[] =
        Reflect.getMetadata(IGNORED_FIELDS_KEY, clazz) || [];
    fieldList.push(propName);
    Reflect.metadata(IGNORED_FIELDS_KEY, fieldList)(clazz);
}

function registerFieldDef<T extends Object>(
    target: T,
    propName: string,
    fieldName: string,
    fieldType: FieldType,
    isPrimaryKey: boolean
) {
    const clazz = target.constructor as ConstructorFunction<T>;
    let fieldDef: FieldDef = Reflect.getMetadata(FIELD_KEY, clazz, propName);
    if (!fieldDef) {
        fieldDef = new FieldDef();
    }
    fieldDef.fieldName = fieldName;
    fieldDef.propName = propName;
    fieldDef.type = fieldType;
    fieldDef.isPrimaryKey = isPrimaryKey;

    Reflect.metadata(FIELD_KEY, fieldDef)(target, propName);
    let fieldMapping: Map<string, FieldDef> =
        Reflect.getMetadata(FIELD_MAPPING_KEY, clazz) || new Map();
    fieldMapping.set(propName, fieldDef);
    Reflect.metadata(FIELD_MAPPING_KEY, fieldMapping)(clazz);
}

class TableMeta<T> {
    schema?: string;
    tableName: string;
    fields: Map<string, FieldDef>;
    primaryKey?: FieldDef;
    sequenceName?: string;
    hasCreateDate? = false;
    hasUpdateDate? = false;

    getFieldDefByFieldName(fieldName: string) {
        for (let field of this.fields) {
            let fieldDef = field[1];
            if (fieldDef.fieldName == fieldName) {
                return fieldDef;
            }
        }
    }
}

export function getTableMeta<T extends Object>(object: T): TableMeta<T> {
    const clazz = object.constructor as ConstructorFunction<T>;
    const tableMeta = new TableMeta();
    let tableDef = Reflect.getMetadata(TABLE_KEY, clazz);
    if (tableDef) {
        tableMeta.schema = tableDef.schema || "";
        tableMeta.tableName = tableDef.tableName;
        tableMeta.sequenceName = tableDef.sequenceName;
        tableMeta.hasCreateDate = !!tableDef.hasCreateDate;
        tableMeta.hasUpdateDate = !!tableDef.hasUpdateDate;
    } else {
        tableDef = new TableMeta();
    }

    const ignoreFields: string[] =
        Reflect.getMetadata(IGNORED_FIELDS_KEY, clazz) || [];

    const fields: Map<string, FieldDef> =
        Reflect.getMetadata(FIELD_MAPPING_KEY, clazz) || new Map();

    for (let fieldEntry of fields) {
        let fieldDef = fieldEntry[1];
        if (fieldDef.isPrimaryKey) {
            tableMeta.primaryKey = fieldDef;
        }
        break;
    }

    if (tableDef.defaultInclude) {
        Object.keys(object).forEach(propName => {
            let propValue = object[propName];
            if (propValue && propValue instanceof Function) {
                return;
            }
            if (ignoreFields.indexOf(propName) != -1) {
                return;
            }
            if (fields.has(propName)) {
                return;
            }
            let fieldDef: FieldDef = new FieldDef();
            fieldDef.fieldName = getFieldName(propName);
            fieldDef.propName = propName;
            fields.set(propName, fieldDef);
        });
    }

    tableMeta.fields = fields;
    return tableMeta;
}

function getFieldName(propName: string): string {
    return CAMELIZE ? decamelize(propName).toUpperCase() : propName;
}
