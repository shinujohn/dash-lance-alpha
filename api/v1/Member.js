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
var Member_1 = require("./../../services/Member");
var ApiSetup_1 = require("./../ApiSetup");
var Member_2 = require("./../../models/member/Member");
var Serializer_1 = require("serializer.ts/Serializer");
var MemberApiSetup = /** @class */ (function (_super) {
    __extends(MemberApiSetup, _super);
    function MemberApiSetup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MemberApiSetup.init = function (router) {
        var _this = this;
        _super.init.call(this, router);
        router.get(this.GetContextRoot() + "/members/:memberId", function (req, res) {
            var locator = global.locator;
            var clientContext = req.clientContext;
            var memberService = new Member_1.MemberService(locator, clientContext);
            memberService.get(req.params.memberId).then(function (member) {
                res.send(member);
            }).catch(function (err) {
                res.sendStatus(_this.getErrorCode(err));
            });
        });
        router.get(this.GetContextRoot() + "/members", function (req, res) {
            var locator = global.locator;
            var clientContext = req.clientContext;
            // Get a member by additional parameters
            // Only two parameters supported now - email or phonenumber
            var email = req.query.email;
            var mobileNumber = req.query.mobileNumber;
            var memberService = new Member_1.MemberService(locator, clientContext);
            var promise = null;
            if (mobileNumber) {
                promise = memberService.getByMobileNumber(mobileNumber);
            }
            else if (email) {
                promise = memberService.getByEmail(email);
            }
            else {
                // Getting all members not supported (yet?)
                res.sendStatus(400);
                return;
            }
            promise.then(function (member) {
                res.send(member);
            }).catch(function (err) {
                res.sendStatus(_this.getErrorCode(err));
            });
        });
        router.post(this.GetContextRoot() + "/members", function (req, res) {
            var locator = global.locator;
            var clientContext = req.clientContext;
            var memberService = new Member_1.MemberService(locator, clientContext);
            var member = Serializer_1.deserialize(Member_2.Member, req.body);
            memberService.create(member).then(function (result) {
                res.send(result);
            }).catch(function (err) {
                res.sendStatus(_this.getErrorCode(err));
            });
        });
        router.put(this.GetContextRoot() + "/members/:memberId", function (req, res) {
            var locator = global.locator;
            var clientContext = req.clientContext;
            var memberService = new Member_1.MemberService(locator, clientContext);
            var member = Serializer_1.deserialize(Member_2.Member, req.body);
            memberService.update(member).then(function (result) {
                res.send(result);
            }).catch(function (err) {
                res.sendStatus(_this.getErrorCode(err));
            });
        });
    };
    ;
    MemberApiSetup.version = "v1";
    return MemberApiSetup;
}(ApiSetup_1.ApiSetup));
exports.MemberApiSetup = MemberApiSetup;
