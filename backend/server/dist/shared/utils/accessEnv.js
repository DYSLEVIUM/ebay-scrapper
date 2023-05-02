"use strict";
//  accessing a variable inside process.env, throwing an error if it is not found
//  caching the values improves the performance as accessing process.env many times is bad
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessEnv = void 0;
const cache = {};
const accessEnv = (key, defaultValue) => {
    if (!(key in process.env) || typeof process.env[key] === 'undefined') {
        if (defaultValue)
            return defaultValue;
        throw new Error(`${key} is not an environment variable`);
    }
    if (!(key in cache))
        cache[key] = process.env[key];
    return cache[key];
};
exports.accessEnv = accessEnv;
