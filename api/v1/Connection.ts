
import * as express from "express";
import { Promise } from "rsvp";

import { ConnectionService } from "./../../services/Connection";
import { Locator } from "./../../models/common/Locator";
import { ClientContext } from "./../../models/common/ClientContext";
import { ApiSetup } from "./../ApiSetup";
import { Connection } from "./../../models/member/Connection";
import { deserialize } from "serializer.ts/Serializer";

export class ConnectionApiSetup extends ApiSetup {

    static version = "v1";

    static init(router: express.Router) {

        super.init(router);

        router.get(`${this.GetContextRoot()}/members/:memberId/connections`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;
            let depth = req.query.depth ? parseInt(req.query.depth) : null;
            let memberId = req.params.memberId;

            let connectionService: ConnectionService = new ConnectionService(locator, clientContext);
            connectionService.getConnections(memberId, depth).then((connections) => {
                res.send(connections);
            }).catch((err) => {
                res.sendStatus(this.getErrorCode(err));
            });
        });

        router.put(`${this.GetContextRoot()}/members/:memberId/connections`, (req, res) => {
            let locator: Locator = (<any>global).locator;
            let clientContext: ClientContext = (<any>req).clientContext;
            let memberId = req.params.memberId;
            let connection: Connection = deserialize<Connection>(Connection, req.body);

            let connectionService: ConnectionService = new ConnectionService(locator, clientContext);
            connectionService.createConnection(memberId, connection).then((result) => {
                res.send(result);
            }).catch((err) => {
                res.sendStatus(this.getErrorCode(err));
            });
        });
    };
}

