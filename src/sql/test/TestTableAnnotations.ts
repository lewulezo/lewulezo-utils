import {
    Table,
    Field,
    FieldType,
    IgnoreField,
    getTableMeta
} from "@/sql";

@Table({ tableName: "TM_USER" })
class User {
    @Field({ type: FieldType.NUMBER, isPrimaryKey: true })
    userId: number;

    @Field({ type: FieldType.VARCHAR })
    userName: string;

    userMobile: string;

    @IgnoreField
    uuid: string;
}

function test() {
    let user = new User();
    user.userId = 10000000232;
    user.userName = "张老三";
    user.userMobile = "188990003";
    user.uuid = "aff0-539c-2210-bb3f";

    console.log(getTableMeta(user));

    console.log("done");
}

test();
