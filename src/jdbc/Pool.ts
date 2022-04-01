import * as uuid from "uuid";
import { Jinst } from "./Jinst";
import { DriverManager, ConnectionConfig } from "./DriverManager";
import { Connection } from "./Connection";
import { ConnectionContext } from "./ConnectionContext";
import {Optional} from "../utils";

const java = Jinst.getInstance();

if (!Jinst.isJvmCreated()) {
    Jinst.addOption("-Xrs");
}

export interface JdbcPoolConfig {
    url: string;
    user?: string;
    password?: string;
    driverName?: string;
    minPoolSize?: number;
    maxPoolSize?: number;
    keepAlive?: KeppAlive;
    maxIdle?: number;
}

interface KeppAlive {
    interval: number;
    query: string;
    enabled: boolean;
}

export class Pool {
    private _url: string;
    private _dmConfig: ConnectionConfig;
    private _drivername: string;
    private _minpoolsize: number;
    private _maxpoolsize: number;
    private _keepalive;
    private _maxidle?: number;
    private _pool: ConnectionContext[];

    constructor(config: JdbcPoolConfig) {
        this._url = config.url;
        // NOTE: https://docs.oracle.com/javase/7/docs/api/java/util/Properties.html#getProperty(java.lang.String)
        // if property does not exist it returns 'null' in the new java version, so we can use _.isNil to support
        // older versions as well
        this._dmConfig = {
            user: config.user,
            password: config.password
        };
        this._drivername = config.driverName || "";
        this._minpoolsize = config.minPoolSize || 1;
        this._maxpoolsize = config.maxPoolSize || 1;
        this._keepalive = config.keepAlive || {
            interval: 60000,
            query: "select 1 from dual",
            enabled: false
        };
        if (!this._keepalive.enabled) {
            this._maxidle = config.maxIdle;
        }
        this._pool = [];
    }

    private async addConnection(): Promise<ConnectionContext> {
        console.log(`add connection...`);
        let conn = await DriverManager.getConnection(this._url, this._dmConfig);
        let connCtx: ConnectionContext = {
            uuid: uuid.v4(),
            conn: conn,
            reserved: false
        };
        if (this._keepalive.enabled) {
            this.keepAlive(conn);
        }
        if (this._maxidle) {
            connCtx.lastIdle = new Date().getTime();
        }
        console.log(`add connection ${connCtx.uuid}`);
        return connCtx;
    }

    private async keepAlive(conn: Connection) {
        let statement = await conn.createStatement();
        await statement.execute(this._keepalive.query);
        setTimeout(this.keepAlive, this._keepalive.interval);
    }

    get status() {
        let self = this;
        let status: any = {
            total: self._pool.length
        };
        let available = 0;
        let reserved = 0;

        self._pool.forEach(connCtx => {
            if (connCtx.reserved) {
                reserved++;
            } else {
                available++;
            }
        });
        status.available = available;
        status.reserved = reserved;
        return status;
    }

    async initialize() {
        console.log(`initialize connection pool...`);
        let self = this;
        if (self._drivername) {
            let driver = java.newInstanceSync(this._drivername);
            await DriverManager.registerDriver(driver);
        }
        for (let i = 0; i < self._minpoolsize; i++) {
            let connCtx = await self.addConnection();
            self._pool.push(connCtx);
        }
        console.log(
            `initialize connection pool: ${this._pool.length} connections`
        );
        Jinst.events.emit("initializDriverManager");
    }

    async getConnection(): Promise<Connection> {
        let self = this;
        let result: Optional<ConnectionContext>;
        await self.closeIdleConnections();

        result = self._pool.find(connCtx => !connCtx.reserved);

        if (!result && this._pool.length < self._maxpoolsize) {
            let connCtx = await this.addConnection();
            self._pool.push(connCtx);
            result = connCtx;
        }

        if (!result) {
            throw new Error("No more pool connections available");
        }
        // console.log(`reserve connection ${result.uuid}`);
        result.reserved = true;
        return result.conn;
    }

    private async closeIdleConnections() {
        if (!this._maxidle) {
            return;
        }
        let self = this;
        let time = new Date().getTime();

        let toBeClosed: ConnectionContext[] = [];
        self._pool = self._pool.filter(connCtx => {
            if (
                !connCtx.reserved &&
                connCtx.lastIdle &&
                connCtx.lastIdle + self._maxidle! > time
            ) {
                toBeClosed.push(connCtx);
                return false;
            }
            return true;
        });

        await Promise.all(
            toBeClosed.map(async connCtx => {
                console.log(`close idle connection ${connCtx.uuid}`);
                await connCtx.conn.close();
            })
        );
    }

    returnConnection(conn: Connection) {
        let self = this;
        let connCtx = self._pool.find(connContext => {
            return connContext.conn == conn;
        });
        if (!connCtx) {
            throw new Error("Cannot find connection to release");
        }
        // console.log(`release connection ${connCtx.uuid}...`);
        connCtx.reserved = false;
        if (self._maxidle) {
            connCtx.lastIdle = new Date().getTime();
        }
    }

    async purge() {
        console.log(`purge connection ${this._pool.length} connections...`);
        let self = this;
        await Promise.all(
            self._pool.map(async connCtx => {
                console.log(`close connection ${connCtx.uuid}`);
                await connCtx.conn.close();
            })
        );
        console.log(`purge connection ${this._pool.length} connections done`);
    }
}
