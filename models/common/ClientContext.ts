
import { PrincipalType } from "./../../enums/common/PrincipalType";

export class ClientContext {
    type: PrincipalType;
    id: string;
    name: string;
    mobileNumber: string = null; // optional, if the ID not available
    email: string = null; // optional, if the ID not available
    roles: string[];
}

