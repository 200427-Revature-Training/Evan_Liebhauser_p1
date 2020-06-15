import { db } from '../daos/db';
import { User, UserRow } from '../models/User';
import { Reimb } from '../models/Reimbursement';
import { reimbExists } from '../daos/reimbursements-dao'

/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */

export async function getAllUsers(): Promise<User[]> {
    const sql = 'SELECT * FROM p1.ERS_USERS';

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<UserRow>
    // 3. We can react to the database response by chaining a .then onto the query
    const result = await db.query<UserRow>(sql, []);
    // 4. Extract rows from the query response
    const rows: UserRow[] = result.rows;
    console.log(rows);
    return rows;
    // 5. Convert row data format to User objects
    // const users: User[] = rows.map(row => User.from(row));
    // return users;
}

export async function getUserById(id: number): Promise<User> {

    const sql = 'SELECT * FROM p1.ERS_USERS WHERE ERS_USERS_ID = $1';
    const result = await db.query<UserRow>(sql, [id]);
    // 4. Extract rows from the query response
    const rows: UserRow[] = result.rows;
    return rows[0];
    // return db.query<UserRow>(sql, [id])
    //     .then(result => result.rows.map(row => User.from(row))[0]);
}



/*
    Function to check if a user exists with a given ID
*/

export function saveUser(user: User): Promise<User> {
    const sql = `INSERT INTO users (ERS_USERNAME, ERS_PASSWORD, USER_FIRST_NAME, USER_LAST_NAME, USER_EMAIL, USER_ROLE_ID) \
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    
    return db.query<UserRow>(sql, [
        user.ERS_USERNAME,
        user.ERS_PASSWORD,
        user.USER_FIRST_NAME,
        user.USER_LAST_NAME,
        user.USER_EMAIL,
        user.USER_ROLE_ID
    ]).then(result => result.rows.map(row => User.from(row))[0]);
}

export function patchUser(user: User): Promise<User> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'
    
    const sql = `UPDATE p1.ERS_USERS SET ERS_USERNAME = COALESCE($1, ERS_USERNAME), ERS_PASSWORD = COALESCE($2, ERS_PASSWORD), USER_FIRST_NAME = COALESCE($3, USER_FIRST_NAME), \
    USER_LAST_NAME = COALESCE($4, USER_LAST_NAME), USER_EMAIL = COALESCE($5, USER_EMAIL), USER_ROLE_ID = COALESCE($6, USER_ROLE_ID) \
    WHERE ERS_USERS_ID = $7 RETURNING *`;
    
    return db.query<UserRow>(sql, [])
    .then(result => result.rows.map(row => User.from(row))[0]);
}

export async function getUserByReimbId(reimbId: number): Promise<User> {
    const exists: boolean = await reimbExists(reimbId);
    if (!exists) {
        return undefined;
    }
    
    const sql = `SELECT * FROM p1.ERS_REIMBURSEMENT \
    LEFT JOIN p1.ERS_USERS ON REIMB_AUTHOR = ERS_USERS_ID \
    WHERE REIMB_ID = $1`;
    
    // await will pause execution, waiting for the promise to resolve, then evaluate to 
    // value the promise resolves to
    return db.query<UserRow>(sql, [reimbId])
        .then(result => result.rows.map(row => User.from(row))[0]);
    
}

export async function getUserByUsername(username: string): Promise<User> {
    const userExists: boolean = await usernameExists(username);
    if (!userExists) {
        return undefined;
    }
    
    const sql = `SELECT * FROM p1.ERS_USERS WHERE ERS_USERNAME = $1`
    
}

export async function usernameExists(username:string): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT USERNAME FROM p1.ERS_USERS WHERE USERNAME = $1)`;
    const result = await db.query<Exists>(sql, [username]);
    return result.rows[0].exists;
}

export async function userIdExists(userId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT * FROM ERS_USERS WHERE ERS_USERS_ID = $1);`;
    const result = await db.query<Exists>(sql, [userId]);
    return result.rows[0].exists;
}

interface Exists {
    exists: boolean;
}