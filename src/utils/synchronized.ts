const runningPromises = new Map<{}, Promise<any>>();

export function synchronized<T>(lock: {}, task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const existedTask = runningPromises.get(lock);
        if (existedTask) {
            existedTask.then(task).then(resolve).catch(reject);
            return;
        }
        runningPromises.set(
            lock,
            task()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    runningPromises.delete(lock);
                })
        );
    });
}

export async function wait(time?: number): Promise<void> {
    return new Promise<void>((resolve, _) => {
        const r = () => resolve(undefined);
        time === undefined ? setTimeout(r) : setTimeout(r, time);
    });
}
