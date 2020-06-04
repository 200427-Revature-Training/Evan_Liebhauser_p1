export class User{
    ERS_USERS_ID: number;
    ERS_USERNAME: string;
    ERS_PASSWORD: string; /* DON'T store password as plaintext in final release */
    USER_FIRST_NAME: string;
    USER_LAST_NAME: string;
    USER_EMAIL: string;
    USER_ROLE_ID: number;

    static from(obj: UserRow): User {
        const user = new User(
            obj.ERS_USERS_ID, obj.ERS_USERNAME, obj.ERS_PASSWORD, obj.USER_FIRST_NAME, obj.USER_LAST_NAME, obj.USER_EMAIL, obj.USER_ROLE_ID
        );
        return user;
    }

    constructor(ERS_USERS_ID: number, ERS_USERNAME: string, ERS_PASSWORD: string, USER_FIRST_NAME: string, USER_LAST_NAME: string, USER_EMAIL: string, USER_ROLE_ID: number) {
        this.ERS_USERS_ID = ERS_USERS_ID;
        this.ERS_USERNAME = ERS_USERNAME;
        this.ERS_PASSWORD = ERS_PASSWORD;
        this.USER_FIRST_NAME = USER_FIRST_NAME;
        this.USER_LAST_NAME = USER_LAST_NAME;
        this.USER_EMAIL = USER_EMAIL;
        this.USER_ROLE_ID = USER_ROLE_ID;
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