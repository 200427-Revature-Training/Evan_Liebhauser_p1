export class Reimb {
    REIMB_ID: number;
    REIMB_AMOUNT: number;
    REIMB_SUBMITTED: string;
    REIMB_RESOLVED: string;
    REIMB_DESCRIPTION: string;
    REIMB_RECEIPT: string; //type likely to be changed by final release
    REIMB_AUTHOR: number;
    REIMB_RESOLVER: number;
    REIMB_STATUS_ID: number;
    REIMB_TYPE_ID: number;

    static from(obj: ReimbRow): Reimb {
        const reimb = new Reimb(
            obj.REIMB_ID, obj.REIMB_AMOUNT, obj.REIMB_SUBMITTED, obj.REIMB_RESOLVED, obj.REIMB_DESCRIPTION, obj.REIMB_RECEIPT, obj.REIMB_AUTHOR, obj.REIMB_RESOLVER, obj.REIMB_STATUS_ID, obj.REIMB_TYPE_ID
        );
        return reimb
    }

    /*blob type of REIMB_RECEIPT likely to be changed by final release*/
    constructor(REIMB_ID: number, REIMB_AMOUNT: number, REIMB_SUBMITTED: string, REIMB_RESOLVED: string, REIMB_DESCRIPTION: string, REIMB_RECEIPT: string, REIMB_AUTHOR: number, REIMB_RESOLVER: number, REIMB_STATUS_ID: number, REIMB_TYPE_ID: number) {
        this.REIMB_ID = REIMB_ID;
        this.REIMB_AMOUNT = REIMB_AMOUNT;
        this.REIMB_SUBMITTED = REIMB_SUBMITTED;
        this.REIMB_RESOLVED = REIMB_RESOLVED;
        this.REIMB_DESCRIPTION = REIMB_DESCRIPTION;
        this.REIMB_RECEIPT = REIMB_RECEIPT;
        this.REIMB_AUTHOR = REIMB_AUTHOR;
        this.REIMB_RESOLVER = REIMB_RESOLVER;
        this.REIMB_STATUS_ID = REIMB_STATUS_ID;
        this.REIMB_TYPE_ID = REIMB_TYPE_ID;
    }
}

export interface ReimbRow {
    REIMB_ID: number;
    REIMB_AMOUNT: number;
    REIMB_SUBMITTED: string;
    REIMB_RESOLVED: string;
    REIMB_DESCRIPTION: string;
    REIMB_RECEIPT: string;
    REIMB_AUTHOR: number;
    REIMB_RESOLVER: number;
    REIMB_STATUS_ID: number;
    REIMB_TYPE_ID: number;
}