import express from 'express';
import bodyParser from 'body-parser';
import { db } from './daos/db';
import { usersRouter } from './routers/users-router';
import { reimbsRouter } from './routers/reimbursements-router';
import { authRouter } from './routers/authentication-router';
import { User } from './models/User'

const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')


const app = express();

// const initializePassport = require('./passport-config');
// initializePassport(passport, username => {
//     return usersRouter.
// })

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
app.use('/auth', authRouter);


// app.unsubscribe(express.urlencoded({ extended: false}))
// app.use(flash())
// app.use(session((
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// )))
app.use(passport.initialize())
app.use(passport.session())

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