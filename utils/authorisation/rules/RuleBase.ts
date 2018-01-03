import { AuthorisationContext } from './../../../models/authorisation/AuthorisationContext';

/**
 * All the rules are inherited from this base class
 */
export class RuleBase {

    /**
     * Context on which the rule needs to be executed
     */
    public context: AuthorisationContext;

    /**
     * Use to set the context
     */
    constructor(context: AuthorisationContext) {
        this.context = context;
    };

    /**
     * Method to call rule
     */
    execute(): boolean {
        return false;
    };
}