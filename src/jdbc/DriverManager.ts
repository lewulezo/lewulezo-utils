import { Jinst } from "./jinst";
import { Connection } from "./Connection";
import { TypeHandler } from "./TypeHandler";

export interface ConnectionConfig {
    user?: string;
    password?: string;
    props?: Object;
}

export namespace DriverManager {
    const java = Jinst.getInstance();

    const DM = "java.sql.DriverManager";
    function callStaticAsync(that, methodName: string, ...args): Promise<any> {
        return java["callStaticMethod$"](...arguments);
    }

    export async function getConnection(
        url: string,
        config: ConnectionConfig = {}
    ): Promise<Connection> {
        let conn: Connection;
        if (config.props) {
            conn = await callStaticAsync(
                DM,
                "getConnection",
                url,
                TypeHandler.toJavaProperties(config.props)
            );
        } else if (config.user) {
            conn = await callStaticAsync(
                DM,
                "getConnection",
                url,
                config.user,
                config.password
            );
        } else {
            conn = await callStaticAsync(DM, "getConnection");
        }
        return new Connection(conn);
    }

    export async function getLoginTimeout(): Promise<number> {
        return await callStaticAsync(DM, "getLoginTimeout");
    }

    export async function registerDriver(driver: string) {
        return await callStaticAsync(DM, "registerDriver", driver);
    }

    async function setLoginTimeout(seconds: number): Promise<boolean> {
        return await callStaticAsync(DM, "setLoginTimeout", seconds);
    }
}
