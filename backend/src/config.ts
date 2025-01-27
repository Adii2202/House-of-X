import joi from "joi";
import { config } from "dotenv";

config({
    path: './src/.env',
    debug: true,
    encoding: 'utf-8'
})

const envSchema = joi.object({
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_NAME: joi.string().required(),
    PORT: joi.number().required()
}).unknown();

export interface Env {
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_NAME: string;
    PORT: number;
}

function getEnv(): Env {
    const { value, error } = envSchema.validate(process.env);
    if (error) {
        throw new Error(`Environment variable validation failed : ${error.message}`)
    }
    return value as Env;
}

export default getEnv;