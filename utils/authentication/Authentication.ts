import { Promise } from "rsvp";
import * as  shortId from "shortid";
import * as nconf from "nconf";
import * as  jsonwebtoken from "jsonwebtoken";

import { Member } from "./../../models/member/Member";
import { ClientContext } from "./../../models/common/ClientContext";
import { Locator } from "./../../models/common/Locator";
import { PrincipalType } from "./../../enums/common/PrincipalType";
import { ErrorType } from "./../../enums/common/errorType";
import { MemberService } from "./../../services/Member";

export class AuthenticationService {

    locator: Locator = null;
    clientContext: ClientContext = null;

    /**
     * 
     * @param locator 
     * @param clientContext 
     */
    constructor(locator: Locator, clientContext: ClientContext) {
        this.locator = locator;
        this.clientContext = clientContext;
    }

    /**
     * Gets the details of a member by ID
     */
    validatePassword(password: string): Promise<Object> {

        return new Promise<Object>((resolve, reject) => {

            // Just for fun :)
            if (password === 'shinujohn') {

                let memberService: MemberService = new MemberService(this.locator, this.clientContext);

                memberService.getByEmail(this.clientContext.email).then((member) => {
                    return this.generateJWT(member);
                }).then((jwt) => {
                    resolve({
                        isValid: true,
                        isMember: true,
                        jwt: jwt
                    });
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve({
                    isValid: false
                });
            }
        });
    }

    /**
     * Gets the details of a member by ID
     */
    generateOTP(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            // TODO: send otp to mobile number
            resolve(true);
        });
    }

    /**
    * Gets the details of a member by ID
    */
    validateOTP(otp: string): Promise<Object> {

        return new Promise<Object>((resolve, reject) => {

            // This is fun :)
            if (otp === "9095") {

                let memberService: MemberService = new MemberService(this.locator, this.clientContext);
                memberService.getByMobileNumber(this.clientContext.mobileNumber).then((member) => {

                    if (member) {
                        this.generateJWT(member).then((jwt) => {
                            resolve({
                                isValid: true,
                                isMember: true,
                                jwt: jwt
                            });
                        });
                    } else {
                        reject(new Error(ErrorType.notFount));
                    }
                }).catch((err) => {

                    if (err.message === ErrorType.notFount) {

                        let member = new Member();
                        member.mobileNumber = this.clientContext.mobileNumber;

                        this.generateTemporaryJWT(member).then((jwt) => {
                            resolve({
                                isValid: true,
                                isMember: false,
                                jwt: jwt
                            });
                        });
                    } else {
                        reject(err);
                    }
                });
            } else {
                resolve({
                    isValid: false
                });
            }
        });
    }

    /**
    * Gets the details of a member by ID
    */
    getPermenentJWT(): Promise<Object> {

        return new Promise<Object>((resolve, reject) => {

            let mobileNumber = this.clientContext.mobileNumber;
            let email = this.clientContext.email;

            let memberService: MemberService = new MemberService(this.locator, this.clientContext);
            let promise = null;

            if (mobileNumber) {
                promise = memberService.getByMobileNumber(this.clientContext.mobileNumber);
            } else if (email) {
                promise = memberService.getByEmail(this.clientContext.email);
            } else {
                reject(new Error(ErrorType.unauthorised));
                return;
            }
            
            promise.then((member) => {

                if (member) {
                    this.generateJWT(member).then((jwt) => {
                        resolve({
                            isValid: true,
                            isMember: true,
                            jwt: jwt
                        });
                    });
                } else {
                    reject(new Error(ErrorType.notFount));
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private generateJWT(member: Member) {
        return new Promise<string>((resolve, reject) => {
            if (member && member.id) {
                let userData = {
                    principal: {
                        type: PrincipalType.user,
                        id: member.id,
                        name: member.fullName,
                        roles: ["member"]
                    }
                };

                jsonwebtoken.sign(userData, nconf.get('config').jwtSecret, (err: Error, signedJWT: string) => {
                    if (!err) {
                        resolve(signedJWT);
                    } else {
                        reject(err);
                    }
                });
            } else {
                reject(new Error("Member record not found"));
            }
        });
    }

    private generateTemporaryJWT(member: Member) {
        return new Promise<string>((resolve, reject) => {
            let userData = {
                principal: {
                    type: PrincipalType.user,
                    id: member.id,
                    name: member.fullName,
                    mobileNumber: member.mobileNumber,
                    email: member.email,
                    roles: ["temporaryAccess"]
                }
            };

            jsonwebtoken.sign(userData, nconf.get('config').jwtSecret, (err: Error, signedJWT: string) => {
                if (!err) {
                    resolve(signedJWT);
                } else {
                    reject(err);
                }
            });
        });
    }
}
