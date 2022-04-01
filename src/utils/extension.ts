declare interface Object {
    extension(funcName: string, funcBody: Function)
    let<T>(closure: (self) => T): T | undefined
    also<Self>(closure: (self) => any): Self
}

Object.prototype.extension = function(funcName: string, funcBody: Function) {
    const target = this instanceof Function ? this.prototype : this
    Object.defineProperty(target, funcName, {
        value: funcBody
    })
}

Object.extension('let', function<Self, T>(closure: (Self) => T): T | undefined {
    return (this === undefined || this === null) ? undefined : closure(this)
})

