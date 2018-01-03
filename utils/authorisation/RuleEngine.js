"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var RuleEngine = /** @class */ (function () {
    function RuleEngine(context) {
        this._context = context;
    }
    RuleEngine.prototype.execute = function (resource, action) {
        var _this = this;
        // Get the rules and roles from configuration
        var resourceAuthConfig = require("./config/" + resource);
        var actionConfigs = resourceAuthConfig[action];
        var flag = true;
        _.forEach(actionConfigs, function (actionConfig) {
            var roleCheck = _this.roleExists(actionConfig);
            var ruleCheck = _this.executeRules(actionConfig);
            flag = roleCheck && ruleCheck;
            if (flag) {
                // break the loop
                return false;
            }
            ;
        });
        return flag;
    };
    RuleEngine.prototype.roleExists = function (actionConfig) {
        if (actionConfig.roles && actionConfig.roles.length) {
            return this._context.clientContext.roles.some(function (userRole) {
                return actionConfig.roles.indexOf(userRole) > -1;
            });
        }
        else {
            return true;
        }
    };
    RuleEngine.prototype.executeRules = function (actionConfig) {
        var flag = true;
        if (actionConfig.rules && actionConfig.rules.length) {
            for (var i = 0; i < actionConfig.rules.length; i++) {
                var Rule = require("./rules/" + actionConfig.rules[i])[actionConfig.rules[i]];
                var rule = new Rule(this._context);
                flag = rule.execute();
                if (!flag)
                    break;
            }
        }
        return flag;
    };
    return RuleEngine;
}());
exports.RuleEngine = RuleEngine;
var ActionAccessConfiguration = /** @class */ (function () {
    function ActionAccessConfiguration() {
    }
    return ActionAccessConfiguration;
}());
