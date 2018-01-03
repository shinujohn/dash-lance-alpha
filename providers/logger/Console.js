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
var Logger_1 = require("../../models/common/Logger");
var ConsoleLogger = /** @class */ (function (_super) {
    __extends(ConsoleLogger, _super);
    function ConsoleLogger() {
        return _super.call(this) || this;
    }
    /**
     * Debug logs
     */
    ConsoleLogger.prototype.debug = function (message) {
        console.log(message);
    };
    /**
     * Debug logs
     */
    ConsoleLogger.prototype.info = function (message) {
        console.log(message);
    };
    /**
     * Error logs
     */
    ConsoleLogger.prototype.error = function (message) {
        console.error(message);
    };
    return ConsoleLogger;
}(Logger_1.Logger));
module.exports = ConsoleLogger;
