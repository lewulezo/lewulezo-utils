import { ArrayMap } from "./ArrayMap";

type EqFunc<T> = (t1: T, t2: T) => boolean;
function groupCheck<T>(obj1: T, obj2: T): boolean {
    let type1 = typeof obj1;
    let type2 = typeof obj2;
    if (type1 !== type2) {
        return false;
    }
    if (type1 === "object") {
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);
        return (
            keys1.length === keys2.length &&
            keys1.every(p => obj1[p] === obj2[p])
        );
    }
    return obj1 === obj2;
}

export class GroupMap<K, V> {
    private _groups: ArrayMap<K, V[]>;

    constructor(public equalsFn: EqFunc<K> = groupCheck) {
        this._groups = new ArrayMap(equalsFn);
    }

    put(key: K, value: V): void {
        let values = this._groups.get(key);
        if (!values) {
            values = [];
            this._groups.put(key, values);
        }
        values.push(value);
    }

    get(key: K): V[] {
        return this._groups.get(key) || [];
    }

    has(key: K): boolean {
        let values = this._groups.get(key);
        return values !== undefined && values.length > 0;
    }

    clear(): void {
        this._groups.clear();
    }

    get keys(): K[] {
        return this._groups.keys.map(i => i);
    }

    get keySize(): number {
        return this._groups.size;
    }

    get valueSize(): number {
        let size = 0;
        this._groups.forEach((_, value) => {
            size += value.size;
        });
        return size;
    }
}
