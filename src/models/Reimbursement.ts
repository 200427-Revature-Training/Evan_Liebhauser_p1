export class Reimb {
    id: number;
    amount: number;
    timeSubmitted: Date;
    timeResolved: Date;
    description: string;
    receipt: Blob; //type likely to be changed by final release
    author: number;
    resolver: number;
    reimbStatus: number;
    reimbType: number;

    static from(obj: ReimbRow): Reimb {
        const reimb = new Reimb(
            obj.REIMB_ID, obj.REIMB_AMOUNT, obj.REIMB_SUBMITTED, obj.REIMB_RESOLVED, obj.REIMB_DESCRIPTION, obj.REIMB_RECEIPT, obj.REIMB_AUTHOR, obj. REIMB_RESOLVER, obj.REIMB_STATUS_ID, obj.REIMB_TYPE_ID
        );
        return reimb
    }

    /*blob type of receipt likely to be changed by final release*/
    constructor(id: number, amount: number, timeSubmitted: Date, timeResolved: Date, description: string, receipt: Blob, author: number, resolver: number, reimbStatus: number, reimbType: number) {
        this.id = id;
        this.amount = amount;
        this.timeSubmitted = timeSubmitted;
        this.timeResolved = timeResolved;
        this.description = description;
        this.receipt = receipt;
        this.author = author;
        this.resolver = resolver;
        this.reimbStatus = reimbStatus;
        this.reimbType = reimbType;
    }
}

export interface ReimbRow {
    REIMB_ID: number;
    REIMB_AMOUNT: number;
    REIMB_SUBMITTED: Date;
    REIMB_RESOLVED: Date;
    REIMB_DESCRIPTION: string;
    REIMB_RECEIPT: Blob;
    REIMB_AUTHOR: number;
    REIMB_RESOLVER: number;
    REIMB_STATUS_ID: number;
    REIMB_TYPE_ID: number;
}