import express from 'express';
import * as reimbsService from '../services/reimbursements-service';
import { User } from '../models/User';

export const reimbsRouter = express.Router();

/*
    http://localhost:3000/people
    Retrieves an array of people from database
*/
reimbsRouter.get('', (request, response, next) => {
    reimbsService.getAllReimbs().then(reimbs => {
        response.set('content-type', 'application/json');
        response.json(reimbs);
        next();
    }).catch(err => {
        response.sendStatus(500);
    });
});

/*
    http://localhost:3000/people/1
    Retrieves a single person from the database by id
    If the person does not exist, sends 404
*/
reimbsRouter.get('/:id', (request, response, next) => {
    const id = +request.params.id;
    reimbsService.getReimbById(id).then(reimb => {
        if (!reimb) {
            response.sendStatus(404);
        } else {
            response.json(reimb);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

/*
    POST http://localhost:3000/people
    Creates a new person and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/

reimbsRouter.post('', (request, response, next) => {
    const reimb = request.body;
    reimbsService.saveReimb(reimb)
        .then(newReimb => {
            response.status(201);
            response.json(newReimb);
            next();
        }).catch(err => {
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
reimbsRouter.patch('', (request, response, next) => {
    const reimb = request.body;
    reimbsService.patchReimb(reimb)
        .then(updatedReimb => {
            if (updatedReimb) {
                response.json(updatedReimb);
            } else {
                response.sendStatus(404);
            }
        }).catch(err => {
            response.sendStatus(500);
        }).finally(() => {
            next();
        })
});