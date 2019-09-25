import { isNumber, isFunction } from ".";

export function listNames(enumType: any): string[] {
    return Object.keys(enumType).filter(
        key => !isNumber(key) && !isFunction(enumType[key])
    );
}

export function list<V>(enumType: any): V[] {
    return listNames(enumType).map(key => enumType[key]);
}

export function parse<EnumType>(
    enumType: any,
    value: string
): EnumType | undefined {
    if (listNames(enumType).indexOf(value) !== -1) {
        return enumType[value];
    }
}
