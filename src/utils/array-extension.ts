declare interface Array<T> {
    compactMap<R>(convertFun: (T) => R | undefined)
}
Array.extension('compactMap', function<T, R>(convertFun: (T) => R | undefined) {
    const array: T[] = this
    const result: R[] = []
    array.forEach(item => {
        const convertResult = convertFun(item)
        if (convertResult !== undefined) {
            result.push(convertResult)
        }
    })
    return result
})


