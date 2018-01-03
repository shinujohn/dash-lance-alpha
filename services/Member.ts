import { Promise } from "rsvp";
import * as  shortId from "shortid";
import { Member } from "./../models/member/Member";
import { ClientContext } from "./../models/common/ClientContext";
import { Locator } from "./../models/common/Locator";
import { PrincipalType } from "./../enums/common/PrincipalType";
import { ErrorType } from "./../enums/common/errorType";
import { RuleEngine } from "../utils/authorisation/RuleEngine";
import { Resource } from "../utils/authorisation/enums/Resource";
import { Action } from "../utils/authorisation/enums/Action";

export class MemberService {

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
    get(memberId: string): Promise<Member> {
        return new Promise<Member>((resolve, reject) => {

            if (memberId) {

                if (!this.getRuleEngine(memberId).execute(Resource.member, Action.viewFullProfile)) {
                    reject(new Error(ErrorType.unauthorised));
                    return;
                }

                this.locator.database.findOne('Members', { id: memberId }).then((result: any) => {
                    if (result && result.id) {
                        resolve(result);
                    } else {
                        reject(new Error(ErrorType.notFount));
                    }
                }).catch((error: Error) => {
                    reject(error);
                });
            } else {
                reject(new Error(ErrorType.invalidParameter));
            }
        });
    }

    /**
     * Gets the details of a member by the mobile number
     */
    getByMobileNumber(mobileNumber: string): Promise<Member> {
        return new Promise<Member>((resolve, reject) => {

            if (mobileNumber) {

                if (!this.getRuleEngine(null, mobileNumber, null).execute(Resource.member, Action.viewFullProfile)) {
                    reject(new Error(ErrorType.unauthorised));
                    return;
                }

                this.locator.database.find('Members', { mobileNumber: mobileNumber }, null).then((results: any) => {

                    if (results
                        && results.length
                        && results.length > 1) {
                        reject(new Error(ErrorType.duplicate));
                    }
                    if (results
                        && results.length
                        && results[0]
                        && results[0].id) {
                        resolve(results[0]);
                    } else {
                        reject(new Error(ErrorType.notFount));
                    }
                }).catch((error: Error) => {
                    reject(error);
                });
            } else {
                reject(new Error(ErrorType.invalidParameter));
            }
        });
    }

    /**
     * Gets the details of a member by email ID
     */
    getByEmail(email: string): Promise<Member> {
        return new Promise<Member>((resolve, reject) => {

            if (email) {

                if (!this.getRuleEngine(null, null, email).execute(Resource.member, Action.viewFullProfile)) {
                    reject(new Error(ErrorType.unauthorised));
                    return;
                }

                this.locator.database.find('Members', { email: email }, null).then((results: any) => {
                    
                    if (results
                        && results.length
                        && results.length > 1) {
                        reject(new Error(ErrorType.duplicate));
                    }
                    if (results
                        && results.length
                        && results[0]
                        && results[0].id) {
                        resolve(results[0]);
                    } else {
                        reject(new Error(ErrorType.notFount));
                    }
                }).catch((error: Error) => {
                    reject(error);
                });
            } else {
                reject(new Error(ErrorType.invalidParameter));
            }
        });
    }

    /**
     * Creates a new the member data in the database
     * @param member 
     */
    create(member: Member): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {

            if (!member.mobileNumber || !member.email) {
                reject(new Error(ErrorType.invalidData));
                return;
            }

            if (!this.getRuleEngine(null, member.mobileNumber, member.email).execute(Resource.member, Action.viewFullProfile)) {
                reject(new Error(ErrorType.unauthorised));
                return;
            }

            this.locator.database.find('Members', {
                $or: [
                    { mobileNumber: member.mobileNumber },
                    { email: member.email }
                ]
            }, null).then((members: Member[]) => {
                if (members && members.length) {
                    reject(new Error(ErrorType.duplicate));
                } else {
                    member.id = shortId.generate();
                    member = this.setBaseProperties(member);

                    this.locator.database.insert('Members', member).then(() => {
                        resolve(member);
                    }).catch((error: Error) => {
                        reject(error);
                    });
                }
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }


    /**
     * Updates the member data in to the database
     * @param member 
     */
    update(member: Member): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {

            member = this.setBaseProperties(member);

            if (!this.getRuleEngine(member.id).execute(Resource.member, Action.updateProfile)) {
                reject(new Error(ErrorType.unauthorised));
                return;
            }

            let fieldsToUpdate = {
                firstName: member.firstName,
                middleName: member.middleName,
                lastName: member.lastName,
                fullName: member.fullName,
                owner: member.owner,
                audit: member.audit
            }

            this.locator.database.update('Members', { id: member.id }, { "$set": fieldsToUpdate }).then((data: any) => {

                if (!data) {
                    reject(new Error(ErrorType.notFount));
                } else {
                    resolve(true);
                }
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    private setBaseProperties(member: Member): Member {

        member.audit = {
            timeStamp: new Date(),
            updatedBy: null
        }

        if (this.clientContext.id) {
            member.audit.updatedBy = {
                id: this.clientContext.id,
                type: this.clientContext.type
            }
        }

        member.owner = {
            id: member.id,
            type: PrincipalType.user
        }

        return member;
    }

    private getRuleEngine(memberId?: string, mobileNumber?: string, email?: string) {
        return new RuleEngine({
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
    }
}
