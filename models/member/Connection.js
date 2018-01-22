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
var Connection = /** @class */ (function (_super) {
    __extends(Connection, _super);
    function Connection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.memberId = null;
        _this.type = null;
        _this.category = null;
        _this.status = null;
        return _this;
    }
    return Connection;
}(BusinessEntity_1.BusinessEntity));
exports.Connection = Connection;
