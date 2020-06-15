import express from 'express';
import * as usersService from '../services/users-service';
import { Reimb } from '../models/Reimbursement';

export const usersRouter = express.Router();

/*
    http://localhost:3000/users
    Retrieves an array of users from database
*/
usersRouter.get('', (request, response, next) => {
    usersService.getAllUsers().then(users => {
        response.set('content-type', 'application/json');
        response.json(users);
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
    });
});

/*
    http://localhost:3000/users/1
    Retrieves a single user from the database by id
    If the user does not exist, sends 404
*/
usersRouter.get('/:id', (request, response, next) => {
    const id = +request.params.id;
    console.log(`${id}`)
    usersService.getUserById(id).then(user => {
        if (!user) {
            response.sendStatus(404);
        } else {
            response.json(user);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

/*
* GET /users/{id}/reimbs - Array of reimbs owned by that user
* or 404 if the user does not exist
*/


/*
    POST http://localhost:3000/users
    Creates a new user and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/
usersRouter.post('', (request, response, next) => {
    const user = request.body;
    usersService.saveUser(user)
        .then(newUser => {
            response.status(201);
            response.json(newUser);
            next();
        }).catch(err => {
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
usersRouter.patch('', (request, response, next) => {
    const user = request.body;
    usersService.patchUser(user)
        .then(updatedUser => {
            if (updatedUser) {
                response.json(updatedUser);
            } else {
                response.sendStatus(404);
            }
        }).catch(err => {
            response.sendStatus(500);
        }).finally(() => {
            next();
        })
});