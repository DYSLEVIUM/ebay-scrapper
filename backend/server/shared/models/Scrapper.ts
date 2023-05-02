import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';
import { Environment } from '../constants/environments';
import { ScrapperStatus } from '../constants/status';
import { CSVRow } from '../interfaces';
import { accessEnv } from '../utils/accessEnv';
import { readCsvFile } from '../utils/file';
import { getGmailTransporter, setDifference, sleep } from '../utils/helper';
import { logger } from '../utils/logger';
import { Product } from './Product';

const pythonPath = accessEnv(
    Environment.PYTHON_PATH,
    '/opt/homebrew/bin/python3'
);

export class Scrapper {
    private startTime: Date | null = null;
    private scrapper: ChildProcessWithoutNullStreams | null = null;
    private shouldStop: boolean = false;

    private productsSet: Product[] = [];
    private newProductsSet: Product[] = [];

    private csvPath = path.resolve('../bot/output.csv');

    constructor(private keywords: string, private targetPrice: number = 1000) {}

    getStats() {
        logger.info('Scrapper status:');
        logger.info(
            `\n\tstatus: ${this.status()},\n\tstartTime: ${
                this.startTime || null
            },\n\tkeywords: ${this.keywords},\n\ttargetPrice: $${
                this.targetPrice
            }`
        );

        return {
            status: this.status(),
            startTime: this.startTime,
            keywords: this.keywords,
            targetPrice: this.targetPrice,
        };
    }

    private createScrapper() {
        logger.info('Creating scrapper.');
        const scrapper = spawn(
            pythonPath,
            [
                path.resolve('../bot/main.py'),
                this.targetPrice.toString(),
                ...this.keywords.split(' '),
            ],
            { detached: true }
        );

        scrapper.on('error', (err) => {
            logger.error('Scrapper had a error.', err);
        });

        scrapper.on('exit', (code, signal) => {
            logger.info(
                `Scrapper exited with code ${code} and signal ${signal}.`
            );
        });

        logger.info('Successfully created scrapper.');
        return scrapper;
    }

    getData() {
        return this.newProductsSet;
    }

    private async getDataFromCSV() {
        const rows = await readCsvFile<CSVRow>(this.csvPath);
        const products: Product[] = rows.map((row) => {
            return new Product({
                ...row,
                is_new_listing: row.is_new_listing === 'True' ? true : false,
                condition: row.condition === 'None' ? null : row.condition,
                price: Number(row.price),
                shipping_price:
                    row.shipping_price === 'None'
                        ? null
                        : Number(row.shipping_price),
            });
        });

        logger.info(`Retrieved ${products.length} products from CSV.`);
        return products;
    }

    async startScrapping() {
        console.log(pythonPath);
        {
            const te = spawn('which', ['python3'], { detached: true });
            te.on('message', (data) => {
                console.log('which python3 data', data.toString());
            });
        }

        {
            const te = spawn('which', ['python'], { detached: true });
            te.on('message', (data) => {
                console.log('which python data', data.toString());
            });
        }

        if (this.status() === ScrapperStatus.RUNNING) return;

        this.shouldStop = false;
        logger.info(
            `Scrapper started with keywords: "${this.keywords}" and Target Price: $${this.targetPrice}.`
        );

        this.startTime = new Date();

        const maxSleepTimeSeconds = parseInt(
            accessEnv(Environment.SLEEP_TIME_SECONDS, '1800'),
            10
        );

        while (!this.shouldStop) {
            this.scrapper = this.createScrapper();

            try {
                const instanceStartTime = new Date();
                await new Promise<void>((resolve, reject) => {
                    if (!this.scrapper)
                        return reject(new Error(`Scrapper destroyed.`));

                    this.scrapper.on('close', (code) => {
                        if (code === 0) {
                            resolve();
                        } else {
                            reject(
                                new Error(`Scrapper exited with code ${code}l.`)
                            );
                        }
                    });

                    this.scrapper!.on('error', (err) => {
                        reject(err);
                    });
                }).then(async () => {
                    const endTime = new Date();
                    logger.info(
                        `Scrapper finished for "${
                            this.keywords
                        }" with Target Price $${
                            this.targetPrice
                        } and execution time of ${
                            (endTime.getTime() - this.startTime!.getTime()) /
                            1000
                        } seconds.`
                    );

                    const currProductsSet = await this.getDataFromCSV();
                    const differenceSet = setDifference<Product>(
                        currProductsSet,
                        this.productsSet
                    );

                    // if it is not the first run and we have new elements
                    if (this.productsSet.length && differenceSet.length) {
                        this.newProductsSet = differenceSet;

                        // send mail for the new products
                        const gmailTransporter = await getGmailTransporter();
                        await gmailTransporter.sendMail(
                            `New Items for ${this.keywords} found!`,
                            `Found ${differenceSet.length} new items.`,
                            Product.exportToCsv(
                                this.newProductsSet,
                                './newItems.csv'
                            )
                        );

                        // add the new products to the set
                        this.productsSet = [
                            ...this.productsSet,
                            ...this.newProductsSet,
                        ];

                        logger.info(
                            `New Items found: ${this.newProductsSet.length}.`
                        );
                    } else if (!this.productsSet.length) {
                        this.productsSet = currProductsSet;
                    }

                    const instanceEndTime = new Date();
                    const elapsedInstanceTime =
                        instanceEndTime.getTime() - instanceStartTime.getTime();

                    const sleepTime = Math.max(
                        0,
                        maxSleepTimeSeconds * 1000 - elapsedInstanceTime
                    ); // doing min, so that we start at minimum of after maxSleepTime

                    logger.info(
                        `Waiting for ${
                            sleepTime / 1000
                        } seconds for next scrapping.`
                    );
                    await sleep(sleepTime);
                });
            } catch (err) {
                logger.error('Scrapper stopped unexpectedly.', err);
                this.stopScraping();
                throw err;
            }

            if (this.scrapper) this.scrapper.kill();
        }
    }

    stopScraping() {
        if (this.status() === ScrapperStatus.STOPPED) return;

        this.shouldStop = true;

        this.scrapper?.kill();
        this.scrapper = null;

        logger.info('Scrapper stopped.');
    }

    status() {
        return this.scrapper === null || this.scrapper.killed || this.shouldStop
            ? ScrapperStatus.STOPPED
            : ScrapperStatus.RUNNING;
    }
}
