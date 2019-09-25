import { getTableMeta, FieldType, Table, Field } from "./TableAnnotations";
import * as Moment from "moment";

export function generateInsertSql<T>(entity: T) {
    const tableMeta = getTableMeta(entity);
    let tableName = tableMeta.tableName || "${TABLE_NAME}";
    let fieldNames: string[] = [];
    let fieldValues: string[] = [];
    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        let fieldName = fieldDef.fieldName!;
        let fieldValue;
        if (
            !entity[propName] &&
            fieldDef.isPrimaryKey &&
            tableMeta.sequenceName
        ) {
            fieldValue = `${tableMeta.sequenceName}.NEXTVAL`;
        } else {
            fieldValue = getSqlValue(entity[propName], fieldDef.type!);
        }
        fieldNames.push(fieldName);
        fieldValues.push(fieldValue);
    }
    if (tableMeta.hasCreateDate) {
        fieldNames.push("create_date");
        fieldValues.push("SYSDATE");
    }
    return (
        `INSERT INTO ${tableName} (${fieldNames.join(", ")})\n` +
        `SELECT ${fieldValues.join(", ")} FROM DUAL;`
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

export function generateUpdateSql<T>(entity: T) {
    const tableMeta = getTableMeta(entity);
    if (!tableMeta.primaryKey) {
        throw new Error("Cannot update without PK!!");
    }

    let tableName = tableMeta.tableName || "${TABLE_NAME}";
    let setItems: FieldNameValueEntry[] = [];
    let pkFieldName = tableMeta.primaryKey.fieldName!;
    let pkFieldValue = entity[tableMeta.primaryKey.propName!];
    if (!pkFieldValue) {
        throw new Error("PK value is null!!");
    }

    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        if (fieldDef.isPrimaryKey) {
            continue;
        }
        if (!entity[propName]) {
            continue;
        }
        setItems.push({
            fieldName: fieldDef.fieldName!,
            fieldValue: getSqlValue(entity[propName], fieldDef.type!)
        });
    }
    if (tableMeta.hasUpdateDate) {
        setItems.push({
            fieldName: "update_date",
            fieldValue: "SYSDATE"
        });
    }

    return (
        `UPDATE ${tableName} SET ${setItems.map(outputSetItem).join(", ")} ` +
        `WHERE ${pkFieldName} = ${pkFieldValue};`
    );
}

export function generateSelectSql<T>(entity: T): string {
    const tableMeta = getTableMeta(entity);
    let tableName = tableMeta.tableName || "${TABLE_NAME}";
    let fieldNames: string[] = [];
    let whereItems: FieldNameValueEntry[] = [];
    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        let fieldName = fieldDef.fieldName!;
        fieldNames.push(fieldName);
        if (!entity[propName]) {
            continue;
        }
        whereItems.push({
            fieldName: fieldName,
            fieldValue: getSqlValue(entity[propName], fieldDef.type!)
        });
    }

    return (
        `SELECT ${fieldNames.join(", ")} FROM ${tableName}\n` +
        (whereItems.length
            ? "WHERE" + whereItems.map(outputWhereItem).join(" AND ")
            : "")
    );
}

export function generateDeleteSql<T>(entity: T) {
    const tableMeta = getTableMeta(entity);
    let tableName = tableMeta.tableName || "${TABLE_NAME}";
    let whereItems: FieldNameValueEntry[] = [];
    for (let fieldEntry of tableMeta.fields) {
        let propName = fieldEntry[0];
        let fieldDef = fieldEntry[1];
        let fieldName = fieldDef.fieldName!;
        if (!entity[propName]) {
            continue;
        }
        whereItems.push({
            fieldName: fieldName,
            fieldValue: getSqlValue(entity[propName], fieldDef.type!)
        });
    }

    return (
        `DELETE ${tableName} ` +
        `WHERE ${whereItems.map(outputWhereItem).join(" AND ")};`
    );
}

function getSqlValue(value: any, fieldType: FieldType): string {
    if (value == null) {
        return "NULL";
    }
    switch (fieldType) {
        case FieldType.NUMBER: {
            return `${value}`;
        }
        case FieldType.VARCHAR: {
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
