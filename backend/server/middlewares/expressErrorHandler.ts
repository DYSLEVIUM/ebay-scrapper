import { ErrorRequestHandler } from 'express';
import { ExpressError } from '../shared/errors/express';
import { logger } from '../shared/utils/logger';

export const expressErrorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next
) => {
    const isErrorSafe = err instanceof ExpressError;

    const clientError: ExpressError = isErrorSafe
        ? err
        : new ExpressError('Something went wrong', {}, 'INTERNAL_ERROR', 500);

    if (!isErrorSafe) logger.error(err);

    return res
        .status(clientError.status || 500)
        .send({ message: 'Error Occurred.', data: 0, error: clientError });
};
