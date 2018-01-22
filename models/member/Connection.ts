import { BusinessEntity } from "../BusinessEntity";
import { Status } from "../../enums/common/Status";
import { ConnectionType } from "../../enums/member/ConnectionType";
import { ConnectionCategory } from "../../enums/member/ConnectionCategory";

export class Connection extends BusinessEntity { 
    memberId: string = null;
    type: ConnectionType = null;
    category: ConnectionCategory = null;
    status: Status = null;
} 