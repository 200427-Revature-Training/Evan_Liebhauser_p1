import express from 'express';
import * as reimbsService from '../services/reimbursements-service';
import { User } from '../models/User';

export const reimbsRouter = express.Router();

/*
    http://localhost:3000/reimbursements
    Retrieves an array of reimbursements from database
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
    http://localhost:3000/reimbursements/1
    Retrieves a single reimbursement from the database by id
    If the reimbursement does not exist, sends 404
*/
reimbsRouter.get('/:id', (request, response, next) => {
    const id = +request.params.id;
    reimbsService.getReimbById(id).then(reimb => {
        if (!reimb) {
            response.sendStatus(404);
        } else {
            console.log(reimb);
            response.json(reimb);
        }
        next();
    }).catch(err => {
        console.log(err)
        response.sendStatus(500);
        next();
    })
});


reimbsRouter.get('/user/:id', (request, response, next) => {
    const id = +request.params.id;
    console.log(id);
    reimbsService.getReimbsByUserId(id).then(reimb => {
        if (!reimb[0]) {
            response.sendStatus(404);
        } else {
            response.json(reimb);
        }
        next();
    }).catch(err => {
        console.log(err);
        response.sendStatus(500);
        next();
    })
});
 
/*
    POST http://localhost:3000/reimbursements
    Creates a new reimbursement and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/

reimbsRouter.post('', (request, response, next) => {
    const reimb = request.body;
    reimbsService.saveReimb(reimb)
        .then(newReimb => {
            console.log('attempting save output');
            console.log(newReimb);
            response.json(newReimb);
            response.status(201);
            next();
        }).catch(err => {
            console.log(err)
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
reimbsRouter.patch('', (request, response, next) => {
    console.log('routed');
    const reimb = request.body;
    // const id = +request.params.id;
    reimbsService.patchReimb(reimb)
        .then(updatedReimb => {
            if (updatedReimb) {
                console.log(updatedReimb)
                response.json(updatedReimb);
            } else {
                response.sendStatus(404);
            }
        }).catch(err => {
            console.log(err)
            response.sendStatus(500);
        }).finally(() => {
            next();
        })
});