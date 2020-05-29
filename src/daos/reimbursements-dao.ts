import { db } from '../daos/db';
import { Reimb, ReimbRow } from '../models/Reimbursement';
import { User } from '../models/User';
/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */

export function getAllReimbs(): Promise<Reimb[]> {
    const sql = 'SELECT * FROM reimbs';

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<ReimbRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<ReimbRow>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: ReimbRow[] = result.rows;

        console.log(rows);

        // 5. Convert row data format to Reimb objects
        const reimbs: Reimb[] = rows.map(row => Reimb.from(row));
        return reimbs;
    });
}

export function getReimbById(id: number): Promise<Reimb> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM reimbs WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM reimbs WHERE id = $1';

    return db.query<ReimbRow>(sql, [id])
        .then(result => result.rows.map(row => Reimb.from(row))[0]);
}

/* Async function - A function that is naturally asynchronous.  The return value of an async
function MUST be a promise.  If a non-promise value is returned, it will implicitly be wrapped
in a promise. Async functions are the only places where the 'await' keyword may be used. The
await keyword is a keyword used to call async functions which implicitly unwraps the promise
and pauses execution in the current context until the asynchronous function has resolved. */
export async function getUsersByReimbId(reimbId: number): Promise<User[]> {
    const userExists: boolean = await reimbExists(reimbId);
    if (!userExists) {
        return undefined;
    }

    const sql = `SELECT users.* FROM user_owners \
LEFT JOIN users ON user_owners.users_id = users.id \
WHERE reimbs_id = $1`;

    // await will pause execution, waiting for the promise to resolve, then evaluate to 
    // value the promise resolves to
    const result = await db.query<User>(sql, [reimbId]);
    return result.rows;

}

/*
    Function to check if a user exists with a given ID
*/
export async function reimbExists(reimbId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT id FROM reimbs WHERE id = $1);`;
    const result = await db.query<Exists>(sql, [reimbId]);
    return result.rows[0].exists;
}

export function saveReimb(reimb: Reimb): Promise<Reimb> {
    const sql = `INSERT INTO reimbs (first_name, last_name, birthdate) \
VALUES ($1, $2, $3) RETURNING *`;

    return db.query<ReimbRow>(sql, [
        reimb.amount,
        reimb.timeSubmitted.toISOString(),
        reimb.timeResolved,
        reimb.description,
        reimb.receipt,
        reimb.author,
        reimb.resolver,
        reimb.reimbStatus,
        reimb.reimbType,
    ]).then(result => result.rows.map(row => Reimb.from(row))[0]);
}

export function patchReimb(reimb: Reimb): Promise<Reimb> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'

    const sql = `UPDATE reimbs SET first_name = COALESCE($1, first_name), \
last_name = COALESCE($2, last_name), birthdate = COALESCE($3, birthdate) \
WHERE id = $4 RETURNING *`;

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