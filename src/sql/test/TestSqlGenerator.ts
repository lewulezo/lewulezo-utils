import { Table, Field, FieldType } from "@/sql/TableAnnotations";
import {
    generateInsertSql,
    generateUpdateSql,
    generateDeleteSql,
    generateSelectSql
} from "@/sql/SqlGenerator";

//---------------------- test --------------------------

@Table({
    tableName: "SH_SMCVDMS_METADATA_SIT.TM_APP",
    sequenceName: "SH_SMCVDMS_METADATA_SIT.SEQ_TM_APP"
})
class App {
    @Field({ type: FieldType.NUMBER, isPrimaryKey: true })
    appId: number;

    @Field({ type: FieldType.VARCHAR })
    appCode: string;

    @Field({ type: FieldType.VARCHAR })
    appName: string;

    @Field({ type: FieldType.VARCHAR })
    appStatus: string;

    @Field({ type: FieldType.VARCHAR })
    appUrl: string;

    @Field({ type: FieldType.VARCHAR })
    iconClass: string;

    @Field({ type: FieldType.DATE })
    appOnlineDate: Date;

    @Field({ type: FieldType.DATE })
    appOfflineDate: Date;
}

function test() {
    let app1 = new App();
    app1.appCode = "WEBASC";
    app1.appName = "海外服务商管理系统";
    app1.appStatus = "10011001";

    let sql = generateInsertSql(app1);
    console.log(sql);
    app1.appId = 1000001021;
    sql = generateUpdateSql(app1);
    console.log(sql);

    sql = generateSelectSql(app1);
    console.log(sql);

    sql = generateDeleteSql(app1);
    console.log(sql);
}

test();
