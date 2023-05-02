"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCsvFile = exports.readCsvFile = exports.removeFile = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const node_fs_1 = __importDefault(require("node:fs"));
const logger_1 = require("./logger");
const removeFile = (path) => {
    if (node_fs_1.default.existsSync(path)) {
        node_fs_1.default.unlink(path, (err) => {
            if (err)
                return logger_1.logger.error(`Error deleting file ${path}.`, err);
            logger_1.logger.info(`${path} deleted successfully.`);
        });
    }
};
exports.removeFile = removeFile;
const readCsvFile = (filePath) => {
    const rows = [];
    return new Promise((resolve, reject) => {
        if (!node_fs_1.default.existsSync(filePath))
            return resolve([]);
        node_fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            rows.push(row);
        })
            .on('end', () => {
            resolve(rows);
        })
            .on('error', (err) => {
            reject(err);
        });
    });
};
exports.readCsvFile = readCsvFile;
const writeCsvFile = (filePath, rows) => {
    if (!rows)
        throw new Error('No rows provided.');
    if (!filePath)
        throw new Error('No filePath provided.');
    const fileExists = node_fs_1.default.existsSync(filePath);
    if (fileExists)
        node_fs_1.default.unlinkSync(filePath);
    const data = rows
        .map((row) => Object.values(row).join(','))
        .join('\n');
    logger_1.logger.info(`Writing ${rows.length} to ${filePath}.`);
    node_fs_1.default.writeFileSync(filePath, data);
    return filePath;
};
exports.writeCsvFile = writeCsvFile;
