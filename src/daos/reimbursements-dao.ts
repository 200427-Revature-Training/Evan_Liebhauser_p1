import { db } from '../daos/db';
import { Reimb, ReimbRow } from '../models/Reimbursement';
import { User } from '../models/User';
import { userIdExists } from './users-dao';


//return all reimbursements
export function getAllReimbs(): Promise<Reimb[]> {
    const sql = 'SELECT * FROM p1.ERS_REIMBURSEMENT';
    return db.query<ReimbRow>(sql, []).then(result => {
        const rows: ReimbRow[] = result.rows;

        console.log(rows);
        return rows;
        // const reimbs: Reimb[] = rows.map(row => Reimb.from(row));
        // return reimbs;
    });
}

// Get all reimbursements for sepecific user
export async function getReimbsByUserId(userId: number): Promise<Reimb[]> {
    const userExists: boolean = await userIdExists(userId);
    if (!userExists) {
        console.log('failed');
        return undefined;
    }
    console.log('passed');
    const sql = 'SELECT * FROM p1.ERS_REIMBURSEMENT WHERE REIMB_AUTHOR = $1';

    const result = await db.query<ReimbRow>(sql, [userId])
        const rows: ReimbRow[] = result.rows;
        console.log(rows)
        return rows
        // const reimbs: Reimb[] = rows.map(row => Reimb.from(row));
};

//get a specific reimbursement using its id number
export async function getReimbById(id: number): Promise<Reimb> {
    const sql = 'SELECT * FROM p1.ERS_REIMBURSEMENT WHERE REIMB_ID = $1';

    const result = await db.query<ReimbRow>(sql, [id]);
    const rows: ReimbRow[] = result.rows;
    return rows[0];
        // .then(result => result.rows.map(row => Reimb.from(row))[0]);
}

/*
    Function to check if a user exists with a given ID
*/
export async function reimbExists(reimbId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT REIMB_ID FROM p1.ERS_REIMBURSEMENT WHERE REIMB_ID = $1);`;
    const result = await db.query<Exists>(sql, [reimbId]);
    return result.rows[0].exists;
}

export async function saveReimb(reimb: Reimb): Promise<Reimb> {
    const sql = `INSERT INTO p1.ERS_REIMBURSEMENT (REIMB_AMOUNT, REIMB_SUBMITTED, REIMB_DESCRIPTION, \
        REIMB_RECEIPT, REIMB_AUTHOR, REIMB_STATUS_ID, REIMB_TYPE_ID) \
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

    const params =         [
        reimb.REIMB_AMOUNT,
        reimb.REIMB_SUBMITTED,
        reimb.REIMB_DESCRIPTION,
        reimb.REIMB_RECEIPT,
        reimb.REIMB_AUTHOR,
        reimb.REIMB_STATUS_ID,
        reimb.REIMB_TYPE_ID,
    ]

    const result = await db.query<ReimbRow>(sql, params);
    const rows: ReimbRow[] = result.rows;
    console.log('can i even log this?');
    console.log(rows[0]);
    console.log('logging attempted');
    return rows[0];
}

export async function patchReimb(reimb: Reimb): Promise<Reimb> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'

    const sql = `UPDATE p1.ERS_REIMBURSEMENT SET REIMB_AMOUNT = COALESCE($1, REIMB_AMOUNT), \
        REIMB_SUBMITTED = COALESCE($2, REIMB_SUBMITTED), REIMB_RESOLVED = COALESCE($3, REIMB_RESOLVED), \
        REIMB_DESCRIPTION = COALESCE($4, REIMB_DESCRIPTION), REIMB_RECEIPT = COALESCE($5, REIMB_RECEIPT), \
        REIMB_AUTHOR = COALESCE($6, REIMB_AUTHOR), REIMB_RESOLVER = COALESCE($7, REIMB_RESOLVER), \
        REIMB_STATUS_ID = COALESCE($8, REIMB_STATUS_ID), REIMB_TYPE_ID = COALESCE($9, REIMB_TYPE_ID) \
        WHERE REIMB_ID = $10 RETURNING *`;

    const params = [
        reimb.REIMB_AMOUNT,
        reimb.REIMB_SUBMITTED,
        reimb.REIMB_RESOLVED,
        reimb.REIMB_DESCRIPTION,
        reimb.REIMB_RECEIPT,
        reimb.REIMB_AUTHOR,
        reimb.REIMB_RESOLVER,
        reimb.REIMB_STATUS_ID,
        reimb.REIMB_TYPE_ID,
        reimb.REIMB_ID
    ];
    const result = await db.query<ReimbRow>(sql, params);
    const rows: ReimbRow[] = result.rows;
    console.log('can i even log this?');
    console.log(rows[0]);
    console.log('logging attempted');
    return rows[0];
}

interface Exists {
    exists: boolean;
}