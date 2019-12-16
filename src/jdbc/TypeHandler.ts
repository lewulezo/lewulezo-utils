import { Jinst } from "./Jinst";
const java = Jinst.getInstance();

if (!java.isJvmCreated()) {
    Jinst.addOption("-Xrs");
}

export namespace TypeHandler {
    export function toJavaSqlDate(date: Date) {
        return java.newInstanceSync(
            "java.sql.Date",
            java.newLong(date.getTime())
        );
    }

    export function fromJavaDate(date): Date {
        return new Date(Number(date.getTimeSync().longValue));
    }

    export async function fromJavaDateAsync(date): Promise<Date> {
        let time = await date.getTime$();
        return new Date(Number(time.longValue));
    }

    export function toJavaSqlTime(time: Date) {
        return java.newInstanceSync(
            "java.sql.Time",
            java.newLong(time.getTime())
        );
    }

    export function fromJavaSqlTime(time): Date {
        return new Date(Number(time.getTimeSync().longValue));
    }

    export async function fromJavaSqlTimeAsync(time): Promise<Date> {
        let val = await time.getTime$();
        return new Date(Number(val.longValue));
    }

    export function toJavaByte(byte: number) {
        return java.newByte(byte);
    }

    export function fromJavaByte(byte): number {
        return byte.byteValueSync();
    }

    export async function fromJavaByteAsync(byte): Promise<number> {
        return await byte.byteValue$();
    }

    export function toJavaBytes(buf: Buffer) {
        return java.newArray("byte", [...buf]);
    }

    export function fromJavaBytes(bytes): Buffer {
        let length = bytes.length;
        let buf = Buffer.alloc(length);
        for (var i = 0; i < length; i++) {
            buf.writeInt8(bytes[i], i);
        }
        return buf;
    }

    export function toJavaBigDecimal(number: number) {
        return java.newInstanceSync(
            "java.math.BigDecimal",
            java.newDouble(number)
        );
    }

    export function fromJavaBigDecimal(bigDecimal): number {
        return bigDecimal.doubleValueSync();
    }

    export async function fromJavaBigDecimalAsync(bigDecimal): Promise<number> {
        return await bigDecimal.doubleValue$();
    }

    export function toJavaProperties(object: Object) {
        let props = java.newInstanceSync("java.util.Properties");
        Object.keys(object).map(p => {
            let v = object[p];
            props.putSync(p, v);
        });
        return props;
    }

    export function fromJavaProperties(props): Object {
        let obj = {};
        let entries = props.entrySetSync().toArraySync();
        entries.forEach(entry => {
            obj[entry.getKeySync()] = entry.getValueSync();
        });
        return obj;
    }
}
