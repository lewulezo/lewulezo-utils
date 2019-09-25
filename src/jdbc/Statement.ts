import * as _ from "lodash";

import { ResultSet } from "./ResultSet";
import { Jinst } from "./Jinst";

const java = Jinst.getInstance();

export class Statement {
    private _s;

    constructor(s) {
        this._s = s;
    }

    async addBatch(sql: string) {
        throw new Error("NOT IMPLEMENTED");
    }

    async cancel() {
        return await this._s.cancel$();
    }

    async clearBatch() {
        return await this._s.clearBatch$();
    }

    async close() {
        return await this._s.close$();
    }

    async executeUpdate(sql: string): Promise<number> {
        return await this._s.executeUpdate$(sql);
    }

    async executeQuery(sql: string): Promise<ResultSet> {
        let rs = await this._s.executeQuery$(sql);
        return new ResultSet(rs);
    }

    async execute(sql: string): Promise<ResultSet | number> {
        let isResultSet: boolean = await this._s.execute$(sql);
        if (isResultSet) {
            let rs = await this._s.getResultSet$();
            return new ResultSet(rs);
        } else {
            let count = await this._s.getUpdateCount$();
            return count;
        }
    }

    async getFetchSize(): Promise<number> {
        return await this._s.getFetchSize$();
    }

    async setFetchSize(rows: number) {
        return await this._s.setFetchSize$(rows);
    }

    async getMaxRows(): Promise<number> {
        return await this._s.getMaxRows$();
    }

    async setMaxRows(max: number) {
        return await this._s.setMaxRows$(max);
    }

    async getQueryTimeout(): Promise<number> {
        return await this._s.getQueryTimeout$();
    }

    async setQueryTimeout(seconds: number) {
        return await this._s.setQueryTimeout$(seconds);
    }

    async getGeneratedKeys(): Promise<ResultSet> {
        return new ResultSet(await this._s.getGeneratedKeys$());
    }
}

Jinst.events.once("initialized", function onInitialized() {
    // The constant indicating that the current ResultSet object should be closed
    // when calling getMoreResults.
    Statement["CLOSE_CURRENT_RESULT"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "CLOSE_CURRENT_RESULT"
    );

    // The constant indicating that the current ResultSet object should not be
    // closed when calling getMoreResults.
    Statement["KEEP_CURRENT_RESULT"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "KEEP_CURRENT_RESULT"
    );

    // The constant indicating that all ResultSet objects that have previously been
    // kept open should be closed when calling getMoreResults.
    Statement["CLOSE_ALL_RESULTS"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "CLOSE_ALL_RESULTS"
    );

    // The constant indicating that a batch statement executed successfully but that
    // no count of the number of rows it affected is available.
    Statement["SUCCESS_NO_INFO"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "SUCCESS_NO_INFO"
    );

    // The constant indicating that an error occured while executing a batch
    // statement.
    Statement["EXECUTE_FAILED"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "EXECUTE_FAILED"
    );

    // The constant indicating that generated keys should be made available for
    // retrieval.
    Statement["RETURN_GENERATED_KEYS"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "RETURN_GENERATED_KEYS"
    );

    // The constant indicating that generated keys should not be made available for
    // retrieval.
    Statement["NO_GENERATED_KEYS"] = java.getStaticFieldValue(
        "java.sql.Statement",
        "NO_GENERATED_KEYS"
    );
});
