import { RuleBase } from "./RuleBase";
import { AuthorisationContext } from "./../../../models/authorisation/AuthorisationContext";
import { Member } from "./../../../models/member/Member";

export class ShouldOwn extends RuleBase {

    constructor(context: AuthorisationContext) {
        super(context);
    }

    execute(): boolean {

        let result = true;

        if (this.context.clientContext.id && this.context.entityContext.id) {
            result = result && this.context.clientContext.id === this.context.entityContext.owner.id;
        }

        if (this.context.clientContext.mobileNumber && this.context.entityContext.mobileNumber) {
            result = result && this.context.clientContext.mobileNumber === this.context.entityContext.mobileNumber;
        }

        if (this.context.clientContext.email && this.context.entityContext.email) {
            result = result && this.context.clientContext.email === this.context.entityContext.email;
        }

        return result;
    }

} 