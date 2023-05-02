import { accessEnv } from '../utils/accessEnv';

export const enum Environment {
    PORT = 'PORT',
    NODE_ENV = 'NODE_ENV',
    SLEEP_TIME_SECONDS = 'SLEEP_TIME_SECONDS',
    SENDER_EMAIL = 'SENDER_EMAIL',
    SENDER_PASSWORD = 'SENDER_PASSWORD',
    RECEIVER_EMAILS = 'RECEIVER_EMAILS',
    PYTHON_PATH = 'PYTHON_PATH',
}

export const PROD =
    accessEnv(Environment.NODE_ENV, 'development') === 'production';
