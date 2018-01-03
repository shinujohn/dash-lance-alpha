import { Resource } from "./enums/Resource";
import { Action } from "./enums/Action";
import { AuthorisationContext } from "./../../models/authorisation/AuthorisationContext";
import { RuleBase } from "./rules/RuleBase";
import * as _ from "lodash";

export class RuleEngine {

    private _context: AuthorisationContext;
    constructor(context: AuthorisationContext) {
        this._context = context;
    }

    execute(resource: Resource, action: Action) {

        // Get the rules and roles from configuration
        let resourceAuthConfig = require(`./config/${resource}`);
        let actionConfigs: ActionAccessConfiguration[] = resourceAuthConfig[action];
        let flag = true;

        _.forEach(actionConfigs, (actionConfig) => {

            let roleCheck = this.roleExists(actionConfig);
            let ruleCheck = this.executeRules(actionConfig);
            flag = roleCheck && ruleCheck;

            if (flag) {

                // break the loop
                return false;
            };
        });

        return flag;
    }

    private roleExists(actionConfig: ActionAccessConfiguration) {
        if (actionConfig.roles && actionConfig.roles.length) {
            return this._context.clientContext.roles.some((userRole: any) => {
                return actionConfig.roles.indexOf(userRole) > -1;
            });
        } else {
            return true;
        }
    }


    private executeRules(actionConfig: ActionAccessConfiguration) {
        let flag = true;

        if (actionConfig.rules && actionConfig.rules.length) {
            for (let i = 0; i < actionConfig.rules.length; i++) {

                let Rule = require(`./rules/${actionConfig.rules[i]}`)[actionConfig.rules[i]];
                let rule = new Rule(this._context);
                flag = rule.execute();
                if (!flag) break;
            }
        }

        return flag;
    }
}

class ActionAccessConfiguration {
    rules: string[];
    roles: string[];
}

