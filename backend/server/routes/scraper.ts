import { Router } from 'express';
import {
    getData,
    getStats,
    startScraping,
    stopScraping,
} from '../controllers/scrapper';
import { ExpressError } from '../shared/errors/express';
import { logger } from '../shared/utils/logger';

const router = Router();

router.post('/start', (req, res) => {
    const keywords = req.body.keywords;
    const targetPrice = req.body.targetPrice;

    if (!keywords || keywords === '' || !targetPrice || isNaN(targetPrice)) {
        return res.status(200).send({ message: 'Malformed data.', data: 0 });
    }

    logger.info(
        `Request to start scrape for keywords: "${keywords}" and Target Price: $${targetPrice}.`
    );

    try {
        startScraping(keywords, parseFloat(targetPrice));

        return res.status(200).send({ message: 'Scrapper started.', data: 1 });
    } catch (err) {
        throw new ExpressError(
            `Error while running scrapper for keywords: "${keywords}" and Target Price: $${targetPrice}.`,
            err
        );
    }
});

router.post('/stop', (_req, res) => {
    logger.info('Request for stopping scrapper.');
    try {
        stopScraping();
        return res.status(200).send({ message: 'Scrapper stopped.', data: 1 });
    } catch (err) {
        throw new ExpressError(`Error while stopping scrapper.`, err);
    }
});

router.get('/data', async (_req, res) => {
    logger.info(`Request to get scraped data.`);

    const products = getData();
    res.status(200).send({
        message: 'Scrapper data.',
        data: products,
    });
});

router.get('/stats', (_req, res) => {
    logger.info('Request to get scrapper stats.');

    const stats = getStats();

    res.status(200).send({
        message: 'Scrapper status.',
        data: stats,
    });
});
export default router;
