import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Worker } from 'worker_threads';
import { performance } from 'perf_hooks';

import './fib';

dotenv.config();

function runFibWorker(n: number): Promise<{id: string, result: string}> {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./fib.js', { workerData: n });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        })
    })
}

const app = express();

app.get('/health', (_req: Request, res: Response): void => {
        res.status(200).send('ok');
    },
);

app.get('/fib', (req: Request, res: Response, next: NextFunction) => {
 
        const { n } = req.query;

        const number = Number(n);
        
        if (!isNaN(number)) {

            const t0 = performance.now();

            runFibWorker(number)
                .then(({id, result}) => {

                    const t1 = performance.now();
                    
                    console.log(id, ' -- finished', `passed: ${t1 - t0} ms`);
                    
                    fs.appendFile('db.txt', `${id}: ${result}\n`, function (err) {
                            if (err) return console.log(err);
                        });
                    }
                    
                ).catch(err=> {
                    console.log(err);
                })
                
            res.send('in progress');
        }
        next();
    },
);

app.listen(process.env.PORT, () => {
    console.log(`App is listened at ${process.env.PORT}`)
});