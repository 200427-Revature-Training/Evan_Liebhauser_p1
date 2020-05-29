import express from 'express';
import bodyParser from 'body-parser';
import { db } from './daos/db';
import { usersRouter } from './routers/users-router';
import { reimbsRouter } from './routers/reimbursements-router';

const app = express();

const port = process.env.port || 3000;
app.set('port', port);

/*
    ? Middleware Registration
*/
app.use(bodyParser.json());

/*
    ? Router Registration
*/
app.use('/users', usersRouter);
app.use('/reimbursements', reimbsRouter);

/*
    Listen for SIGINT signal - issued by closing the server with ctrl+c
    This releases the database connections prior to app being stopped
*/
// process.on('SIGINT', () => {
//     db.end().then(() => {
//         console.log('Database pool closed');
//     });
// });

process.on('unhandledRejection', () => {
    db.end().then(() => {
        console.log('Database pool closed');
    });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});