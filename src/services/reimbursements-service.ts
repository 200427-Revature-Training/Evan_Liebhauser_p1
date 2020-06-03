import { Reimb } from '../models/Reimbursement';
import * as reimbsDao from '../daos/reimbursements-dao';
import { User } from '../models/User';

export function getAllReimbs(): Promise<Reimb[]> {
    // Apply internal business logic
    return reimbsDao.getAllReimbs();
}

export function getReimbById(id: number): Promise<Reimb> {
    // Apply internal business logic
    return reimbsDao.getReimbById(id);
}


export function getReimbsByUserId(id: number): Promise<Reimb[]> {
    return reimbsDao.getReimbsByUserId(id);
}


export function saveReimb(reimb: any): Promise<Reimb> {

    // Data from the user cannot be trusted
    const newReimb = new Reimb(
        reimb.REIMB_ID, reimb.REIMB_AMOUNT, reimb.REIMB_SUBMITTED, reimb.REIMB_RESOLVED, reimb.REIMB_DESCRIPTION, reimb.REIMB_RECEIPT, reimb.REIMB_AUTHOR, reimb. REIMB_RESOLVER, reimb.REIMB_STATUS_ID, reimb.REIMB_TYPE_ID
       
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(reimb.amount && reimb.timeSubmitted && reimb.author && reimb.reimbStatus && reimb.reimbType) {
        // Data is valid - Continue submitting to DAO
        return reimbsDao.saveReimb(newReimb);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchReimb(input: any): Promise<Reimb> {

    // We don't want to create Date(undefined) so check if input.birthdate
    // is defined, otherwise just pass undefined along
    const timeSubmitted = input.timeSubmitted && new Date(input.timeSubmitted);

    const reimb = new Reimb(
        input.REIMB_ID, input.REIMB_AMOUNT, input.REIMB_SUBMITTED, input.REIMB_RESOLVED, input.REIMB_DESCRIPTION, input.REIMB_RECEIPT, input.REIMB_AUTHOR, input. REIMB_RESOLVER, input.REIMB_STATUS_ID, input.REIMB_TYPE_ID
       
    );

    if (!reimb.id) {
        throw new Error('400');
    }

    return reimbsDao.patchReimb(reimb);
}