"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPublicRoutes = void 0;
const express_1 = require("express");
const logger_1 = require("../shared/utils/logger");
const scraper_1 = __importDefault(require("./scraper"));
const router = (0, express_1.Router)();
let pythonProcess;
router.get('/scriptStatus', (_req, res) => {
    if (pythonProcess) {
        res.status(200).send({ message: 'Scrapper is running.', data: true });
        logger_1.logger.info('Scrapper is running.');
    }
    else {
        res.status(200).send({ scrapper: 'Scrapper is stopped.', data: false });
        logger_1.logger.info('Scrapper status is stopped.');
    }
    logger_1.logger.info('Scrapper status is running.');
    logger_1.logger.info('Request made to "/api/scriptStatus".');
});
const attachPublicRoutes = (app) => {
    app.use('/api', router);
    app.use('/api/scrapper', scraper_1.default);
};
exports.attachPublicRoutes = attachPublicRoutes;
