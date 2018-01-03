import { BusinessEntity } from "../BusinessEntity";

export class Connection extends BusinessEntity {
    from: string = null;
    to: string = null;
    type: string = null;
    category: string  = null;
    isApproved: boolean = false;
} 