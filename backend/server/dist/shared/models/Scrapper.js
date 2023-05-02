"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrapper = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const accessEnv_1 = require("../utils/accessEnv");
const file_1 = require("../utils/file");
const helper_1 = require("../utils/helper");
const logger_1 = require("../utils/logger");
const Product_1 = require("./Product");
class Scrapper {
    constructor(keywords, targetPrice = 1000) {
        this.keywords = keywords;
        this.targetPrice = targetPrice;
        this.startTime = null;
        this.scrapper = null;
        this.shouldStop = false;
        this.productsSet = [];
        this.newProductsSet = [];
        this.csvPath = path_1.default.resolve('./bot/output.csv');
    }
    getStats() {
        logger_1.logger.info('Scrapper status:');
        logger_1.logger.info(`\n\tstatus: ${this.status()},\n\tstartTime: ${this.startTime || null},\n\tkeywords: ${this.keywords},\n\ttargetPrice: $${this.targetPrice}`);
        return {
            status: this.status(),
            startTime: this.startTime,
            keywords: this.keywords,
            targetPrice: this.targetPrice,
        };
    }
    createScrapper() {
        logger_1.logger.info('Creating scrapper.');
        const scrapper = (0, child_process_1.spawn)('/opt/homebrew/bin/python3', [
            path_1.default.resolve('./bot/main.py'),
            this.targetPrice.toString(),
            ...this.keywords.split(' '),
        ], { detached: true });
        scrapper.on('error', (err) => {
            logger_1.logger.error('Scrapper had a error.', err);
        });
        scrapper.on('exit', (code, signal) => {
            logger_1.logger.info(`Scrapper exited with code ${code} and signal ${signal}.`);
        });
        logger_1.logger.info('Successfully created scrapper.');
        return scrapper;
    }
    getData() {
        return this.newProductsSet;
    }
    getDataFromCSV() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield (0, file_1.readCsvFile)(this.csvPath);
            const products = rows.map((row) => {
                return new Product_1.Product(Object.assign(Object.assign({}, row), { is_new_listing: row.is_new_listing === 'True' ? true : false, condition: row.condition === 'None' ? null : row.condition, price: Number(row.price), shipping_price: row.shipping_price === 'None'
                        ? null
                        : Number(row.shipping_price) }));
            });
            logger_1.logger.info(`Retrieved ${products.length} products from CSV.`);
            return products;
        });
    }
    startScrapping() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status() === "Scrapper is running." /* ScrapperStatus.RUNNING */)
                return;
            this.shouldStop = false;
            logger_1.logger.info(`Scrapper started with keywords: "${this.keywords}" and Target Price: $${this.targetPrice}.`);
            this.startTime = new Date();
            const maxSleepTimeSeconds = parseInt((0, accessEnv_1.accessEnv)("SLEEP_TIME_SECONDS" /* Environment.SLEEP_TIME_SECONDS */, '1800'), 10);
            while (!this.shouldStop) {
                this.scrapper = this.createScrapper();
                try {
                    const instanceStartTime = new Date();
                    yield new Promise((resolve, reject) => {
                        if (!this.scrapper)
                            return reject(new Error(`Scrapper destroyed.`));
                        this.scrapper.on('close', (code) => {
                            if (code === 0) {
                                resolve();
                            }
                            else {
                                reject(new Error(`Scrapper exited with code ${code}l.`));
                            }
                        });
                        this.scrapper.on('error', (err) => {
                            reject(err);
                        });
                    }).then(() => __awaiter(this, void 0, void 0, function* () {
                        const endTime = new Date();
                        logger_1.logger.info(`Scrapper finished for "${this.keywords}" with Target Price $${this.targetPrice} and execution time of ${(endTime.getTime() - this.startTime.getTime()) /
                            1000} seconds.`);
                        const currProductsSet = yield this.getDataFromCSV();
                        const differenceSet = (0, helper_1.setDifference)(currProductsSet, this.productsSet);
                        // if it is not the first run and we have new elements
                        if (this.productsSet.length && differenceSet.length) {
                            this.newProductsSet = differenceSet;
                            // send mail for the new products
                            const gmailTransporter = yield (0, helper_1.getGmailTransporter)();
                            yield gmailTransporter.sendMail(`New Items for ${this.keywords} found!`, `Found ${differenceSet.length} new items.`, Product_1.Product.exportToCsv(this.newProductsSet, './newItems.csv'));
                            // add the new products to the set
                            this.productsSet = [
                                ...this.productsSet,
                                ...this.newProductsSet,
                            ];
                            logger_1.logger.info(`New Items found: ${this.newProductsSet.length}.`);
                        }
                        else if (!this.productsSet.length) {
                            this.productsSet = currProductsSet;
                        }
                        const instanceEndTime = new Date();
                        const elapsedInstanceTime = instanceEndTime.getTime() - instanceStartTime.getTime();
                        const sleepTime = Math.max(0, maxSleepTimeSeconds * 1000 - elapsedInstanceTime); // doing min, so that we start at minimum of after maxSleepTime
                        logger_1.logger.info(`Waiting for ${sleepTime / 1000} seconds for next scrapping.`);
                        yield (0, helper_1.sleep)(sleepTime);
                    }));
                }
                catch (err) {
                    logger_1.logger.error('Scrapper stopped unexpectedly.', err);
                }
                if (this.scrapper)
                    this.scrapper.kill();
            }
        });
    }
    stopScraping() {
        var _a;
        if (this.status() === "Scrapper is stopped." /* ScrapperStatus.STOPPED */)
            return;
        this.shouldStop = true;
        (_a = this.scrapper) === null || _a === void 0 ? void 0 : _a.kill();
        this.scrapper = null;
        logger_1.logger.info('Scrapper stopped.');
    }
    status() {
        return this.scrapper === null || this.scrapper.killed || this.shouldStop
            ? "Scrapper is stopped." /* ScrapperStatus.STOPPED */
            : "Scrapper is running." /* ScrapperStatus.RUNNING */;
    }
}
exports.Scrapper = Scrapper;
