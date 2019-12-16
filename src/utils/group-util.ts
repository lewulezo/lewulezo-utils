import { Timer } from "./Timer";
import { toNumber, copyObj } from "./common-utils";
import { GroupMap } from "./GroupMap";

type GroupCalculateFunc<T extends Object> = (array: T[], field: string) => any;
export function sum<T extends Object>(array: T[], field: string): number {
    let result = 0;
    array.forEach(item => {
        result += toNumber(item[field]);
    });
    return result;
}

export function average<T extends Object>(array: T[], field: string): number {
    if (array.length === 0) return 0;
    return sum(array, field) / array.length;
}

export function max<T extends Object>(array: T[], field: string): number {
    if (array.length === 0) return 0;
    let max = 0;
    array.forEach(item => {
        if (toNumber(item[field]) > max) {
            max = item[field];
        }
    });
    return max;
}

type CalculateFields<T> = { [fieldName: string]: GroupCalculateFunc<T> };
export function groupCalculate<T extends Object>({
    array,
    by,
    calculate
}: {
    array: T[];
    by: string[];
    calculate: CalculateFields<T>;
}): T[] {
    const timer = new Timer();
    let groupMap = new GroupMap<any, T>();
    array.forEach(item => {
        let key = {};
        by.forEach(groupField => {
            key[groupField] = item[groupField];
        });
        groupMap.put(key, item);
    });
    console.log("2..." + timer.lap);
    let result: T[] = [];
    groupMap.keys.forEach(key => {
        let values = groupMap.get(key);
        if (values.length === 0) {
            return;
        }
        result.push(
            calculateArray({
                array: values,
                calculateFields: calculate
            })
        );
    });
    console.log("3..." + timer.lap);
    return result;
}

function calculateArray<T extends Object>({ array, calculateFields }): T {
    if (array.length === 0) {
        throw new Error("no value to calculate!!");
    }
    let record = copyObj(array[0]);

    Object.keys(calculateFields).forEach(field => {
        let fn = calculateFields[field];
        record[field] = fn(array, field);
    });
    return record;
}
