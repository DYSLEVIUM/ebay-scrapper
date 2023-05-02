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
const express_1 = require("express");
const scrapper_1 = require("../controllers/scrapper");
const express_2 = require("../shared/errors/express");
const logger_1 = require("../shared/utils/logger");
const router = (0, express_1.Router)();
router.post('/start', (req, res) => {
    const keywords = req.body.keywords;
    const targetPrice = req.body.targetPrice;
    if (!keywords || keywords === '' || !targetPrice || isNaN(targetPrice)) {
        return res.status(200).send({ message: 'Malformed data.', data: 0 });
    }
    logger_1.logger.info(`Request to start scrape for keywords: "${keywords}" and Target Price: $${targetPrice}.`);
    try {
        (0, scrapper_1.startScraping)(keywords, parseFloat(targetPrice));
        return res.status(200).send({ message: 'Scrapper started.', data: 1 });
    }
    catch (err) {
        throw new express_2.ExpressError(`Error while running scrapper for keywords: "${keywords}" and Target Price: $${targetPrice}.`, err);
    }
});
router.post('/stop', (_req, res) => {
    logger_1.logger.info('Request for stopping scrapper.');
    try {
        (0, scrapper_1.stopScraping)();
        return res.status(200).send({ message: 'Scrapper stopped.', data: 1 });
    }
    catch (err) {
        throw new express_2.ExpressError(`Error while stopping scrapper.`, err);
    }
});
router.get('/data', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info(`Request to get scraped data.`);
    const products = (0, scrapper_1.getData)();
    res.status(200).send({
        message: 'Scrapper data.',
        data: products,
    });
}));
router.get('/stats', (_req, res) => {
    logger_1.logger.info('Request to get scrapper stats.');
    const stats = (0, scrapper_1.getStats)();
    res.status(200).send({
        message: 'Scrapper status.',
        data: stats,
    });
});
exports.default = router;
