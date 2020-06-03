import { db } from '../daos/db';
import { Reimb, ReimbRow } from '../models/Reimbursement';
import { User } from '../models/User';


//return all reimbursements
export function getAllReimbs(): Promise<Reimb[]> {
    const sql = 'SELECT * FROM ERS_REIMBURSEMENT';
    return db.query<ReimbRow>(sql, []).then(result => {
        const rows: ReimbRow[] = result.rows;

        console.log(rows);

        const reimbs: Reimb[] = rows.map(row => Reimb.from(row));
        return reimbs;
    });
}

// Get all reimbursements for sepecific user
export function getReimbsByUserId(UserId: number): Promise<Reimb[]> {
    const sql = 'SELECT * FROM ERS_REIMBURSEMENT WHERE REIMB_AUTHOR = $1'

    return db.query<ReimbRow>(sql, [UserId]).then(result => {
        const rows: ReimbRow[] = result.rows;
        const reimbs: Reimb[] = rows.map(row => Reimb.from(row));
        return reimbs;
    });
}

//get a specific reimbursement using its id number
export function getReimbById(id: number): Promise<Reimb> {
    const sql = 'SELECT * FROM ERS_REIMBURSEMENT WHERE REIMB_ID = $1';

    return db.query<ReimbRow>(sql, [id])
        .then(result => result.rows.map(row => Reimb.from(row))[0]);
}

/*
    Function to check if a user exists with a given ID
*/
export async function reimbExists(reimbId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT id FROM ERS_REIMBURSEMENT WHERE REIMB_ID = $1);`;
    const result = await db.query<Exists>(sql, [reimbId]);
    return result.rows[0].exists;
}

export function saveReimb(reimb: Reimb): Promise<Reimb> {
    const sql = `INSERT INTO ERS_REIMBURSEMENTS (REIMB_AMOUNT, REIMB_SUBMITTED. REIMB_DESCRIPTION, \
        REIMB_RECEIPT, REIMB_AUTHOR, REIMB_STATUS_ID, REIMB_TYPE_ID) \
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

    return db.query<ReimbRow>(sql, [
        reimb.amount,
        reimb.timeSubmitted.toISOString(),
        reimb.description,
        reimb.receipt,
        reimb.author,
        reimb.reimbStatus,
        reimb.reimbType,
    ]).then(result => result.rows.map(row => Reimb.from(row))[0]);
}

export function patchReimb(reimb: Reimb): Promise<Reimb> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'

    const sql = `UPDATE reimbs SET REIMB_AMOUNT = COALESCE($1, REIMB_AMOUNT), REIMB_SUBMITTED = COALESCE($2, REIMB_SUBMITTED), \
        REIMB_RESOLVED = COALESCE($3, REIMB_RESOLVED), REIMB_DESCRIPTION = COALESCE($4, REIMB_DESCRIPTION), \
        REIMB_RECEIPT = COALESCE($5, REIMB_RECEIPT), REIMB_AUTHOR = COALESCE($6, REIMB_AUTHOR), \
        REIMB_RESOLVER = COALESCE($7, REIMB_RESOLVER), REIMB_STATUS_ID = COALESCE($8, REIMB_STATUS_ID), \
        REIMB_TYPE_ID = COALESCE($9, REIMB_TYPE_ID)
        WHERE REIMB_ID = $10 RETURNING *`;

    // if we call toISOString on undefined, we get a TypeError, since undefined
    // is valid for patch, we guard operator to defend against calling
    // .toISOString on undefined, allowing COALESCE to do its job
    const timeSubmitted = reimb.timeSubmitted && reimb.timeSubmitted.toISOString();
    const timeResolved = reimb.timeResolved && reimb.timeResolved.toISOString();

    const params = [
        reimb.amount,
        timeSubmitted,
        timeResolved,
        reimb.description,
        reimb.receipt,
        reimb.author,
        reimb.resolver,
        reimb.reimbStatus,
        reimb.reimbType];

    return db.query<ReimbRow>(sql, params)
        .then(result => result.rows.map(row => Reimb.from(row))[0]);
}

interface Exists {
    exists: boolean;
}