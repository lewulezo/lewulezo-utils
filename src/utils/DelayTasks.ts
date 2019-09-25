export class DelayTasks {
    private timeoutTasks: { [key: string]: number | NodeJS.Timeout };
    private intervalTasks: { [key: string]: number | NodeJS.Timeout };

    private logError = false;

    constructor() {
        this.timeoutTasks = {};
        this.intervalTasks = {};
    }

    public addTask(
        taskName: string,
        func: Function,
        delay: number,
        repeat = false
    ): void {
        let self = this;
        if (repeat) {
            self.addRepeatTask(taskName, func, delay);
        } else {
            self.addSimpleTask(taskName, func, delay);
        }
    }

    public addSimpleTask(
        taskName: string,
        func: Function,
        delay: number
    ): void {
        let self = this;
        self.timeoutTasks[taskName] = setTimeout(() => {
            self.endTask(taskName);
            try {
                func();
            } catch (error) {
                if (self.logError) {
                    console.log(
                        `running simple task ${taskName} throws error:${error}`
                    );
                }
            }
        }, delay);
    }

    public addRepeatTask(
        taskName: string,
        func: Function,
        delay: number
    ): void {
        let self = this;
        self.intervalTasks[taskName] = setInterval(() => {
            try {
                func();
            } catch (error) {
                if (self.logError) {
                    console.log(
                        `running repeat task ${taskName} throws error:${error}`
                    );
                }
            }
        }, delay);
    }

    public addAwaitingTask(
        taskName: string,
        func: Function,
        waitingFunc: Function,
        delay: number
    ): void {
        let self = this;
        self.addRepeatTask(
            taskName,
            () => {
                let waitingFinished = false;
                try {
                    waitingFinished = waitingFunc();
                } catch (error) {
                    if (self.logError) {
                        console.log(
                            `check awaiting task ${taskName} condition throws error:${error}`
                        );
                    }
                }
                if (waitingFinished) {
                    self.endTask(taskName);
                    try {
                        func();
                    } catch (error) {
                        if (self.logError) {
                            console.log(
                                `running awaiting task ${taskName} throws error:${error}`
                            );
                        }
                    }
                }
            },
            delay
        );
    }

    public getTaskNames(): string[] {
        return [
            ...Object.keys(this.timeoutTasks),
            ...Object.keys(this.intervalTasks)
        ];
    }

    public endTask(taskName): void {
        let timeout = this.timeoutTasks[taskName];
        if (timeout) {
            clearTimeout(timeout as NodeJS.Timeout);
            delete this.timeoutTasks[taskName];
        } else {
            timeout = this.intervalTasks[taskName];
            clearInterval(timeout as NodeJS.Timeout);
            delete this.intervalTasks[taskName];
        }
    }

    public endAllTasks() {
        this.getTaskNames().forEach(taskName => this.endTask(taskName));
    }
}

export default DelayTasks;
