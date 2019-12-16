import Observable from "./Observable";

const TASK_RELEASE = 'taskRelease';

type PromiseConstructor<T> = () => Promise<T>;

export class PromiseTask<T>{
	constructor(public promiseConstructor: PromiseConstructor<T>) {
	}
	async run(): Promise<T> {
		return this.promiseConstructor();
	}
}

export class ConcurrentExecutor<T> extends Observable {
	private _capacity: number;
	private currentIndex = 0;
	private currentTaskId = 0;
	private concurrentCount = 0;
	private currentExecuteId = 0;

	public get capacity() {
		return this._capacity;
	}

	constructor(capacity = 1) {
		super();
		this._capacity = capacity;
	}

	private reset() {
		this.currentIndex = 0;
		this.currentTaskId = 0;
		this.concurrentCount = 0;
		this.currentExecuteId = 0;
	}

	async execute(tasks: PromiseTask<T>[]): Promise<T[]> {
		this.reset();
		return Promise.all(tasks.map((task, index) => this.executeSingleTask(index, task)));
	}

	private async executeSingleTask(index: number, task: PromiseTask<T>): Promise<T> {
		let self = this;
		let executeId = self.currentExecuteId;
		let taskId = self.currentTaskId;
		self.currentTaskId++;
		if (self.concurrentCount >= self._capacity) {
			executeId = await self.taskRelease(index);
		} else {
			self.currentExecuteId++;
		}
		self.concurrentCount++;
		self.currentIndex++;

		// console.log(`start task ${taskId} in execute ${executeId}`);
		let result = await task.run();
		// console.log(`end task ${taskId} in execute ${executeId}`);
		self.fire(TASK_RELEASE, self.currentIndex, executeId);
		return result;
	}

	private async taskRelease(index: number): Promise<number> {
		let self = this;
		return new Promise<number>(resolve => {
			let onTaskRelease = (_: any, currentIndex: number, executeId: number) => {
				if (currentIndex == index) {
					// console.log(`release task ${currentIndex} in execute ${executeId}`);
					self.un(TASK_RELEASE, onTaskRelease);
					resolve(executeId);
				}
			};
			self.on(TASK_RELEASE, onTaskRelease);
		});
	}

}

export async function concurrentExecute<T, R>(array: T[], capacity: number, fn: (item: T) => Promise<R>): Promise<R[]> {
	const tasks = array.map(item => new PromiseTask(() => fn(item)));
	let executor = new ConcurrentExecutor<R>(capacity);
	return await executor.execute(tasks);
}