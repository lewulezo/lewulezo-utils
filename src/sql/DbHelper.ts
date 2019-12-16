import { getTableMeta } from "./TableAnnotations";
import { JDBC } from "../jdbc";
import { concurrentExecute } from "../utils/ConcurrentExecutor";

type PoolConstructor = () => Promise<JDBC>;

export class DbHelper {
    constructor(public getPool: PoolConstructor) {
    }

    async doQuery<T extends Object>(
        sql: string,
        clazz: new () => T
    ): Promise<T[]> {
        let pool = await this.getPool();
        let connection = await pool.getConnection();
        let stmt = await connection.createStatement();
        let rs, records;
        try {
            rs = await stmt.executeQuery(sql);
            records = await rs.getRows({ camelize: false });
        } catch (e) {
            throw new Error(`query failed...${e.message}`)
        }
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
    
    async getSequance(sequanceName: string): Promise<any> {
        let sql = `SELECT ${sequanceName}.NEXTVAL FROM DUAL`;
        let pool = await this.getPool();
        let connection = await pool.getConnection();
        let stmt = await connection.createStatement();
        let rs = await stmt.executeQuery(sql);
        let result:Object[] = await rs.getRows();
        await rs.close();
        await stmt.close();
        pool.returnConnection(connection);
        return result[0]["NEXTVAL"];
    }
    
    async doBatchUpdate(sql:string) {
        let pool = await this.getPool();
        let connection = await pool.getConnection();
        await connection.setAutoCommit(false);
        let stmt = await connection.createStatement();
        let sqlLines = sql.split(';');
        try {
            await concurrentExecute(sqlLines, 1, async sqlLine => {
                sqlLine = sqlLine.trim();
                if (!sqlLine || sqlLine.startsWith('--')) {
                    return;
                }
                console.log(`Excecute sql: ${sqlLine}`);
                let cnt = await stmt.executeUpdate(sqlLine);
                console.log(`update result ${cnt} lines`);
                if (cnt > 1) {
                    throw new Error(`update failed in sql:${sqlLine}`);
                }
            });
        } catch (e) {
            console.log(`----- do rollback -----`);
            await connection.rollback();
            throw new Error(`batch execute failed...${e.message}`)
        }
        console.log(`----- commit! -----`);
        await connection.commit();
        await stmt.close();
        pool.returnConnection(connection);
    }
}
