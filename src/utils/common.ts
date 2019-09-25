import * as Moment from "moment";

export function toNumber(v: any): number {
    let num = Number(v);
    if (isNaN(num)) return 0;
    return num;
}

export function isNumber(v: any): boolean {
    return !isNaN(Number(v));
}

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

export function toDate(v: any): Date {
    return Moment(v).toDate();
}

export function defaultFormatDate(v: Date): String {
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
    for (let j = 0; j < subArrays.length; j++) {
        let subArray = subArrays[j];
        await Promise.all(subArray.map(item => fn(item)));
    }
}
