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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.getStats = exports.stopScraping = exports.startScraping = void 0;
const Scrapper_1 = require("../shared/models/Scrapper");
const logger_1 = require("../shared/utils/logger");
let scrapper;
const startScraping = (keywords, targetPrice) => __awaiter(void 0, void 0, void 0, function* () {
    if (scrapper) {
        logger_1.logger.info('Scrapper called while already running. Stopping current scrapper and starting a new one.');
        (0, exports.stopScraping)();
        logger_1.logger.info('Scrapper stopped. Starting a new one now.');
    }
    scrapper = new Scrapper_1.Scrapper(keywords, targetPrice);
    yield scrapper.startScrapping();
});
exports.startScraping = startScraping;
const stopScraping = () => {
    if (!scrapper)
        return;
    scrapper.stopScraping();
};
exports.stopScraping = stopScraping;
const getStats = () => {
    if (!scrapper)
        return { status: 'No scrapper created.' };
    return scrapper.getStats();
};
exports.getStats = getStats;
const getData = () => {
    if (!scrapper)
        return [];
    const products = scrapper.getData();
    logger_1.logger.info(`Retrieved ${products.length} products.`);
    return products;
};
exports.getData = getData;
