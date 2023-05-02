"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteNotFoundError = exports.ExpressServerStartError = exports.ExpressError = void 0;
const _1 = require(".");
class ExpressError extends _1.CustomError {
    constructor(message, error = {}, code = 'INTERNAL_ERROR', status = 500) {
        super(message, code, error);
        this.message = message;
        this.error = error;
        this.code = code;
        this.status = status;
    }
}
exports.ExpressError = ExpressError;
class ExpressServerStartError extends ExpressError {
    constructor(error) {
        super("Error starting express server." /* ExpressServer.ERROR_START */, error, 'SERVER_STARTING_ERROR', 500);
    }
}
exports.ExpressServerStartError = ExpressServerStartError;
class RouteNotFoundError extends ExpressError {
    constructor(originalUrl) {
        super(`Route '${originalUrl}' does not exist.`, {}, 'ROUTE_NOT_FOUND', 404);
    }
}
exports.RouteNotFoundError = RouteNotFoundError;
