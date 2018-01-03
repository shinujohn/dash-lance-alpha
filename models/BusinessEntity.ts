
import { PrincipalType } from "./../enums/common/PrincipalType";

export class BusinessEntity {
    id: string;
    owner: ClientContextInfo;
    audit: AuditInfo;
}

export class ClientContextInfo {
    id: string;
    type: PrincipalType; 
}

export class AuditInfo {
    updatedBy: ClientContextInfo;
    timeStamp: Date;
}