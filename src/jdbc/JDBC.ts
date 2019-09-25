import { Jinst } from "./Jinst";
import { Pool, JdbcPoolConfig } from "./Pool";

if (!Jinst.isJvmCreated()) {
    Jinst.addOption("-Xrs");
    Jinst.setupClasspath([
        "./drivers/hsqldb.jar",
        "./drivers/derby.jar",
        "./drivers/derbyclient.jar",
        "./drivers/derbytools.jar",
        "./drivers/ojdbc8.jar"
    ]);
}

export class JDBC extends Pool {
    constructor(config: JdbcPoolConfig) {
        super(config);
    }
}
