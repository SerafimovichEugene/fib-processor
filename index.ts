
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Worker } from 'worker_threads';
import { performance } from 'perf_hooks';
import AWS from 'aws-sdk';
import './fib';

dotenv.config();

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "fib_status";

const params = {
    TableName:table,
};

function runFibWorker(n: number, id: string): Promise<{id: string, result: string}> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, './fib.js'), { workerData: { id, n } });
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
 
        const { n, jobId } = req.query;

        const number = Number(n);
        
        if (!isNaN(number)) {

            const t0 = performance.now();

            runFibWorker(number, jobId as string)
                .then(({id, result}) => {

                    const t1 = performance.now();
                    
                    console.log(id, ' -- finished: ', result, ` passed: ${t1 - t0} ms`);
            
                    
                    // fs.appendFile('db.txt', `${id}: ${result}\n`, function (err) {
                    //         if (err) return console.log(err);
                    //     });

                    docClient.put({...params, Item: { id, result }}, function(err, data) {
                        if (err) {
                            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            console.log("Added item:", JSON.stringify(data, null, 2));
                        }
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