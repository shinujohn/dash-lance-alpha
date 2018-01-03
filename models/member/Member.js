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
var BusinessEntity_1 = require("../BusinessEntity");
var Member = /** @class */ (function (_super) {
    __extends(Member, _super);
    function Member() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.firstName = null;
        _this.middleName = null;
        _this.lastName = null;
        _this.mobileNumber = null;
        _this.email = null;
        return _this;
    }
    Object.defineProperty(Member.prototype, "fullName", {
        get: function () {
            return "" + this.firstName + (this.middleName ? ' ' + this.middleName : '') + " " + this.lastName;
        },
        enumerable: true,
        configurable: true
    });
    return Member;
}(BusinessEntity_1.BusinessEntity));
exports.Member = Member;
