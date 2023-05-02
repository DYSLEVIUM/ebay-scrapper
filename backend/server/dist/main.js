"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = require("./shared/errors/express");
const accessEnv_1 = require("./shared/utils/accessEnv");
const cors_1 = __importDefault(require("cors"));
const express_2 = __importDefault(require("express"));
const expressErrorHandler_1 = require("./middlewares/expressErrorHandler");
const routes_1 = require("./routes");
const logger_1 = require("./shared/utils/logger");
dotenv.config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PORT = parseInt((0, accessEnv_1.accessEnv)("API_PORT" /* Environment.API_PORT */, '3000'), 10);
        const app = (0, express_2.default)();
        app.use(express_2.default.json());
        app.use(express_2.default.urlencoded({ extended: true }));
        app.use((0, cors_1.default)({ origin: (_, cb) => cb(null, true), credentials: true }));
        //  express routes
        (0, routes_1.attachPublicRoutes)(app);
        app.use((req, _res, next) => next(new express_1.RouteNotFoundError(req.originalUrl)));
        app.use(expressErrorHandler_1.expressErrorHandler);
        app.listen(PORT, '0.0.0.0', () => {
            logger_1.logger.info("Express Server running." /* ExpressServer.SUCCESSFUL_START */);
            logger_1.logger.info(`Express Server running on PORT ${PORT}`);
        });
    }
    catch (err) {
        throw new express_1.ExpressServerStartError(err);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield startServer();
    }
    catch (err) {
        console.error(err);
    }
});
main();
