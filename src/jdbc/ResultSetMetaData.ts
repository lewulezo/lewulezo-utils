export class ResultSetMetaData {
    private _rsmd;

    constructor(rsmd) {
        this._rsmd = rsmd;
    }

    async getColumnCount(): Promise<number> {
        return await this._rsmd.getColumnCount$();
    }

    async getColumnLabel(i: number): Promise<string> {
        return await this._rsmd.getColumnLabel$(i);
    }

    async getColumnType(i: number): Promise<string> {
        return await this._rsmd.getColumnType$(i);
    }
}

export default ResultSetMetaData;
