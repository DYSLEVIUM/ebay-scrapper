import csvParser from 'csv-parser';
import fs from 'fs';
import { logger } from './logger';

export const removeFile = (path: string) => {
    if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
            if (err) return logger.error(`Error deleting file ${path}.`, err);
            logger.info(`${path} deleted successfully.`);
        });
    }
};

export const readCsvFile = <T>(filePath: string): Promise<T[]> => {
    const rows: T[] = [];

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) return resolve([] as T[]);

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row: T) => {
                rows.push(row);
            })
            .on('end', () => {
                resolve(rows);
            })
            .on('error', (err: any) => {
                reject(err);
            });
    });
};

export const writeCsvFile = async <T>(filePath: string, rows: T[]) => {
    if (!rows) throw new Error('No rows provided.');
    if (!filePath) throw new Error('No filePath provided.');

    const fileExists = fs.existsSync(filePath);
    if (fileExists) fs.unlinkSync(filePath);

    const data = rows
        .map((row) => Object.values(row as Array<string | number>).join(','))
        .join('\n');

    logger.info(`Writing ${rows.length} to ${filePath}.`);
    fs.writeFileSync(filePath, data);

    return filePath;
};
