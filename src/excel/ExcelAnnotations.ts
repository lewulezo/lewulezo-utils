import "reflect-metadata";

const columnKey = Symbol("Column");
// const excelPropertiesKey = Symbol("ExcelProperties");
const columnMappingKey = Symbol("ColumnMapping");

type ValueConverter = (v: any) => any;
export class ColumnDef {
    constructor(
        public columnName: string,
        public propName: string,
        public readConverter?: ValueConverter,
        public writeConverter?: ValueConverter
    ) {}
}

//Annotation
export function Column (
    value: string,
    readConverter?: ValueConverter,
    writeConverter?: ValueConverter
): PropertyDecorator {
    return function(target: Object, propertyKey: string) {
        registerColumnName(
            target,
            propertyKey,
            value,
            readConverter,
            writeConverter
        );
    };
}

export function registerColumnName(
    target: Object,
    propName: string,
    columnName: string,
    readConverter?: ValueConverter,
    writeConverter?: ValueConverter
) {
    const clazz = target.constructor;
    let columeDef = new ColumnDef(
        columnName,
        propName,
        readConverter,
        writeConverter
    );
    Reflect.metadata(columnKey, columeDef)(target, propName);
    // let excelProperties: string[] =
    //     Reflect.getMetadata(excelPropertiesKey, target) || [];
    let columnMapping: Map<string, ColumnDef> =
        Reflect.getMetadata(columnMappingKey, clazz) || new Map();
    // excelProperties.push(propName);
    columnMapping.set(columnName, columeDef);
    // Reflect.metadata(excelPropertiesKey, excelProperties)(target);
    Reflect.metadata(columnMappingKey, columnMapping)(clazz);
}

export function getColumnDefs(target: any): ColumnDef[] {
    let clazz = target.constructor;
    let columnMap: Map<string, ColumnDef> = Reflect.getMetadata(
        columnMappingKey,
        clazz
    );
    if (!columnMap) {
        return [];
    }
    let columnDefs: ColumnDef[] = [];
    for (let colDef of columnMap.values()) {
        columnDefs.push(colDef);
    }
    return columnDefs;
}

export function getColumnName(
    target: any,
    propName: string
): string | undefined {
    let columnDef = getColumnDefByPropertyName(target, propName);
    return columnDef ? columnDef.columnName : undefined;
}

export function getPropName(
    target: any,
    columnName: string
): string | undefined {
    let columnDef = getColumnDefByColumnName(target, columnName);
    return columnDef ? columnDef.propName : undefined;
}

export function getColumnDefByPropertyName(
    target: any,
    propName: string
): ColumnDef {
    return Reflect.getMetadata(columnKey, target, propName);
}

export function getColumnDefByColumnName(
    target: any,
    columnName: string
): ColumnDef | undefined {
    let clazz = target.constructor;
    let columnMapping: Map<string, ColumnDef> = Reflect.getMetadata(
        columnMappingKey,
        clazz
    );
    if (!columnMapping) {
        return undefined;
    }
    return columnMapping.get(columnName);
}
