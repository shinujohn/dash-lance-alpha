"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsvp_1 = require("rsvp");
var nconf = require("nconf");
var jsonwebtoken = require("jsonwebtoken");
var Member_1 = require("./../../models/member/Member");
var PrincipalType_1 = require("./../../enums/common/PrincipalType");
var errorType_1 = require("./../../enums/common/errorType");
var Member_2 = require("./../../services/Member");
var AuthenticationService = /** @class */ (function () {
    /**
     *
     * @param locator
     * @param clientContext
     */
    function AuthenticationService(locator, clientContext) {
        this.locator = null;
        this.clientContext = null;
        this.locator = locator;
        this.clientContext = clientContext;
    }
    /**
     * Gets the details of a member by ID
     */
    AuthenticationService.prototype.validatePassword = function (password) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            // Just for fun :)
            if (password === 'shinujohn') {
                var memberService = new Member_2.MemberService(_this.locator, _this.clientContext);
                memberService.getByEmail(_this.clientContext.email).then(function (member) {
                    return _this.generateJWT(member);
                }).then(function (jwt) {
                    resolve({
                        isValid: true,
                        isMember: true,
                        jwt: jwt
                    });
                }).catch(function (err) {
                    reject(err);
                });
            }
            else {
                resolve({
                    isValid: false
                });
            }
        });
    };
    /**
     * Gets the details of a member by ID
     */
    AuthenticationService.prototype.generateOTP = function () {
        return new rsvp_1.Promise(function (resolve, reject) {
            // TODO: send otp to mobile number
            resolve(true);
        });
    };
    /**
    * Gets the details of a member by ID
    */
    AuthenticationService.prototype.validateOTP = function (otp) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            // This is fun :)
            if (otp === "9095") {
                var memberService = new Member_2.MemberService(_this.locator, _this.clientContext);
                memberService.getByMobileNumber(_this.clientContext.mobileNumber).then(function (member) {
                    if (member) {
                        _this.generateJWT(member).then(function (jwt) {
                            resolve({
                                isValid: true,
                                isMember: true,
                                jwt: jwt
                            });
                        });
                    }
                    else {
                        reject(new Error(errorType_1.ErrorType.notFount));
                    }
                }).catch(function (err) {
                    if (err.message === errorType_1.ErrorType.notFount) {
                        var member = new Member_1.Member();
                        member.mobileNumber = _this.clientContext.mobileNumber;
                        _this.generateTemporaryJWT(member).then(function (jwt) {
                            resolve({
                                isValid: true,
                                isMember: false,
                                jwt: jwt
                            });
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                resolve({
                    isValid: false
                });
            }
        });
    };
    /**
    * Gets the details of a member by ID
    */
    AuthenticationService.prototype.getPermenentJWT = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var mobileNumber = _this.clientContext.mobileNumber;
            var email = _this.clientContext.email;
            var memberService = new Member_2.MemberService(_this.locator, _this.clientContext);
            var promise = null;
            if (mobileNumber) {
                promise = memberService.getByMobileNumber(_this.clientContext.mobileNumber);
            }
            else if (email) {
                promise = memberService.getByEmail(_this.clientContext.email);
            }
            else {
                reject(new Error(errorType_1.ErrorType.unauthorised));
                return;
            }
            promise.then(function (member) {
                if (member) {
                    _this.generateJWT(member).then(function (jwt) {
                        resolve({
                            isValid: true,
                            isMember: true,
                            jwt: jwt
                        });
                    });
                }
                else {
                    reject(new Error(errorType_1.ErrorType.notFount));
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    AuthenticationService.prototype.generateJWT = function (member) {
        return new rsvp_1.Promise(function (resolve, reject) {
            if (member && member.id) {
                var userData = {
                    principal: {
                        type: PrincipalType_1.PrincipalType.user,
                        id: member.id,
                        name: member.fullName,
                        roles: ["member"]
                    }
                };
                jsonwebtoken.sign(userData, nconf.get('config').jwtSecret, function (err, signedJWT) {
                    if (!err) {
                        resolve(signedJWT);
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                reject(new Error("Member record not found"));
            }
        });
    };
    AuthenticationService.prototype.generateTemporaryJWT = function (member) {
        return new rsvp_1.Promise(function (resolve, reject) {
            var userData = {
                principal: {
                    type: PrincipalType_1.PrincipalType.user,
                    id: member.id,
                    name: member.fullName,
                    mobileNumber: member.mobileNumber,
                    email: member.email,
                    roles: ["temporaryAccess"]
                }
            };
            jsonwebtoken.sign(userData, nconf.get('config').jwtSecret, function (err, signedJWT) {
                if (!err) {
                    resolve(signedJWT);
                }
                else {
                    reject(err);
                }
            });
        });
    };
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
