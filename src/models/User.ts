export class User{
    id: number;
    username: string;
    password: string; /* DON'T store password as plaintext in final release */
    firstName: string;
    lastName: string;
    email: string;
    roleID: number;

    static from(obj: UserRow): User {
        const user = new User(
            obj.ERS_USERS_ID, obj.ERS_USERNAME, obj.ERS_PASSWORD, obj.USER_FIRST_NAME, obj.USER_LAST_NAME, obj.USER_EMAIL, obj.USER_ROLE_ID
        );
        return user;
    }

    constructor(id: number, username: string, password: string, firstName: string, lastName: string, email: string, roleID: number) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roleID = roleID;
    }
}

export interface UserRow {
    ERS_USERS_ID: number;
    ERS_USERNAME: string;
    ERS_PASSWORD: string;
    USER_FIRST_NAME: string;
    USER_LAST_NAME: string;
    USER_EMAIL: string;
    USER_ROLE_ID: number;
}