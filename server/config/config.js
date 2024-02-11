import dotenv from 'dotenv';

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    database: isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
    user: isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER,
    password: isProduction ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS,
    host: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
    dialect: 'mysql',
};
export default config;
