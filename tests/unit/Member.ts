import * as chai from "chai";
import * as sinon from "sinon";
import * as chaiAsPromised from "chai-as-promised";
import * as shortId from "shortid";
import { Promise } from "rsvp";
import * as _ from "lodash";


import { MemberService } from "./../../services/Member";
import { Locator } from "./../../models/common/Locator";
import { ClientContext } from "./../../models/common/ClientContext";
import { Member } from "./../../models/member/Member";
import { PrincipalType } from "./../../enums/common/PrincipalType";

chai.use(chaiAsPromised);
let assert = chai.assert;

describe('Member Service', () => {
    var clientContext = {
        type: PrincipalType.user,
        id: "Member1",
        name: "Unit test Member",
        roles: ["member"],
        mobileNumber: "",
        email: ""
    };

    var locator: Locator = {
        database: {
            insert: () => { return new Promise((r) => { r(); }) },
            find: () => { return new Promise((r) => { r(); }) },
            findOne: () => { return new Promise((r) => { r(); }) },
            aggregate: () => { return new Promise((r) => { r(); }) },
            update: () => { return new Promise((r) => { r(); }) },
            reset: () => { return new Promise((r) => { r(); }) },
            dropCollection: () => { return new Promise((r) => { r(); }) },
            ping: () => { return new Promise((r) => { r(); }) },
            getCollection: () => { return new Promise((r) => { r(); }) }
        },
        logger: {
            debug: () => { },
            info: () => { },
            error: () => { }
        },
        config: {
        }
    };

    describe('get()', () => {

        it('should retrieve the Member by ID', () => {

            var expectedCollectionName = 'Members';
            var expectedQuery = { "id": "Member1" };

            var database = sinon.mock(locator.database);
            database.expects('findOne')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new Promise((resolve, reject) => {
                    resolve({ id: "Member1" });
                }));

            let memberService = new MemberService(locator, clientContext);
            return memberService.get('Member1').then(function (result) {

                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });

        it('should throw error for invalid ID', () => {

            var expectedCollectionName = 'Members';
            var expectedQuery = { "id": "Member1" };

            var database = sinon.mock(locator.database);
            database.expects('findOne')
                .once()
                .withArgs(expectedCollectionName, expectedQuery)
                .returns(new Promise((resolve, reject) => {
                    resolve(null);
                }));

            let memberService = new MemberService(locator, clientContext);
            return assert.isRejected(memberService.get('Member1'), "NOT_FOUND").then(function () {
                database.restore();
            });
        });

        it('should throw error if no id specified', () => {

            let memberService = new MemberService(locator, clientContext);
            return assert.isRejected(memberService.get(null), "INVALID_PARAMETER");
        });

        it('should reject the request when accessing other users profile', () => {

            var database = sinon.mock(locator.database);
            database.expects('update')
                .never();

            var other_user_clientContext = {
                type: PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "",
                email: ""
            };

            let memberService = new MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.get("Member1"), "UNAUTHORIZED").then(() => {
                database.restore();
            });
        });

        it('should authorise the request for sysAdmin when accessing other users profile', () => {

            var other_user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve({ id: "Member1" });
                }));

            let memberService = new MemberService(locator, other_user_clientContext);
            return memberService.get('Member1').then(function (result) {

                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
    });

    describe('getByMobileNumber()', () => {

        it('should retrieve the Member by MobileNumber', () => {

            var user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve([{ id: "Member1" }]);
                }));

            let memberService = new MemberService(locator, user_clientContext);
            return memberService.getByMobileNumber("1234567890").then(function (result) {

                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });

        it('should throw error for invalid mobile number', () => {

             var user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve(null);
                }));

            let memberService = new MemberService(locator, user_clientContext);
            return assert.isRejected(memberService.getByMobileNumber("1234567890"), "NOT_FOUND").then(function () {
                database.restore();
            });
        });

        it('should throw error if no mobile number specified', () => {

            let memberService = new MemberService(locator, clientContext);
            return assert.isRejected(memberService.getByMobileNumber(null), "INVALID_PARAMETER");
        });

        it('should reject the request when accessing other users profile', () => {

            var database = sinon.mock(locator.database);

            var other_user_clientContext = {
                type: PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "0987654321",
                email: "member2@example.com"
            };

            let memberService = new MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.getByMobileNumber("1234567890"), "UNAUTHORIZED").then(() => {
                database.restore();
            });
        });

        it('should authorise the request for sysAdmin when accessing other users profile', () => {

            var other_user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve([{ id: "Member1" }]);
                }));

            let memberService = new MemberService(locator, other_user_clientContext);
            return memberService.getByMobileNumber("1234567890").then(function (result) {

                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
    });

     
    describe('getByEmail()', () => {

        it('should retrieve the Member by Email', () => {

            var user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve([{ id: "Member1" }]);
                }));

            let memberService = new MemberService(locator, user_clientContext);
            return memberService.getByEmail("member@example.com").then(function (result) {

                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });

        it('should throw error for invalid email ID', () => {

             var user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve(null);
                }));

            let memberService = new MemberService(locator, user_clientContext);
            return assert.isRejected(memberService.getByEmail("member@example.com"), "NOT_FOUND").then(function () {
                database.restore();
            });
        });

        it('should throw error if no email id specified', () => {

            let memberService = new MemberService(locator, clientContext);
            return assert.isRejected(memberService.getByMobileNumber(null), "INVALID_PARAMETER");
        });

        it('should reject the request when accessing other users profile', () => {

            var database = sinon.mock(locator.database);

            var other_user_clientContext = {
                type: PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "0987654321",
                email: "member2@example.com"
            };

            let memberService = new MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.getByEmail("member@example.com"), "UNAUTHORIZED").then(() => {
                database.restore();
            });
        });

        it('should authorise the request for sysAdmin when accessing other users profile', () => {

            var other_user_clientContext = {
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve([{ id: "Member1" }]);
                }));

            let memberService = new MemberService(locator, other_user_clientContext);
            return memberService.getByEmail("member@example.com").then(function (result) {

                assert.isOk(result && result.id === 'Member1', 'Invalid db result');
                database.verify();
                database.restore();
            });
        });
    }); 

    describe('create()', () => {

        it('should create the Member', () => {

            var temp_user_clientContext = <any>{
                type: PrincipalType.user,
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
            }

            var database = sinon.mock(locator.database);
            database.expects('insert')
                .once()
                .withArgs(expectedCollectionName, expectedData)
                .returns(new Promise((resolve, reject) => {
                    resolve({});
                }));

            database.expects('find')
                .once()
                .withArgs(expectedCollectionName, expectedFindQuery, null)
                .returns(new Promise((resolve, reject) => {
                    resolve([]);
                }));

            let member: Member = new Member();

            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";

            let memberService = new MemberService(locator, temp_user_clientContext);
            return memberService.create(member).then(function (result: any) {

                assert.isOk(result.id && result.id.length > 0);
                assert.isOk(result, 'Invalid db result');
                database.verify();
                database.restore();
            });
        });

        it('should create the base class information in Member', () => {

            var temp_user_clientContext = <any>{
                type: PrincipalType.user,
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
                    type: PrincipalType.user
                },
                audit: {
                    timeStamp: sinon.match.date,
                    updatedBy: <any>null
                }
            }

            var database = sinon.mock(locator.database);
            database.expects('insert')
                .once()
                .withArgs(expectedCollectionName, expectedData)
                .returns(new Promise((resolve, reject) => {
                    resolve({});
                }));

            let member: Member = new Member();

            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";

            let memberService = new MemberService(locator, temp_user_clientContext);
            return memberService.create(member).then(function (result: any) {

                database.verify();
                database.restore();
            });
        });

        it('should set the Member owner information to self', () => {

            var temp_user_clientContext = <any>{
                type: PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member@example.com"
            };

            var database = sinon.mock(locator.database);
            database.expects('insert')
                .once()
                .returns(new Promise((resolve, reject) => {
                    resolve({});
                }));

            let member: Member = new Member();

            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";

            let memberService = new MemberService(locator, temp_user_clientContext);
            return memberService.create(member).then(function (result: any) {

                assert.isOk(result.id === result.owner.id, "Owner information is not set correctly");
                database.restore();
            });
        });

        it('should not create the Member when not authorised by mobile number', () => {

            var temp_user_clientContext = <any>{
                type: PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "0987654321",
                email: "member@example.com"
            };

            let member: Member = new Member();

            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";

            let memberService = new MemberService(locator, temp_user_clientContext);

            return assert.isRejected(memberService.create(member), "UNAUTHORIZED");
        });

        it('should not create the Member when not authorised by email', () => {

            var temp_user_clientContext = <any>{
                type: PrincipalType.user,
                name: "Unit test Member",
                roles: ["temporaryAccess"],
                mobileNumber: "1234567890",
                email: "member2@example.com"
            };

            let member: Member = new Member();

            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";

            let memberService = new MemberService(locator, temp_user_clientContext);

            return assert.isRejected(memberService.create(member), "UNAUTHORIZED");
        });

        it('should not create if duplicate member found', () => {

            var temp_user_clientContext = <any>{
                type: PrincipalType.user,
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
                .returns(new Promise((resolve, reject) => {
                    resolve([{}]);
                }));

            let member: Member = new Member();

            member.firstName = "Member";
            member.middleName = "";
            member.lastName = "One";
            member.mobileNumber = "1234567890";
            member.email = "member@example.com";

            let memberService = new MemberService(locator, temp_user_clientContext);
            return assert.isRejected(memberService.create(member), "DUPLICATE");
        });
    });

    describe('update()', () => {


        it('should update the Member', () => {

            var expectedCollectionName = 'Members';
            var expectedQuery = { id: "Member1" };
            var expectedData = {
                firstName: sinon.match.string,
                middleName: sinon.match.string,
                lastName: sinon.match.string,
                fullName: sinon.match.string,
                owner: sinon.match.object,
                audit: sinon.match.object
            }

            var database = sinon.mock(locator.database);
            database.expects('update')
                .once()
                .withArgs(expectedCollectionName, expectedQuery, { $set: expectedData })
                .returns(new Promise((resolve, reject) => {
                    resolve({});
                }));

            let member: Member = new Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";

            let memberService = new MemberService(locator, clientContext);
            return memberService.update(member).then(function (result: any) {

                assert.isOk(result, 'Invalid db result');
                database.verify();
                database.restore();
            });
        });

        it('should update the base class information in Member', () => {

            var expectedCollectionName = 'Members';
            var expectedQuery = { id: "Member1" };
            var expectedData = {
                firstName: sinon.match.string,
                middleName: sinon.match.string,
                lastName: sinon.match.string,
                fullName: sinon.match.string,
                owner: {
                    id: "Member1",
                    type: PrincipalType.user
                },
                audit: {
                    timeStamp: sinon.match.date,
                    updatedBy: {
                        id: "Member1",
                        type: clientContext.type
                    }
                }
            }

            var database = sinon.mock(locator.database);
            database.expects('update')
                .once()
                .withArgs(expectedCollectionName, expectedQuery, { $set: expectedData })
                .returns(new Promise((resolve, reject) => {
                    resolve({});
                }));

            let member: Member = new Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";

            let memberService = new MemberService(locator, clientContext);
            return memberService.update(member).then(function (result: any) {

                assert.isOk(result, 'Invalid db result');
                database.verify();
                database.restore();
            });
        });

        it('should throw error when an invalid ID is given', () => {

            var database = sinon.mock(locator.database);
            database.expects('update')
                .once()
                .returns(new Promise((resolve, reject) => {
                    resolve(null);
                }));

            let member: Member = new Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";

            let memberService = new MemberService(locator, clientContext);
            return assert.isRejected(memberService.update(member), "NOT_FOUND").then(function () {
                database.restore();
            });
        });

        it('should deny when try to update another member', () => {

            var database = sinon.mock(locator.database);
            database.expects('update')
                .never();

            var other_user_clientContext = {
                type: PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["member"],
                mobileNumber: "",
                email: ""
            };

            let member: Member = new Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";

            let memberService = new MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.update(member), "UNAUTHORIZED").then(() => {
                database.restore();
            });
        });

        it('should deny when try to update another member as sysadmin', () => {

            var database = sinon.mock(locator.database);
            database.expects('update')
                .never();

            var other_user_clientContext = {
                type: PrincipalType.user,
                id: "Member2",
                name: "Unit test Member",
                roles: ["sysadmin"],
                mobileNumber: "",
                email: ""
            };

            let member: Member = new Member();
            member.id = "Member1";
            member.firstName = "test";
            member.middleName = "user";
            member.lastName = "account";

            let memberService = new MemberService(locator, other_user_clientContext);
            return assert.isRejected(memberService.update(member), "UNAUTHORIZED").then(() => {
                database.restore();
            });
        });

    });
});