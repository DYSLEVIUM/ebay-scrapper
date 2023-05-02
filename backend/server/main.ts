import * as dotenv from 'dotenv';

import { Environment } from './shared/constants/environments';
import { ExpressServer } from './shared/constants/logs';
import {
    ExpressServerStartError,
    RouteNotFoundError,
} from './shared/errors/express';
import { accessEnv } from './shared/utils/accessEnv';

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { expressErrorHandler } from './middlewares/expressErrorHandler';
import { attachPublicRoutes } from './routes';
import { logger } from './shared/utils/logger';

dotenv.config();

const startServer = async () => {
    try {
        const PORT = parseInt(accessEnv(Environment.API_PORT, '3000'), 10);
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors({ origin: (_, cb) => cb(null, true), credentials: true }));

        //  express routes
        attachPublicRoutes(app);

        app.use((req: Request, _res: Response, next: NextFunction) =>
            next(new RouteNotFoundError(req.originalUrl))
        );

        app.use(expressErrorHandler);

        app.listen(PORT, '0.0.0.0', () => {
            logger.info(ExpressServer.SUCCESSFUL_START);
            logger.info(`Express Server running on PORT ${PORT}`);
        });
    } catch (err) {
        throw new ExpressServerStartError(err);
    }
};

const main = async () => {
    try {
        await startServer();
    } catch (err) {
        console.error(err);
    }
};

main();
