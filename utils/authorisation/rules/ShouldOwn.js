"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RuleBase_1 = require("./RuleBase");
var ShouldOwn = /** @class */ (function (_super) {
    __extends(ShouldOwn, _super);
    function ShouldOwn(context) {
        return _super.call(this, context) || this;
    }
    ShouldOwn.prototype.execute = function () {
        var result = true;
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
    };
    return ShouldOwn;
}(RuleBase_1.RuleBase));
exports.ShouldOwn = ShouldOwn;
