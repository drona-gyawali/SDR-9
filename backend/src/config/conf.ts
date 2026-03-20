import dotenv from 'dotenv';
import type { CorsOptions } from 'cors';
import { Resend } from 'resend';

dotenv.config();

interface envConfig {
  port?: number;
  node_env?: string;
}

export const conf: envConfig = {
  port: Number(process.env.PORT),
  node_env: String(process.env.NODE_ENV),
};

export const origin = process.env.origin;
export const REDIS_URL: string | undefined = process.env.REDIS_URL;

export const corsOption: CorsOptions = {
  origin: origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

export const resend = new Resend(process.env.RESEND_API);
