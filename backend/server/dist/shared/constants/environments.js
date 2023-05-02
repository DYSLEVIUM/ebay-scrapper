"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROD = void 0;
const accessEnv_1 = require("../utils/accessEnv");
exports.PROD = (0, accessEnv_1.accessEnv)("NODE_ENV" /* Environment.NODE_ENV */, 'development') === 'production';
