
import * as express from "express";
import { Promise } from "rsvp";

import { ConnectionService } from "./../../services/Connection";
import { Locator } from "./../../models/common/Locator";
import { ClientContext } from "./../../models/common/ClientContext";
import { ApiSetup } from "./../ApiSetup";
import { Member } from "./../../models/member/Member";
import { deserialize } from "serializer.ts/Serializer";

export class ConnectionApiSetup extends ApiSetup {

    static version = "v1";

    static init(router: express.Router) {

        super.init(router);

        router.get(`${this.GetContextRoot()}/members/:memberId/connections`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;

            let connectionService: ConnectionService = new ConnectionService(locator, clientContext);
            connectionService.getConnections(req.params.memberId).then((connections) => {
                res.send(connections);
            }).catch((err) => {
                res.sendStatus(this.getErrorCode(err));
            });
        });
    };
}

