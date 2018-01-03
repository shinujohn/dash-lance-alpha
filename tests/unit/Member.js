"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var sinon = require("sinon");
var chaiAsPromised = require("chai-as-promised");
var rsvp_1 = require("rsvp");
var Member_1 = require("./../../services/Member");
var Member_2 = require("./../../models/member/Member");
var PrincipalType_1 = require("./../../enums/common/PrincipalType");
chai.use(chaiAsPromised);
var assert = chai.assert;
describe('Member Service', function () {
    var clientContext = {
        type: PrincipalType_1.PrincipalType.user,
        id: "Member1",
        name: "Unit test Member",
        roles: ["member"],
        mobileNumber: "",
        email: ""
    };
    var locator = {
        database: {
            insert: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            find: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            findOne: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            aggregate: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            update: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            reset: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            dropCollection: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            ping: function () { return new rsvp_1.Promise(function (r) { r(); }); },
            getCollection: function () { return new rsvp_1.Promise(function (r) { r(); }); }
        },
        logger: {
            debug: function () { },
            info: function () { },
            error: function () { }
        },
        config: {}
    };
    describe('get()', function () {
        it('should retrieve the Member by ID', function () {
            var expectedCollectionName = 'Members';
            var expectedQuery = { "id": "Member1" };
            var database = sinon.mock(locator.database);
            database.expects('findOne')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({ id: "Member1" });
            }));
            var memberService = new Member_1.MemberService(locator, clientContext);
            return memberService.get('Member1').then(function (result) {
                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
        it('should throw error for invalid ID', function () {
            var expectedCollectionName = 'Members';
            var expectedQuery = { "id": "Member1" };
            var database = sinon.mock(locator.database);
            database.expects('findOne')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve(null);
            }));
            var memberService = new Member_1.MemberService(locator, clientContext);
            return assert.isRejected(memberService.get('Member1'), "NOT_FOUND").then(function () {
                database.restore();
            });
        });
        it('should throw error if no id specified', function () {
            var memberService = new Member_1.MemberService(locator, clientContext);
            return assert.isRejected(memberService.get(null), "INVALID_PARAMETER");
        });
        it('should reject the request when accessing other users profile', function () {
            var database = sinon.mock(locator.database);
            database.expects('update')
                .never();
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "",
                email: ""
            };
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.get("Member1"), "UNAUTHORIZED").then(function () {
                database.restore();
            });
        });
        it('should authorise the request for sysAdmin when accessing other users profile', function () {
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["sysadmin"],
                mobileNumber: "",
                email: ""
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "id": "Member1" };
            var database = sinon.mock(locator.database);
            database.expects('findOne')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({ id: "Member1" });
            }));
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return memberService.get('Member1').then(function (result) {
                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
    });
    describe('getByMobileNumber()', function () {
        it('should retrieve the Member by MobileNumber', function () {
            var user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member1",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "mobileNumber": "1234567890" };
            var database = sinon.mock(locator.database);
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve([{ id: "Member1" }]);
            }));
            var memberService = new Member_1.MemberService(locator, user_clientContext);
            return memberService.getByMobileNumber("1234567890").then(function (result) {
                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
        it('should throw error for invalid mobile number', function () {
            var user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member1",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "mobileNumber": "1234567890" };
            var database = sinon.mock(locator.database);
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve(null);
            }));
            var memberService = new Member_1.MemberService(locator, user_clientContext);
            return assert.isRejected(memberService.getByMobileNumber("1234567890"), "NOT_FOUND").then(function () {
                database.restore();
            });
        });
        it('should throw error if no mobile number specified', function () {
            var memberService = new Member_1.MemberService(locator, clientContext);
            return assert.isRejected(memberService.getByMobileNumber(null), "INVALID_PARAMETER");
        });
        it('should reject the request when accessing other users profile', function () {
            var database = sinon.mock(locator.database);
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "0987654321",
                email: "member2@example.com"
            };
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.getByMobileNumber("1234567890"), "UNAUTHORIZED").then(function () {
                database.restore();
            });
        });
        it('should authorise the request for sysAdmin when accessing other users profile', function () {
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["sysadmin"],
                mobileNumber: "0987654321",
                email: "member2@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "mobileNumber": "1234567890" };
            var database = sinon.mock(locator.database);
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve([{ id: "Member1" }]);
            }));
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return memberService.getByMobileNumber("1234567890").then(function (result) {
                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
    });
    describe('getByEmail()', function () {
        it('should retrieve the Member by Email', function () {
            var user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member1",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "email": "member@example.com" };
            var database = sinon.mock(locator.database);
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve([{ id: "Member1" }]);
            }));
            var memberService = new Member_1.MemberService(locator, user_clientContext);
            return memberService.getByEmail("member@example.com").then(function (result) {
                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
        it('should throw error for invalid email ID', function () {
            var user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member1",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "email": "member@example.com" };
            var database = sinon.mock(locator.database);
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve(null);
            }));
            var memberService = new Member_1.MemberService(locator, user_clientContext);
            return assert.isRejected(memberService.getByEmail("member@example.com"), "NOT_FOUND").then(function () {
                database.restore();
            });
        });
        it('should throw error if no email id specified', function () {
            var memberService = new Member_1.MemberService(locator, clientContext);
            return assert.isRejected(memberService.getByMobileNumber(null), "INVALID_PARAMETER");
        });
        it('should reject the request when accessing other users profile', function () {
            var database = sinon.mock(locator.database);
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "0987654321",
                email: "member2@example.com"
            };
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.getByEmail("member@example.com"), "UNAUTHORIZED").then(function () {
                database.restore();
            });
        });
        it('should authorise the request for sysAdmin when accessing other users profile', function () {
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["sysadmin"],
                mobileNumber: "0987654321",
                email: "member2@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedQuery = { "email": "member@example.com" };
            var database = sinon.mock(locator.database);
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve([{ id: "Member1" }]);
            }));
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return memberService.getByEmail("member@example.com").then(function (result) {
                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
    });
    describe('create()', function () {
        it('should create the Member', function () {
            var temp_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedFindQuery = {
                $or: [
                    { mobileNumber: "1234567890" },
                    { email: "member@example.com" }
                ]
            };
            var expectedData = {
                id: sinon.match.string,
                firstName: sinon.match.string,
                middleName: sinon.match.string,
                lastName: sinon.match.string,
                mobileNumber: sinon.match.string,
                email: sinon.match.string,
                owner: sinon.match.object,
                audit: sinon.match.object
            };
            var database = sinon.mock(locator.database);
            database.expects('insert')
                .once()
                .withArgs(expectedCollectionName, expectedData)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({});
            }));
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedFindQuery, null)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve([]);
            }));
            var member = new Member_2.Member();
            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";
            var memberService = new Member_1.MemberService(locator, temp_user_clientContext);
            return memberService.create(member).then(function (result) {
                assert.isOk(result.id && result.id.length > 0);
                assert.isOk(result, 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
        it('should create the base class information in Member', function () {
            var temp_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedData = {
                id: sinon.match.string,
                firstName: sinon.match.string,
                middleName: sinon.match.string,
                lastName: sinon.match.string,
                mobileNumber: sinon.match.string,
                email: sinon.match.string,
                owner: {
                    id: sinon.match.string,
                    type: PrincipalType_1.PrincipalType.user
                },
                audit: {
                    timeStamp: sinon.match.date,
                    updatedBy: null
                }
            };
            var database = sinon.mock(locator.database);
            database.expects('insert')
                .once()
                .withArgs(expectedCollectionName, expectedData)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({});
            }));
            var member = new Member_2.Member();
            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";
            var memberService = new Member_1.MemberService(locator, temp_user_clientContext);
            return memberService.create(member).then(function (result) {
                database.verify();
                database.restore();
            });
        });
        it('should set the Member owner information to self', function () {
            var temp_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var database = sinon.mock(locator.database);
            database.expects('insert')
                .once()
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({});
            }));
            var member = new Member_2.Member();
            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";
            var memberService = new Member_1.MemberService(locator, temp_user_clientContext);
            return memberService.create(member).then(function (result) {
                assert.isOk(result.id === result.owner.id, "Owner information is not set correctly");
                database.restore();
            });
        });
        it('should not create the Member when not authorised by mobile number', function () {
            var temp_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "0987654321",
                email: "member@example.com"
            };
            var member = new Member_2.Member();
            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";
            var memberService = new Member_1.MemberService(locator, temp_user_clientContext);
            return assert.isRejected(memberService.create(member), "UNAUTHORIZED");
        });
        it('should not create the Member when not authorised by email', function () {
            var temp_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member2@example.com"
            };
            var member = new Member_2.Member();
            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";
            var memberService = new Member_1.MemberService(locator, temp_user_clientContext);
            return assert.isRejected(memberService.create(member), "UNAUTHORIZED");
        });
        it('should not create if duplicate member found', function () {
            var temp_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };
            var expectedCollectionName = 'Members';
            var expectedFindQuery = {
                $or: [
                    { mobileNumber: "1234567890" },
                    { email: "member@example.com" }
                ]
            };
            var database = sinon.mock(locator.database);
            database.expects('insert')
                .never();
            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedFindQuery, null)
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve([{}]);
            }));
            var member = new Member_2.Member();
            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";
            var memberService = new Member_1.MemberService(locator, temp_user_clientContext);
            return assert.isRejected(memberService.create(member), "DUPLICATE");
        });
    });
    describe('update()', function () {
        it('should update the Member', function () {
            var expectedCollectionName = 'Members';
            var expectedQuery = { id: "Member1" };
            var expectedData = {
                firstName: sinon.match.string,
                middleName: sinon.match.string,
                lastName: sinon.match.string,
                fullName: sinon.match.string,
                owner: sinon.match.object,
                audit: sinon.match.object
            };
            var database = sinon.mock(locator.database);
            database.expects('update')
                .once()
                .withArgs(expectedCollectionName, expectedQuery, { $set: expectedData })
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({});
            }));
            var member = new Member_2.Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";
            var memberService = new Member_1.MemberService(locator, clientContext);
            return memberService.update(member).then(function (result) {
                assert.isOk(result, 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
        it('should update the base class information in Member', function () {
            var expectedCollectionName = 'Members';
            var expectedQuery = { id: "Member1" };
            var expectedData = {
                firstName: sinon.match.string,
                middleName: sinon.match.string,
                lastName: sinon.match.string,
                fullName: sinon.match.string,
                owner: {
                    id: "Member1",
                    type: PrincipalType_1.PrincipalType.user
                },
                audit: {
                    timeStamp: sinon.match.date,
                    updatedBy: {
                        id: "Member1",
                        type: clientContext.type
                    }
                }
            };
            var database = sinon.mock(locator.database);
            database.expects('update')
                .once()
                .withArgs(expectedCollectionName, expectedQuery, { $set: expectedData })
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve({});
            }));
            var member = new Member_2.Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";
            var memberService = new Member_1.MemberService(locator, clientContext);
            return memberService.update(member).then(function (result) {
                assert.isOk(result, 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
        it('should throw error when an invalid ID is given', function () {
            var database = sinon.mock(locator.database);
            database.expects('update')
                .once()
                .returns(new rsvp_1.Promise(function (resolve, reject) {
                resolve(null);
            }));
            var member = new Member_2.Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";
            var memberService = new Member_1.MemberService(locator, clientContext);
            return assert.isRejected(memberService.update(member), "NOT_FOUND").then(function () {
                database.restore();
            });
        });
        it('should deny when try to update another member', function () {
            var database = sinon.mock(locator.database);
            database.expects('update')
                .never();
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "",
                email: ""
            };
            var member = new Member_2.Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.update(member), "UNAUTHORIZED").then(function () {
                database.restore();
            });
        });
        it('should deny when try to update another member as sysadmin', function () {
            var database = sinon.mock(locator.database);
            database.expects('update')
                .never();
            var other_user_clientContext = {
                type: PrincipalType_1.PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["sysadmin"],
                mobileNumber: "",
                email: ""
            };
            var member = new Member_2.Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";
            var memberService = new Member_1.MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.update(member), "UNAUTHORIZED").then(function () {
                database.restore();
            });
        });
    });
});
