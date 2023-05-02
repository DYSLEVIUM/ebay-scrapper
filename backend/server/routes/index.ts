import { ChildProcessWithoutNullStreams } from 'child_process';

import { Express, Router } from 'express';
import { logger } from '../shared/utils/logger';

import { default as scrapperRouter } from './scraper';

const router = Router();

let pythonProcess: ChildProcessWithoutNullStreams | null;

router.get('/scriptStatus', (_req, res) => {
    if (pythonProcess) {
        res.status(200).send({ message: 'Scrapper is running.', data: true });
        logger.info('Scrapper is running.');
    } else {
        res.status(200).send({ scrapper: 'Scrapper is stopped.', data: false });
        logger.info('Scrapper status is stopped.');
    }

    logger.info('Scrapper status is running.');
    logger.info('Request made to "/api/scriptStatus".');
});

export const attachPublicRoutes = (app: Express) => {
    app.use('/api', router);
    app.use('/api/scrapper', scrapperRouter);
};
