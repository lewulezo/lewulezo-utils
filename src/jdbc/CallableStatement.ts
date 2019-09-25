import { PreparedStatement } from "./PreparedStatement";

export class CallableStatement extends PreparedStatement {
    private _cs;

    constructor(cs) {
        super(cs);
        this._cs = cs;
    }

    async getArray(arg1: number | string): Promise<any[]> {
        return await this._cs.getArray$(arg1);
    }

    async getBigDecimal(arg1: number | string) {
        return await this._cs.getBigDecimal$(arg1);
    }

    async getBlob(arg1: number | string) {
        return await this._cs.getBlob$(arg1);
    }

    async getBoolean(arg1: number | string): Promise<boolean> {
        return await this._cs.getBoolean$(arg1);
    }

    async getByte(arg1: number | string): Promise<number> {
        let byte = await this._cs.getByte$(arg1);
        return byte.byteValueSync();
    }

    async getBytes(arg1: number | string) {
        let bytes = await this._cs.getBytes$(arg1);
    }

    async getCharacterStream(arg1: number | string) {
        throw new Error("NOT IMPLEMENTED");
    }

    async getClob(arg1: number | string) {
        return await this._cs.getClob$(arg1);
    }

    async getDate(arg1: number | string): Promise<Date> {
        let date = await this._cs.getDate$(arg1);
        return new Date(date.getTimeSync().longValue);
    }

    async getDouble(arg1: number | string): Promise<number> {
        return await this._cs.getDouble$(arg1);
    }

    async getFloat(arg1: number | string): Promise<number> {
        return await this._cs.getFloat$(arg1);
    }

    async getInt(arg1: number | string): Promise<number> {
        return await this._cs.getInt$(arg1);
    }

    async getLong(arg1: number | string): Promise<number> {
        return await this._cs.getLong$(arg1);
    }

    async getNCharacterStream(arg1: number | string) {
        throw new Error("NOT IMPLEMENTED");
    }

    async getNClob(arg1: number | string) {
        return await this._cs.getNClob$(arg1);
    }

    async getNString(arg1: number | string) {
        return await this._cs.getNString$(arg1);
    }

    async getObject(arg1: number | string, arg2) {
        throw new Error("NOT IMPLEMENTED");
    }

    async registerOutParameter() {
        return await this._cs.registerOutParameter$(...arguments);
    }
}
