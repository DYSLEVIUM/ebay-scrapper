const baseUrl = 'https://ebay-scrapper-backend-1.onrender.com/api/scrapper';
export const enum ENDPOINTS {
    startScrapper = baseUrl + '/start',
    getData = baseUrl + '/data',
    getStats = baseUrl + '/stats',
    stopScrapper = baseUrl + '/stop',
}
export const getStatsIntervalSec = 10;
export const getDataIntervalSec = 10;
