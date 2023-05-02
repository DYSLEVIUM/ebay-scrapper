"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const environments_1 = require("../constants/environments");
const LOG_PATH = path_1.default.join(__dirname, '../../logs');
const getLogFilePath = (filename) => {
    return path_1.default.join(LOG_PATH, `botScrapper-%DATE%-${filename}.log`);
};
const getTransportOptions = (logLevel) => {
    return {
        filename: getLogFilePath(logLevel),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: logLevel,
    };
};
const getTransports = (transportFiles) => {
    const transportStreams = [];
    transportFiles.forEach((transportFile) => {
        transportStreams.push(new winston_1.transports.DailyRotateFile(getTransportOptions(transportFile)));
    });
    return transportStreams;
};
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    defaultMeta: { service: 'winston' },
    format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.format.printf(({ timestamp, level, message, service }) => `[${timestamp}] ${service} ${level}: ${message}`)),
    // transports: getTransports(['info', 'warn', 'error']),
    transports: getTransports(['info']),
});
if (!environments_1.PROD) {
    exports.logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.splat(), winston_1.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }), winston_1.format.printf(({ timestamp, level, message, service }) => `[${timestamp}] ${service} ${level}: ${message}`)),
    }));
}
