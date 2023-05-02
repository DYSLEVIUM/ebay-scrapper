"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressErrorHandler = void 0;
const express_1 = require("../shared/errors/express");
const logger_1 = require("../shared/utils/logger");
const expressErrorHandler = (err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    const isErrorSafe = err instanceof express_1.ExpressError;
    const clientError = isErrorSafe
        ? err
        : new express_1.ExpressError('Something went wrong', {}, 'INTERNAL_ERROR', 500);
    if (!isErrorSafe)
        logger_1.logger.error(err);
    return res
        .status(clientError.status || 500)
        .send({ message: 'Error Occurred.', data: 0, error: clientError });
};
exports.expressErrorHandler = expressErrorHandler;
