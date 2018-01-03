import * as express from "express";
import * as bodyParser from "body-parser";
import * as  jwt from "express-jwt";
import * as nconf from "nconf";
import { Promise } from "rsvp";
import { Locator } from "./../models/common/Locator";
import { MemberApiSetup as MemberApiSetupV1 } from "./../api/v1/Member";
import { ConnectionApiSetup as ConnectionApiSetupV1 } from "./../api/v1/Connection";
import { AuthenticationEndpointSetup } from "./../utils/authentication/endpoints/Setup";
import { deserialize } from "serializer.ts/Serializer";
import { ClientContext } from "./../models/common/ClientContext";

class WebHostSetup {

    locator: Locator = null;

    constructor(name: string) {
        this.locator = (<any>global).locator;
    }

    /**
     * Initialise the setup : connects to the mongdb
     */
    init(app: express.Application) {

        return new Promise((resolve, reject) => {

            app.use(bodyParser.json());

            // Auth
            app.use(jwt({
                secret: nconf.get('config').jwtSecret,
                requestProperty: '_token',
                credentialsRequired: false,
                getToken: function fromHeaderOrQuerystring(req) {

                    let authToken: string = (req.headers.authorization || "").toString();

                    if (authToken.split(' ')[0] === 'Bearer') {
                        return authToken.split(' ')[1];
                    } else if (req.query && req.query.token) {
                        return req.query.token;
                    } else if (req.query && req.query.api_key) {
                        return req.query.api_key;
                    }
                    return null;
                }
            }), (req: express.Request, res: express.Response, next: Function) => {

                let method = req.method;
                let token: any = (<any>req)._token;

                if (!(<any>req)._token
                    && req.method !== 'OPTIONS'
                    && req.url.indexOf("/api/") === 0) {
                        
                    res.send(401);
                } else if ((<any>req)._token) {
                    (<any>req).clientContext = deserialize<ClientContext>(ClientContext, (<any>req)._token.principal);
                    next();
                } else {
                    next();
                }
            });

            var router = express.Router();
            MemberApiSetupV1.init(router);
            ConnectionApiSetupV1.init(router);
            AuthenticationEndpointSetup.init(router);
            app.use(router);

            // Ping
            app.get('/ping', (req, res) => {

                let result = {
                    timestamp: new Date(),
                    database: {
                        status: "",
                        provider: nconf.get('config:database').type,
                    }
                };

                this.locator.database.ping().then(() => {
                    result.database.status = "online";
                    res.send(result);
                }).catch((error: any) => {

                    result.database.status = "error";
                    (<any>result.database).error = error;
                    res.send(result);
                });

            });

            let logger = this.locator.logger;
            let port = process.env.PORT || '2020';
            app.listen(port, () => {
                logger.debug('app listening on port ' + port);
                (<any>app).emit("app-started");
                resolve();
            });

        });
    }
}

module.exports = new WebHostSetup(null);