import { copyObj } from "./common-utils";
import { GroupMap } from "./GroupMap";
import { asFloat } from "./Types";

type GroupCalculateFunc<T extends Object> = (array: T[], field: string) => any;
export function sum<T extends Object>(array: T[], field: string): number {
    let result = 0;
    array.forEach(item => {
        result += asFloat(item[field]);
    });
    return result;
}

export function average<T extends Object>(array: T[], field: string): number {
    if (array.length === 0) return 0;
    return sum(array, field) / array.length;
}

export function max<T extends Object>(array: T[], field: string): number {
    if (array.length === 0) return 0;
    let maxNumber = 0;
    array.forEach(item => {
        if (asFloat(item[field]) > maxNumber) {
            maxNumber = item[field];
        }
    });
    return maxNumber;
}

export function join<T extends Object>(array: T[], field: string): string {
    if (array.length === 0) return '';
    return array.map(item => item[field]).join(',');
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
    let groupMap = new GroupMap<any, T>();
    array.forEach(item => {
        let key = {};
        by.forEach(groupField => {
            key[groupField] = item[groupField];
        });
        groupMap.put(key, item);
    });
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
