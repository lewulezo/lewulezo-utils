declare interface JSON {
    select(object: object, jsonPath: string): any | null | undefined
}
Object.defineProperty(JSON, 'select', {
    value: function(object, jsonPath) {
        if (typeof jsonPath !== 'string') return null
        let v = object
        jsonPath.split('.').some(path => {
            v = v[path]
            if (v === undefined) return true
        })
        return v
    }
})
