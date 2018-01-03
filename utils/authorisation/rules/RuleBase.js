"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * All the rules are inherited from this base class
 */
var RuleBase = /** @class */ (function () {
    /**
     * Use to set the context
     */
    function RuleBase(context) {
        this.context = context;
    }
    ;
    /**
     * Method to call rule
     */
    RuleBase.prototype.execute = function () {
        return false;
    };
    ;
    return RuleBase;
}());
exports.RuleBase = RuleBase;
