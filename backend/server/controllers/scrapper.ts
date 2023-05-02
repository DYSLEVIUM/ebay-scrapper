import { Scrapper } from '../shared/models/Scrapper';
import { logger } from '../shared/utils/logger';

let scrapper: Scrapper;

export const startScraping = async (keywords: string, targetPrice: number) => {
    if (scrapper) {
        logger.info(
            'Scrapper called while already running. Stopping current scrapper and starting a new one.'
        );
        stopScraping();
        logger.info('Scrapper stopped. Starting a new one now.');
    }
    scrapper = new Scrapper(keywords, targetPrice);
    await scrapper.startScrapping();
};

export const stopScraping = () => {
    if (!scrapper) return;
    scrapper.stopScraping();
};

export const getStats = () => {
    if (!scrapper) return { status: 'No scrapper created.' };
    return scrapper.getStats();
};

export const getData = () => {
    if (!scrapper) return [];

    const products = scrapper.getData();
    logger.info(`Retrieved ${products.length} products.`);
    return products;
};
