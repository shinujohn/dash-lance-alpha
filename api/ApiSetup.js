"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorType_1 = require("./../enums/common/errorType");
var ApiSetup = /** @class */ (function () {
    function ApiSetup() {
    }
    ApiSetup.GetContextRoot = function () {
        return "/api" + (this.version ? "/" + this.version : "");
    };
    ApiSetup.init = function (router) {
        console.log('Base class api init');
    };
    ApiSetup.getErrorCode = function (error) {
        switch (error.message) {
            case errorType_1.ErrorType.notFount:
                return 404;
            case errorType_1.ErrorType.invalidParameter:
                return 400;
            case errorType_1.ErrorType.unauthorised:
                return 401;
            case errorType_1.ErrorType.duplicate:
                return 409;
            case errorType_1.ErrorType.invalidData:
                return 400;
        }
        return 500;
    };
    ;
    ApiSetup.version = null;
    return ApiSetup;
}());
exports.ApiSetup = ApiSetup;
