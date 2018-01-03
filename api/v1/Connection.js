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
var Connection_1 = require("./../../services/Connection");
var ApiSetup_1 = require("./../ApiSetup");
var ConnectionApiSetup = /** @class */ (function (_super) {
    __extends(ConnectionApiSetup, _super);
    function ConnectionApiSetup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConnectionApiSetup.init = function (router) {
        var _this = this;
        _super.init.call(this, router);
        router.get(this.GetContextRoot() + "/members/:memberId/connections", function (req, res) {
            var locator = global.locator;
            var clientContext = req.clientContext;
            var connectionService = new Connection_1.ConnectionService(locator, clientContext);
            connectionService.getConnections(req.params.memberId).then(function (connections) {
                res.send(connections);
            }).catch(function (err) {
                res.sendStatus(_this.getErrorCode(err));
            });
        });
    };
    ;
    ConnectionApiSetup.version = "v1";
    return ConnectionApiSetup;
}(ApiSetup_1.ApiSetup));
exports.ConnectionApiSetup = ConnectionApiSetup;
