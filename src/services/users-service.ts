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

export function getUsersByReimbId(id: number): Promise<User[]> {
    return usersDao.getUsersByReimbId(id);
}

export function saveUser(user: any): Promise<User> {

    // Data from the user cannot be trusted
    const newUser = new User(
        undefined, user.username, user.password, user.firstName, user.lastName, user.email, user.roleID
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(user.username && user.password && user.firstName && user.lastName && user.email && user.roleID) {
        // Data is valid - Continue submitting to DAO
        return usersDao.saveUser(newUser);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchUser(input: any): Promise<User> {

    const user = new User(
        input.id, input.username, input.password, input.firstName, input.lastName, input.email, input.roleID
    );

    if (!user.id) {
        throw new Error('400');
    }

    return usersDao.patchUser(user);
}