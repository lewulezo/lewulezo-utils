import "reflect-metadata";
import { BigNumber } from 'bignumber.js';
import { isFunction } from "util";
import * as Moment from "moment";

const FIELD_TYPE_KEY = Symbol('FieldType');
export const string = buildType<string>('String', asString);
export const date = buildType<Date>('Date', asDate);
export const integer = buildType<number>('Integer', asInt);
export const float = buildType<number>('Float', asFloat);
export const boolean = buildType<boolean>('Boolean', asBoolean);
export const array = buildType<any[]>('Array', asArray);
export const set = buildType<Set<any>>('Set', asSet);
export const map = buildType<Map<any, any>>('Map', asMap);

export function buildType<T>(type: string, converter?: (v:any) => T) : PropertyDecorator {
    return <TFunction extends Function>(target: TFunction, propName: string) => {
        Reflect.metadata(FIELD_TYPE_KEY, type)(target, propName);
        let propSymbol = Symbol(propName);
        let objProp = {};
        let convertFunc = converter || defaultConverter;
        objProp['set'] = function(v) {
            this[propSymbol] = convertFunc(v);
        }
        objProp['get'] = function() {
            return convertFunc(this[propSymbol]);
        }
        Object.defineProperty(target.constructor.prototype, propName, objProp);
    };
}

export function getTypeName(target:Object, propName: string): string {
    return Reflect.getMetadata(FIELD_TYPE_KEY, target, propName);
}

function defaultConverter<T>(v:any): T {
    return v;
}

export function asString(v: any): string {
    if (v === null || v === undefined || v === NaN) {
        return '';
    }
    if (v instanceof Date && String(v) === 'Invalid Date') {
        return '';
    }
    return String(v);
}

export function asInt(v: any): number {
    if (isNaN(v)) {
        return 0;
    }
    let num = new BigNumber(v);
    return num.integerValue().toNumber();
}

export function asFloat(v: any): number {
    if (isNaN(v)) {
        return 0;
    }
    let num = new BigNumber(v);
    return num.toNumber();
}

export function asBoolean(v: any): boolean {
    return Boolean(v);
}

export function asArray(v: any): any[] {
    if (v === undefined || v === null) {
        return [];
    }
    if (v instanceof Array) {
        return v;
    }
    if (typeof v == 'string') {
        return [v];
    }
    if (v instanceof Map) {
        v = v.values();
    }
    if (isFunction(v[Symbol.iterator])) {
        let array:any[] = [];
        for (let value of v.values()) {
            array.push(value);
        }
        return array;
    }
    return [v];
}

export function asSet<T>(v: any): Set<T> {
    v = asArray(v);
    return new Set(v);
}

export function asMap<K, V>(v: any): Map<K, V> {
    if (v === undefined || v === null) {
        return new Map();
    }
    if (v instanceof Map) {
        return v;
    }
    if (v instanceof Set) {
        let map = new Map();
        v.forEach(value => map.set(v, undefined));
    }
    if (typeof v === 'object') {
        let map = new Map();
        for (let p in v) {
            let value = v[p];
            if (isFunction(value)) {
                continue;
            }
            map.set(p, v);
        }
        return map;
    }
    let map = new Map();
    map.set('value', v);
    return map;
}

export function asDate(v: any): Date {
    if (v === undefined || v === null) {
        return new Date();
    }
    return Moment(v).toDate();
}


