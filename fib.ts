import { parentPort, workerData, isMainThread } from 'worker_threads';
import { sumInColumn } from './calc';

const fibonacci = (n: number): string => {
    if (n <= 1) {
        return n.toString();
    }
    return sumInColumn(fibonacci(n - 1), fibonacci(n - 2));  
};

if (!isMainThread) {
    
    const { id, n } = workerData;
    console.log(id, ' -- started');
    // const t0 = performance.now();

    const res = fibonacci(n);

    if (parentPort) {
        // const t1 = performance.now();
        // console.log(id, ' -- finished', `passed: ${t1 - t0} ms`);
        parentPort.postMessage({ result: res, id });
    }
}
