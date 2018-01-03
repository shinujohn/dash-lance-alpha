import { BusinessEntity } from "../BusinessEntity";

export class Member extends BusinessEntity {
    firstName: string = null;
    middleName: string = null;
    lastName: string = null;
    mobileNumber: string = null;
    email: string = null;
    get fullName(): string {
        return `${this.firstName}${this.middleName ? ' ' + this.middleName : ''} ${this.lastName}`;
    }
}

