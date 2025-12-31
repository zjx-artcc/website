import nodemailer from 'nodemailer';

const trap = require('nodemailer-trap-plugin').trap;

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT as unknown as number;
const SMTP_USER = process.env.SMTP_USERNAME;
const SMTP_PASS = process.env.SMTP_PASSWORD;

export const mailTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export const FROM_EMAIL = process.env.SMTP_FROM;