"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGmailTransporter = exports.setDifference = exports.sleep = void 0;
const MailTransporter_1 = require("../models/MailTransporter");
const accessEnv_1 = require("./accessEnv");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
exports.sleep = sleep;
const setDifference = (setA, setB) => {
    return setA.filter((itemA) => !setB.some((itemB) => itemA.equals(itemB)));
};
exports.setDifference = setDifference;
const getGmailTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    const sender = (0, accessEnv_1.accessEnv)("SENDER_EMAIL" /* Environment.SENDER_EMAIL */, 'sender@email.com');
    const password = (0, accessEnv_1.accessEnv)("SENDER_PASSWORD" /* Environment.SENDER_PASSWORD */, 'password');
    const receivers = (0, accessEnv_1.accessEnv)("RECEIVER_EMAILS" /* Environment.RECEIVER_EMAILS */, 'receiver1@email.com,receiver2@email.com').split(',');
    return yield new MailTransporter_1.GmailTransporter(sender, password, receivers);
});
exports.getGmailTransporter = getGmailTransporter;
