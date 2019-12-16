import * as _ from "lodash";
import { Jinst } from "./Jinst";
import { CallableStatement } from "./CallableStatement";
import { PreparedStatement } from "./PreparedStatement";
import { DatabaseMetaData } from "./DatabaseMetaData";
import { Statement } from "./Statement";
import { Savepoint } from "./Savepoint";
import { SqlWarning } from "./SqlWarning";

const java = Jinst.getInstance();

if (!Jinst.isJvmCreated()) {
    Jinst.addOption("-Xrs");
}

export class Connection {
    private _conn;
    private _txniso: string[];

    constructor(conn) {
        this._conn = conn;
        this._txniso = (() => {
            var txniso: string[] = [];
            txniso[
                java.getStaticFieldValue(
                    "java.sql.Connection",
                    "TRANSACTION_NONE"
                )
            ] = "TRANSACTION_NONE";
            txniso[
                java.getStaticFieldValue(
                    "java.sql.Connection",
                    "TRANSACTION_READ_COMMITTED"
                )
            ] = "TRANSACTION_READ_COMMITTED";
            txniso[
                java.getStaticFieldValue(
                    "java.sql.Connection",
                    "TRANSACTION_READ_UNCOMMITTED"
                )
            ] = "TRANSACTION_READ_UNCOMMITTED";
            txniso[
                java.getStaticFieldValue(
                    "java.sql.Connection",
                    "TRANSACTION_REPEATABLE_READ"
                )
            ] = "TRANSACTION_REPEATABLE_READ";
            txniso[
                java.getStaticFieldValue(
                    "java.sql.Connection",
                    "TRANSACTION_SERIALIZABLE"
                )
            ] = "TRANSACTION_SERIALIZABLE";
            return txniso;
        })();
    }

    async abort(executor) {
        throw new Error("NOT IMPLEMENTED");
    }

    async clearWarnings() {
        return await this._conn.clearWarnings$();
    }

    async close() {
        return await this._conn.close$();
    }

    async commit() {
        return await this._conn.commit$();
    }

    async createArrayOf(typename, objarr) {
        throw new Error("NOT IMPLEMENTED");
    }

    async createBlob() {
        throw new Error("NOT IMPLEMENTED");
    }

    async createClob() {
        throw new Error("NOT IMPLEMENTED");
    }

    async createNClob() {
        throw new Error("NOT IMPLEMENTED");
    }

    async createSQLXML() {
        throw new Error("NOT IMPLEMENTED");
    }

    async createStatement(): Promise<Statement> {
        let stmt = await this._conn.createStatement$();
        return new Statement(stmt);
    }

    async createStruct(typename, attrarr) {
        throw new Error("NOT IMPLEMENTED");
    }

    async getAutoCommit(): Promise<boolean> {
        return await this._conn.getAutoCommit$();
    }

    async getCatalog(): Promise<string> {
        return await this._conn.getCatalog$();
    }

    async getClientInfo(name): Promise<string> {
        return await this._conn.getClientInfo$(name);
    }

    async getHoldability(): Promise<number> {
        return await this._conn.getHoldability$();
    }

    async getMetaData(): Promise<DatabaseMetaData> {
        let dbm = await this._conn.getMetaData$();
        return new DatabaseMetaData(dbm);
    }

    async getNetworkTimeout(): Promise<number> {
        return await this._conn.getNetworkTimeout$();
    }

    async getSchema(): Promise<string> {
        return await this._conn.getSchema$();
    }

    async getTransactionIsolation(): Promise<string> {
        var self = this;

        let txniso = await self._conn.getTransactionIsolation$();
        return self._txniso[txniso];
    }

    async getTypeMap() {
        return await this._conn.getTypeMap$();
    }

    async getWarnings(): Promise<SqlWarning> {
        let sw = await this._conn.getWarnings$();
        return new SqlWarning(sw);
    }

    async isClosed(): Promise<boolean> {
        return this._conn.isClosed$();
    }

    isClosedSync(): boolean {
        return this._conn.isClosedSync();
    }

    async isReadOnly(): Promise<boolean> {
        return await this._conn.isReadOnly$();
    }

    isReadOnlySync(): boolean {
        return this._conn.isReadOnlySync();
    }

    async isValid(timeout): Promise<boolean> {
        return this._conn.isValid$(timeout);
    }

    isValidSync(timeout): boolean {
        return this._conn.isValidSync(timeout);
    }

    async nativeSQL(sql) {
        throw new Error("NOT IMPLEMENTED");
    }

    async prepareCall(
        sql: string,
        rstype?: number,
        rsconcurrency?: number,
        rsholdability?: number
    ): Promise<CallableStatement> {
        let cstmt = await this._conn.prepareCall$(...arguments);
        return new CallableStatement(cstmt);
    }

    async prepareStatement(
        sql: string,
        arg1?: number | number[] | string[],
        arg2?: number,
        arg3?: number
    ): Promise<PreparedStatement> {
        let pstmt = await this._conn.prepareStatement$(...arguments);
        return new PreparedStatement(pstmt);
    }

    async releaseSavepoint(savepoint: Savepoint) {
        return await this._conn.releaseSavepoint$(savepoint.javaObject);
    }

    async rollback(savepoint?: Savepoint) {
        if (savepoint) {
            return await this._conn.rollback$(savepoint.javaObject);
        } else {
            return await this._conn.rollback$();
        }
    }

    async setAutoCommit(autocommit: boolean) {
        return await this._conn.setAutoCommit$(autocommit);
    }

    async setCatalog(catalog: string) {
        return await this._conn.setCatalog$();
    }

    async setClientInfo(name: string, value: string) {
        return await this._conn.setClientInfo$(name, value);
    }

    async setClientInfos(props) {
        throw new Error("NOT IMPLEMENTED");
    }

    async setHoldability(holdability: boolean) {
        return this._conn.setHoldability$(holdability);
    }

    async setNetworkTimeout(executor, ms) {
        throw new Error("NOT IMPLEMENTED");
    }

    async setReadOnly(readonly: boolean) {
        return await this._conn.setReadOnly$(readonly);
    }

    async setSavepoint(name: string): Promise<Savepoint> {
        let sp = await this._conn.setSavepoint$(...arguments);
        return new Savepoint(sp);
    }

    async setSchema(schema: string) {
        return await this._conn.setSchema$(schema);
    }

    async setTransactionIsolation(txniso: number) {
        return await this._conn.setTransactionIsolation$(txniso);
    }

    async setTypeMap(map) {
        throw new Error("NOT IMPLEMENTED");
    }

    get native() {
        return this._conn;
    }
}

function allType(array, type) {
    _.each(array, function(el) {
        if (typeof el !== type) {
            return false;
        }
    });

    return true;
}
