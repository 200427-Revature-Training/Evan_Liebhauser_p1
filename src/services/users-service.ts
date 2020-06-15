import { User } from '../models/User';
import * as usersDao from '../daos/users-dao';
import { Reimb } from '../models/Reimbursement';

export function getAllUsers(): Promise<User[]> {
    // Apply internal business logic
    return usersDao.getAllUsers();
}

export function getUserById(id: number): Promise<User> {
    // Apply internal business logic
    return usersDao.getUserById(id);
}

export function getUserByUsername(username: string): Promise<User> {
    // Apply internal business logic
    return usersDao.getUserByUsername(username);
}

export function getUserByReimbId(id: number): Promise<User> {
    // Apply internal business logic
    return usersDao.getUserByReimbId(id);
}

export function saveUser(user: any): Promise<User> {

    // Data from the user cannot be trusted
    const newUser = new User(
        undefined, user.ERS_USERS_ID, user.ERS_PASSWORD, user.USER_FIRST_NAME, user.USER_LAST_NAME, user.USER_EMAIL, user.USER_ROLE_ID
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(user.ERS_USERS_ID && user.ERS_PASSWORD && user.USER_FIRST_NAME && user.USER_LAST_NAME && user.USER_EMAIL && user.USER_ROLE_ID) {
        // Data is valid - Continue submitting to DAO
        return usersDao.saveUser(newUser);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchUser(input: any): Promise<User> {

    const user = new User(
        input.ERS_USERS_ID, input.ERS_USERNAME, input.ERS_PASSWORD, input.USER_FIRST_NAME, input.USER_LAST_NAME, input.USER_EMAIL, input.USER_ROLE_ID
    );

    if (!user.ERS_USERS_ID) {
        throw new Error('400');
    }

    return usersDao.patchUser(user);
}