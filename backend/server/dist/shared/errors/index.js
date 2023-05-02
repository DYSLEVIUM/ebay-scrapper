"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const logger_1 = require("../utils/logger");
class CustomError extends Error {
    constructor(message, code, error) {
        // super(message, code);
        super(message);
        this.error = error;
        Object.defineProperty(this, 'errors', { value: error });
        logger_1.logger.error(message, error);
    }
}
exports.CustomError = CustomError;
