import { getTableMeta, FieldType } from "@/sql";
import { isFunction } from "@/utils";
import * as Moment from "moment";

export function generateInsertSql<T>(entity: T) {
    const tableMeta = getTableMeta(entity);
    let tableName = getTableName(tableMeta.schema, tableMeta.tableName);
    let fieldNames: string[] = [];
    let fieldValues: string[] = [];
    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        let fieldName = fieldDef.fieldName!;
        let fieldValue;
        if (
            entity[propName] === undefined &&
            fieldDef.isPrimaryKey &&
            tableMeta.sequenceName
        ) {
            fieldValue =
                getTableName(tableMeta.schema, tableMeta.sequenceName) +
                `.NEXTVAL`;
        } else if (tableMeta.hasCreateDate && fieldName == 'CREATE_DATE' && entity['createDate'] === undefined){
            fieldValue = 'SYSDATE';
        } else {
            fieldValue = getSqlValue(entity[propName], fieldDef.type!);
        }
        fieldNames.push(fieldName);
        fieldValues.push(fieldValue);
    }
    if (tableMeta.hasCreateDate && fieldNames.indexOf('CREATE_DATE') == -1) {
        fieldNames.push("CREATE_DATE");
        fieldValues.push("SYSDATE");
    }
    return (
        `INSERT INTO ${tableName} (${fieldNames.join(", ")}) \n` +
        `SELECT ${fieldValues.join(", ")} FROM DUAL;\n`
    );
}

interface FieldNameValueEntry {
    fieldName: string;
    fieldValue: string;
}

function outputSetItem(item: FieldNameValueEntry) {
    return `${item.fieldName} = ${item.fieldValue}`;
}

function outputWhereItem(item: FieldNameValueEntry) {
    return `${item.fieldName} = ${item.fieldValue}`;
}

export function generateUpdateSql<T>(entity: T, whereProps: string[] = []) {
    const tableMeta = getTableMeta(entity);

    let tableName = getTableName(tableMeta.schema, tableMeta.tableName);

    let setItems: FieldNameValueEntry[] = [];
    let whereItems: FieldNameValueEntry[] = [];
    if (whereProps.length == 0) {
        if (!tableMeta.primaryKey) {
            throw new Error("Cannot update without PK!!");
        }
        let pkFieldName = tableMeta.primaryKey.fieldName!;
        let pkFieldValue = entity[tableMeta.primaryKey.propName!];
        if (!pkFieldValue) {
            throw new Error("PK value is null!!");
        }
        whereItems.push({fieldName: pkFieldName, fieldValue: pkFieldValue});
    } 

    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        if (fieldDef.isPrimaryKey) {
            continue;
        }
        if (tableMeta.hasUpdateDate && propName == 'updateDate' && entity['updateDate'] === undefined){
            setItems.push({
                fieldName: 'UPDATE_DATE',
                fieldValue: 'SYSDATE'
            })
        }
        
        if (entity[propName] === undefined) {
            continue;
        }
        if (whereProps.indexOf(propName) != -1) {
            whereItems.push({
                fieldName: fieldDef.fieldName!,
                fieldValue: getSqlValue(entity[propName], fieldDef.type!)
            })
        } else {
            setItems.push({
                fieldName: fieldDef.fieldName!,
                fieldValue: getSqlValue(entity[propName], fieldDef.type!)
            });
        }
    }
    if (tableMeta.hasUpdateDate && !setItems.find(item => item.fieldName == 'UPDATE_DATE') ) {
        setItems.push({
            fieldName: "UPDATE_DATE",
            fieldValue: "SYSDATE"
        });
    }

    return (
        `UPDATE ${tableName} \n` + 
        `SET ${setItems.map(outputSetItem).join(", ")} \n` +
        (whereItems.length
            ? "WHERE " + whereItems.map(outputWhereItem).join(" AND ")
            : "") +
        ';\n'
    );
}

export function generateSelectSql<T>(entity: T, selectProps?: string[]): string {
    const tableMeta = getTableMeta(entity);
    let tableName = getTableName(tableMeta.schema, tableMeta.tableName);

    let fieldNames: string[] = [];
    let whereItems: FieldNameValueEntry[] = [];
    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        let fieldName = fieldDef.fieldName!;
        if (selectProps)  {
            if (selectProps.indexOf(propName) != -1)  {
                fieldNames.push(fieldName);
            }
        } else {
            fieldNames.push(fieldName);
        }
        if (entity[propName] === undefined) {
            continue;
        }
        whereItems.push({
            fieldName: fieldName,
            fieldValue: getSqlValue(entity[propName], fieldDef.type!)
        });
    }

    return (
        `SELECT ${fieldNames.join(", ")} FROM ${tableName} \n` +
        (whereItems.length
            ? "WHERE " + whereItems.map(outputWhereItem).join(" AND ")
            : "")
    );
}

export function generateDeleteSql<T>(entity: T) {
    const tableMeta = getTableMeta(entity);
    let tableName = getTableName(tableMeta.schema, tableMeta.tableName);

    let whereItems: FieldNameValueEntry[] = [];
    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        let fieldName = fieldDef.fieldName!;
        if (entity[propName] === undefined) {
            continue;
        }
        whereItems.push({
            fieldName: fieldName,
            fieldValue: getSqlValue(entity[propName], fieldDef.type!)
        });
    }

    return (
        `DELETE ${tableName} ` +
        `WHERE ${whereItems.map(outputWhereItem).join(" AND ")};\n`
    );
}

function getSqlValue(value: any, fieldType: FieldType): string {
    if (value == null) {
        return 'NULL';
    }
    switch (fieldType) {
        case FieldType.NUMBER: {
            if (value == 0) {
                return 'NULL';
            }
            return `${value}`;
        }
        case FieldType.VARCHAR: {
            if (isFunction(value.replace)) {
                value  = value.replace(/\'/g, "''");
            }
            return `'${value}'`;
        }
        case FieldType.DATE: {
            let moment = Moment(value);
            return `TO_DATE('${moment.format("YYYYMMDD")}', 'YYYYMMDD')`;
        }
        default:
            return `'${value}'`;
    }
}

function getTableName(schema: string | undefined, tableName: string) {
    tableName = tableName || "${TABLE_NAME}";
    return schema ? `${schema}.${tableName}` : tableName;
}
