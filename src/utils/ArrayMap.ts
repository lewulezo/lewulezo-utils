type EqFunc<T> = (t1: T, t2: T) => boolean;
interface Entry<K, V> {
    key: K;
    value: V;
}

export class ArrayMap<K, V> {
    private _entries: Entry<K, V>[];

    constructor(public equalsFn: EqFunc<K> = (k1: K, k2: K) => k1 === k2) {
        this._entries = [];
    }
    [Symbol.iterator]() {
        return this._entries[Symbol.iterator];
    }

    put(key: K, value: V): void {
        let equalsFn = this.equalsFn;
        if (
            !this._entries.some(entry => {
                if (equalsFn(entry.key, key)) {
                    entry.value = value;
                    return true;
                }
                return false;
            })
        ) {
            this._entries.push({ key: key, value: value });
        }
    }

    has(key: K): boolean {
        let equalsFn = this.equalsFn;
        return this._entries.some(entry => equalsFn(entry.key, key));
    }

    get(key: K): V | undefined {
        let equalsFn = this.equalsFn;
        let value: V | undefined = undefined;
        this._entries.some(entry => {
            if (equalsFn(entry.key, key)) {
                value = entry.value;
                return true;
            }
            return false;
        });
        return value;
    }

    clear(): void {
        this._entries.splice(0, this._entries.length);
    }

    get size(): number {
        return this._entries.length;
    }

    forEach(iterator: (K, V) => void) {
        this._entries.forEach(entry => iterator(entry.key, entry.value));
    }

    get keys(): K[] {
        return this._entries.map(entry => entry.key);
    }

    get values(): V[] {
        return this._entries.map(entry => entry.value);
    }
}
