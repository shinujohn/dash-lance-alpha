
import * as express from "express";
import { Promise } from "rsvp";

import { MemberService } from "./../../services/Member";
import { Locator } from "./../../models/common/Locator";
import { ClientContext } from "./../../models/common/ClientContext";
import { ApiSetup } from "./../ApiSetup";
import { Member } from "./../../models/member/Member";
import { deserialize } from "serializer.ts/Serializer";

export class MemberApiSetup extends ApiSetup {

    static version = "v1";

    static init(router: express.Router) {

        super.init(router);

        router.get(`${this.GetContextRoot()}/members/:memberId`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;

            let memberService: MemberService = new MemberService(locator, clientContext);
            memberService.get(req.params.memberId).then((member) => {
                res.send(member);
            }).catch((err) => {
                res.sendStatus(this.getErrorCode(err));
            });
        });

        router.get(`${this.GetContextRoot()}/members`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;

            // Get a member by additional parameters
            // Only two parameters supported now - email or phonenumber
            let email = req.query.parameters.email;
            let mobileNumber = req.query.parameters.mobileNumber;

            let memberService: MemberService = new MemberService(locator, clientContext);
            let promise = null;

            if (mobileNumber) {
                promise = memberService.getByMobileNumber(mobileNumber);
            } else if (email) {
                promise = memberService.getByEmail(email);
            } else {

                // Getting all members not supported (yet?)
                res.sendStatus(400);
                return;
            }

            promise.then((member: Member) => {
                res.send(member);
            }).catch((err: Error) => {
                res.sendStatus(this.getErrorCode(err));
            });

        });

        router.post(`${this.GetContextRoot()}/members`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;
            let memberService: MemberService = new MemberService(locator, clientContext);

            let member: Member = deserialize<Member>(Member, req.body);

            memberService.create(member).then((result) => {
                res.send(result);
            }).catch((err) => {
                res.sendStatus(this.getErrorCode(err));
            });
        });

        router.put(`${this.GetContextRoot()}/members/:memberId`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;
            let memberService: MemberService = new MemberService(locator, clientContext);

            let member: Member = deserialize<Member>(Member, req.body);

            memberService.update(member).then((result) => {
                res.send(result);
            }).catch((err) => {
                res.sendStatus(this.getErrorCode(err));
            });
        });
    };
}

