export class Timer {
    private _startTime: number;
    private _lastLap: number;
    constructor() {
        this.start();
    }

    start() {
        this._startTime = Date.now();
        this._lastLap = this._startTime;
    }

    get lap() : number {
        const now = Date.now();
        const lastTime = now - this._lastLap;
        this._lastLap = now;
        return lastTime;
    }

    get total() : number {
        return Date.now() - this._startTime;
    }
}

export default Timer;