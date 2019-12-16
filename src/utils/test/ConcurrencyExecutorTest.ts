import { wait, ConcurrentExecutor, concurrentExecute, PromiseTask, Timer } from "@/utils";

async function test1() {
	let array = [3, 4, 2, 8, 2, 3, 1, 4, 5, 7, 10, 2];
	let tasks = array.map(i => new PromiseTask(async () => {
		await wait(i * 1000);
	}));
	let executor = new ConcurrentExecutor<void>(3);
	await executor.execute(tasks);
	console.log('done..');

}

async function test2() {
	const timer = new Timer();
	let array = [3, 4, 2, 8, 2, 3, 1, 4, 5, 7, 10, 2];
	await concurrentExecute(array, 5, async i => {
		await wait(i * 1000);
	})

	console.log(timer.total);
}

test2();