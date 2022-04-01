import * as Moment from "moment";
import { O_WRONLY } from "constants";
import * as fs from "fs";

// export function toNumber(v: any): number {
//     let num = Number(v);
//     if (isNaN(num)) return 0;
//     return num;
// }

export function isNumber(v: any): boolean {
    return !isNaN(Number(v));
}

// export function toString(v: any): string {
//     return v ? String(v) : '';
// }

export function isFunction(v: any): boolean {
    return typeof v === "function";
}

export function concatArrays<T>(arrays: T[][]): T[] {
    return Array.prototype.concat.apply(arrays[0], arrays.slice(1));
}

export function copyObj<T extends Object>(obj: T): T {
    let constructor = obj.constructor as ObjectConstructor;
    let cloneObj = new constructor() as T;
    Object.keys(obj).forEach(prop => {
        cloneObj[prop] = obj[prop];
    });
    return cloneObj;
}

// export function toDate(v: any): Date|undefined {
//     if (v) {
//         return Moment(v).toDate();
//     }
// }

export function defaultFormatDate(v: Date): string {
    return Moment(v).format("YYYY-MM-DD");
}

export async function asyncForEach<T>(
    array: T[],
    concurrent = 1,
    fn: (item: T) => Promise<any>
) {
    let subArrays: T[][] = [];
    for (let i = 0; i < array.length; i += concurrent) {
        subArrays.push(array.slice(i, i + concurrent));
    }
    for (let subArray of subArrays) {
        await Promise.all(subArray.map(item => fn(item)));
    }
}

export async function appendFile(fileName: string, content: string) {
    let fileHandler = await fs.promises.open(fileName, O_WRONLY);
    await fileHandler.appendFile(content);
    await fileHandler.close();
}

export function numberToFixedString(n: number, length: number) {
    if (length <= 0) {
        return "";
    }
    return String(Math.pow(10, length) + n).substring(1);
}


export async function wait(time: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, time));
}

export function range({ start = 0, end }): number[] {
    let arr: number[] = [];
    for (let i = start; i < end; i++) {
        arr.push(i);
    }
    return arr;
}
