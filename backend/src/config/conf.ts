import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import type { CorsOptions } from 'cors';

dotenv.config();

interface envConfig {
  port?: number;
  node_env?: string;
}

export const conf: envConfig = {
  port: Number(process.env.PORT),
  node_env: String(process.env.NODE_ENV),
};

const mailConfigOptions = {
  host: conf.node_env == 'dev' ? process.env.DEV_HOST : process.env.PROD_HOST,
  port: 587,
  secure: false,
  auth: {
    user: conf.node_env == 'dev' ? process.env.DEV_MAIL : process.env.PROD_MAIL,
    pass: conf.node_env == 'dev' ? process.env.DEV_PASS : process.env.PROD_PASS,
  },
};

export const origin = process.env.origin;
export const REDIS_URL: string | undefined = process.env.REDIS_URL;

export const corsOption: CorsOptions = {
  origin: origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

export const transporter = nodemailer.createTransport(mailConfigOptions);
