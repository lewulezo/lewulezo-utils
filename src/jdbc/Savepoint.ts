export class Savepoint {
    private _sp;

    constructor (sp){
        this._sp = sp;
    }

    get savepointId(): number {
        return this._sp.getSavePointIdSync();
    }

    get savepointName(): string { 
        return this._sp.getSavepontNameSync();
    }

    get javaObject() {
        return this._sp;
    }
}