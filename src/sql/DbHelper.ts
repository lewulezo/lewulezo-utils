import { JDBC } from "../jdbc";
import { getTableMeta } from "./TableAnnotations";

export async function doQuery<T extends Object>(
    sql: string,
    clazz: new () => T,
    pool: JDBC
): Promise<T[]> {
    let connection = await pool.getConnection();
    let stmt = await connection.createStatement();
    let rs = await stmt.executeQuery(sql);
    let records = await rs.toObjArray({ camelize: false });
    await rs.close();
    await stmt.close();
    pool.returnConnection(connection);

    let sampleObj = new clazz();
    let tableMeta = getTableMeta(sampleObj);
    if (!tableMeta) {
        throw new Error("cannot find table meta!!");
    }
    return records.map(record => {
        let retRecord: T = new clazz();
        Object.keys(record).forEach(fieldName => {
            let fieldDef = tableMeta.getFieldDefByFieldName(fieldName);
            if (!fieldDef || !fieldDef.propName) {
                return;
            }
            retRecord[fieldDef!.propName!] = record[fieldName];
        });
        return retRecord;
    });
}

export async function getSequance(
    sequanceName: string,
    pool: JDBC
): Promise<any> {
    let sql = `SELECT ${sequanceName}.NEXTVAL FROM DUAL`;
    let connection = await pool.getConnection();
    let stmt = await connection.createStatement();
    let rs = await stmt.executeQuery(sql);
    let result = await rs.toObjArray();
    await rs.close();
    await stmt.close();
    pool.returnConnection(connection);
    return result[0]["NEXTVAL"];
}
