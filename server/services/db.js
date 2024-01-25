import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

const connectionPool = mysql.createPool({
    host: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
    user: isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER,
    password: isProduction ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS,
    database: isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});


const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connectionPool.query(sql, params, (err, results, fields) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
};

export { query };