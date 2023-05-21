// const baseUrl = 'https://ebay-scrapper-backend-1.onrender.com/api/scrapper';
// const baseUrl = 'http://localhost:3000/api/scrapper';
const baseUrl = 'http://159.223.157.163:3000/api/scrapper';
export const enum ENDPOINTS {
    startScrapper = baseUrl + '/start',
    getData = baseUrl + '/data',
    getStats = baseUrl + '/stats',
    stopScrapper = baseUrl + '/stop',
}
export const getStatsIntervalSec = 30;
export const getDataIntervalSec = 30;
