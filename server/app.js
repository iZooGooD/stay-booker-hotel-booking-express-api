import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import db from './models/index.js';
import cors from 'cors';

const app = express();

// initialize/sync the database
db.sequelize
    .sync({ force: false })
    .then(() => {
        // eslint-disable-next-line no-console
        console.log(
            'Tables have been successfully created, if they do not already exist'
        );
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Unable to create tables:', error);
    });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger('dev'));
app.use(express.json());
// remove later for prod build
app.use(
    cors({
        origin: 'http://localhost:3000', // port for react app
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// catch 404
app.use(function (_req, res) {
    res.status(404).json({
        message: 'No route found',
    });
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
