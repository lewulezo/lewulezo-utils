import { ResultSet } from "./ResultSet";
import { ResultSetMetaData } from "./ResultSetMetaData";
import { Statement } from "./Statement";
import { Jinst } from "./Jinst";
import { TypeHandler } from "./TypeHandler";

const java = Jinst.getInstance();

if (!Jinst.isJvmCreated()) {
    Jinst.addOption("-Xrs");
}

export class PreparedStatement extends Statement {
    private _ps;

    constructor(ps) {
        super(ps);
        this._ps = ps;
    }

    async addBatch() {
        return await this._ps.addBatch$();
    }

    async clearParameters() {
        return await this._ps.clearParameters$();
    }

    async execute(): Promise<ResultSet | number> {
        let isResultSet = await this._ps.execute$();
        if (isResultSet) {
            return new ResultSet(await this._ps.getResultSet$());
        } else {
            return await this._ps.getUpdateCount$();
        }
    }

    async executeBatch(): Promise<number[]> {
        return await this._ps.executeBatch$();
    }

    async executeQuery(): Promise<ResultSet> {
        return new ResultSet(await this._ps.executeQuery$());
    }

    async executeUpdate() {
        return await this._ps.executeUpdate$();
    }

    async getMetaData() {
        return new ResultSetMetaData(await this._ps.getMetaData$());
    }

    async getParameterMetaData() {
        throw new Error("NOT IMPLEMENTED");
    }

    async setArray(index: number, val) {
        throw new Error("NOT IMPLEMENTED");
    }

    async setAsciiStream(index: number, val, length: number) {
        // length is optional, or can be int or long.
        throw new Error("NOT IMPLEMENTED");
    }

    // val must be a java.math.BigDecimal
    async setBigDecimal(index: number, val: number) {
        return await this._ps.setBigDecimal$(
            index,
            TypeHandler.toJavaBigDecimal(val)
        );
    }

    async setBinaryStream(index: number, val, length: number) {
        // length is optional, or can be int or long.
        throw new Error("NOT IMPLEMENTED");
    }

    async setBlob(index: number, val, length: number) {
        // length is optional.  Must be java.lang.Long if supplied, only valid with
        // InputStream.
        // val can be java.sql.Blob or java.io.InputStream
        throw new Error("NOT IMPLEMENTED");
    }

    async setBoolean(index: number, val: boolean) {
        return await this._ps.setBoolean$(index, val);
    }

    async setByte(index: number, val: number) {
        return await this._ps.setByte$(index, TypeHandler.toJavaByte(val));
    }

    async setBytes(index: number, val: Buffer) {
        return await this._ps.setBytes$(index, TypeHandler.toJavaBytes(val));
    }

    async setCharacterStream(index, val, length) {
        // length is optional, or can be int or long.
        // val must be a java.io.Reader
        throw new Error("NOT IMPLEMENTED");
    }

    async setClob(index, val, length) {
        // length is optional, must be a long, only valid with a java.io.Reader.
        // val can be a java.io.Reader or a java.sql.Clob
        throw new Error("NOT IMPLEMENTED");
    }

    async setDate(index: number, val: Date) {
        return await this._ps.setDate$(index, TypeHandler.toJavaSqlDate(val));
    }

    async setDouble(index: number, val: number) {
        return await this._ps.setDouble$(index, java.newDouble(val));
    }

    async setFloat(index: number, val: number) {
        return await this._ps.setFloat$(index, java.newFloat(val));
    }

    async setInt(index: number, val: number) {
        return await this._ps.setInt$(index, val);
    }

    async setLong(index: number, val: number) {
        return await this._ps.setLong$(index, java.newLong(val));
    }

    async setString(index: number, val: string) {
        return await this._ps.setString$(index, val);
    }

    async setTime(index: number, val: Date) {
        return await this._ps.setTime$(index, TypeHandler.toJavaSqlTime(val));
    }
}
