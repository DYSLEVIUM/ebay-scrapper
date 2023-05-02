import axios from 'axios';
import { ENDPOINTS } from '../constants/apiURLs';
import { errorToast, successToast } from './toast';

export const startNewScrape = async (keywords: string, targetPrice: number) => {
    try {
        const data = await axios
            .post(ENDPOINTS.startScrapper, {
                keywords,
                targetPrice,
            })
            .then((res) => res.data);

        if (data.data === 1) {
            successToast('Form Submitted', data.message);
        } else {
            errorToast('Something went wrong', data.message);
        }
    } catch (err) {
        errorToast(
            'Something went wrong',
            'Error while making request to server.'
        );
        console.error(err);
    }
};

export const getScrappedData = async () => {
    try {
        const data = await axios.get(ENDPOINTS.getData).then((res) => res.data);
        if (data.data) {
            return data.data;
        } else {
            errorToast('Error while fetching data.', data.message);
        }
    } catch (err) {
        errorToast(
            'Something went wrong',
            'Error while making request to server.'
        );
        console.log(err);
    }
};

export const getScrapperStats = async () => {
    try {
        const data = await axios
            .get(ENDPOINTS.getStats)
            .then((res) => res.data);
        if (data.data) {
            return data.data;
        } else {
            errorToast('Error while fetching stats.', data.message);
        }
    } catch (err) {
        errorToast(
            'Error while fetching stats.',
            'Error while making request to server.'
        );
        console.log(err);
    }
};

export const stopScrapper = async () => {
    try {
        const data = await axios
            .post(ENDPOINTS.stopScrapper)
            .then((res) => res.data);
        if (data.data) {
            successToast('Scrapper stopped', data.message);
        } else {
            errorToast('Something went wrong.', data.message);
        }
    } catch (err) {
        errorToast(
            'Something went wrong',
            'Error while making request to server.'
        );
        console.error(err);
    }
};
