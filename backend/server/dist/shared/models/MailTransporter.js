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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailTransporter = exports.MailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
class MailTransporter {
    constructor(sender, password, receivers) {
        this.sender = sender;
        this.password = password;
        this.transporter = null;
        this.receivers = receivers.join(', ');
    }
    sendMail(subject, text, attachmentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transporter)
                yield this.init();
            const mailOptions = {
                from: this.sender,
                to: this.receivers,
                subject: subject,
                html: `<b>${text}</b>`,
                attachments: [
                    {
                        filename: path_1.default.basename(attachmentPath),
                        path: attachmentPath,
                    },
                ],
            };
            if (!this.transporter) {
                throw new Error('Sending mail before transporter is initialized');
            }
            yield this.transporter.sendMail(mailOptions, (err, info) => {
                if (err)
                    throw err;
                logger_1.logger.info(`Email sent from ${this.sender} to ${this.receivers} with response: ${info.response}.`);
            });
        });
    }
}
exports.MailTransporter = MailTransporter;
class GmailTransporter extends MailTransporter {
    constructor(sender, password, receivers) {
        super(sender, password, receivers);
    }
    init() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.transporter = yield nodemailer_1.default.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: true,
                    service: 'gmail',
                    auth: {
                        user: this.sender,
                        pass: this.password,
                    },
                    tls: { rejectUnauthorized: false },
                });
                this.transporter.on('token', (token) => {
                    console.log('A new access token was generated');
                    console.log('User: %s', token.user);
                    console.log('Access Token: %s', token.accessToken);
                    console.log('Expires: %s', new Date(token.expires));
                });
                this.transporter.set('oauth2_provision_cb', (user, renew, callback) => {
                    if (!this.transporter)
                        throw new Error('Gmail transporter not initialized for oauth2_provision_cb..');
                    const accessToken = this.transporter.get('oauth2').accessToken;
                    if (!accessToken) {
                        return callback(new Error('Unknown user'));
                    }
                    else {
                        return callback(null, accessToken);
                    }
                });
                this.transporter.set('oauth2_provision_cb_error', (err) => {
                    console.log('Error refreshing access token: ', err);
                });
                resolve(true);
            }
            catch (err) {
                reject(err);
                logger_1.logger.error('Error while initializing gmail transporter.', err);
            }
        }));
    }
}
exports.GmailTransporter = GmailTransporter;
