"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsvp_1 = require("rsvp");
var shortId = require("shortid");
var PrincipalType_1 = require("./../enums/common/PrincipalType");
var errorType_1 = require("./../enums/common/errorType");
var RuleEngine_1 = require("../utils/authorisation/RuleEngine");
var Resource_1 = require("../utils/authorisation/enums/Resource");
var Action_1 = require("../utils/authorisation/enums/Action");
var MemberService = /** @class */ (function () {
    /**
     *
     * @param locator
     * @param clientContext
     */
    function MemberService(locator, clientContext) {
        this.locator = null;
        this.clientContext = null;
        this.locator = locator;
        this.clientContext = clientContext;
    }
    /**
     * Gets the details of a member by ID
     */
    MemberService.prototype.get = function (memberId) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            if (memberId) {
                if (!_this.getRuleEngine(memberId).execute(Resource_1.Resource.member, Action_1.Action.viewFullProfile)) {
                    reject(new Error(errorType_1.ErrorType.unauthorised));
                    return;
                }
                _this.locator.database.findOne('Members', { id: memberId }).then(function (result) {
                    if (result && result.id) {
                        resolve(result);
                    }
                    else {
                        reject(new Error(errorType_1.ErrorType.notFount));
                    }
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject(new Error(errorType_1.ErrorType.invalidParameter));
            }
        });
    };
    /**
     * Gets the details of a member by the mobile number
     */
    MemberService.prototype.getByMobileNumber = function (mobileNumber) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            if (mobileNumber) {
                if (!_this.getRuleEngine(null, mobileNumber, null).execute(Resource_1.Resource.member, Action_1.Action.viewFullProfile)) {
                    reject(new Error(errorType_1.ErrorType.unauthorised));
                    return;
                }
                _this.locator.database.find('Members', { mobileNumber: mobileNumber }, null).then(function (results) {
                    if (results
                        && results.length
                        && results.length > 1) {
                        reject(new Error(errorType_1.ErrorType.duplicate));
                    }
                    if (results
                        && results.length
                        && results[0]
                        && results[0].id) {
                        resolve(results[0]);
                    }
                    else {
                        reject(new Error(errorType_1.ErrorType.notFount));
                    }
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject(new Error(errorType_1.ErrorType.invalidParameter));
            }
        });
    };
    /**
     * Gets the details of a member by email ID
     */
    MemberService.prototype.getByEmail = function (email) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            if (email) {
                if (!_this.getRuleEngine(null, null, email).execute(Resource_1.Resource.member, Action_1.Action.viewFullProfile)) {
                    reject(new Error(errorType_1.ErrorType.unauthorised));
                    return;
                }
                _this.locator.database.find('Members', { email: email }, null).then(function (results) {
                    if (results
                        && results.length
                        && results.length > 1) {
                        reject(new Error(errorType_1.ErrorType.duplicate));
                    }
                    if (results
                        && results.length
                        && results[0]
                        && results[0].id) {
                        resolve(results[0]);
                    }
                    else {
                        reject(new Error(errorType_1.ErrorType.notFount));
                    }
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject(new Error(errorType_1.ErrorType.invalidParameter));
            }
        });
    };
    /**
     * Creates a new the member data in the database
     * @param member
     */
    MemberService.prototype.create = function (member) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            if (!member.mobileNumber || !member.email) {
                reject(new Error(errorType_1.ErrorType.invalidData));
                return;
            }
            if (!_this.getRuleEngine(null, member.mobileNumber, member.email).execute(Resource_1.Resource.member, Action_1.Action.viewFullProfile)) {
                reject(new Error(errorType_1.ErrorType.unauthorised));
                return;
            }
            _this.locator.database.find('Members', {
                $or: [
                    { mobileNumber: member.mobileNumber },
                    { email: member.email }
                ]
            }, null).then(function (members) {
                if (members && members.length) {
                    reject(new Error(errorType_1.ErrorType.duplicate));
                }
                else {
                    member.id = shortId.generate();
                    member = _this.setBaseProperties(member);
                    _this.locator.database.insert('Members', member).then(function () {
                        resolve(member);
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    /**
     * Updates the member data in to the database
     * @param member
     */
    MemberService.prototype.update = function (member) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            member = _this.setBaseProperties(member);
            if (!_this.getRuleEngine(member.id).execute(Resource_1.Resource.member, Action_1.Action.updateProfile)) {
                reject(new Error(errorType_1.ErrorType.unauthorised));
                return;
            }
            var fieldsToUpdate = {
                firstName: member.firstName,
                middleName: member.middleName,
                lastName: member.lastName,
                fullName: member.fullName,
                owner: member.owner,
                audit: member.audit
            };
            _this.locator.database.update('Members', { id: member.id }, { "$set": fieldsToUpdate }).then(function (data) {
                if (!data) {
                    reject(new Error(errorType_1.ErrorType.notFount));
                }
                else {
                    resolve(true);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    MemberService.prototype.setBaseProperties = function (member) {
        member.audit = {
            timeStamp: new Date(),
            updatedBy: null
        };
        if (this.clientContext.id) {
            member.audit.updatedBy = {
                id: this.clientContext.id,
                type: this.clientContext.type
            };
        }
        member.owner = {
            id: member.id,
            type: PrincipalType_1.PrincipalType.user
        };
        return member;
    };
    MemberService.prototype.getRuleEngine = function (memberId, mobileNumber, email) {
        return new RuleEngine_1.RuleEngine({
            clientContext: this.clientContext,
            entityContext: {
                id: memberId,
                mobileNumber: mobileNumber,
                email: email,
                owner: {
                    id: memberId
                }
            }
        });
    };
    return MemberService;
}());
exports.MemberService = MemberService;
