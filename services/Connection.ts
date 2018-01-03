import { Promise } from "rsvp";
import * as  shortId from "shortid";
import * as _ from "lodash";
import { Member } from "./../models/member/Member";
import { Connection } from "./../models/member/Connection";
import { ClientContext } from "./../models/common/ClientContext";
import { Locator } from "./../models/common/Locator";
import { PrincipalType } from "./../enums/common/PrincipalType";
import { ErrorType } from "./../enums/common/errorType";
import { RuleEngine } from "../utils/authorisation/RuleEngine";
import { Resource } from "../utils/authorisation/enums/Resource";
import { Action } from "../utils/authorisation/enums/Action";

export class ConnectionService {

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
     * Gets the connections for given member
     */
    getConnections(memberId: string, depth?: number): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {

            depth = depth || 3;

            let query = [

                { $match: { "memberId": memberId } },
                {
                    $graphLookup: {
                        from: "Connections",
                        startWith: "$memberId",
                        connectFromField: "connections.memberId",
                        connectToField: "memberId",
                        as: "relations",
                        maxDepth: 3,
                        depthField: "depth"
                    }
                }

            ];

            this.locator.database.aggregate('Connections', query).then((result: any) => {
                if (result && result.length) {

                    let maxDepth = depth;
                    let filters = {};

                    /*
                    The aggregation should return the data in a flat structure. But the connection list does not give the extra details we used to describe the relationships. For example, the type. Just by looking at the array of connections you cannot determine Oliver's relationship with William, unless you look in to the relatedTo properties of each connection.
                    We need an additional step to identify the relationship tree within the connections array, and to transform it in to a friendly structure.
                    */

                    // Finding the root node (the person we originally searched for)
                    let allConnections = result[0].relations;
                    let root = allConnections.find((connection: any) => {
                        return connection.depth === 0;
                    });

                    let person: any = {};
                    person.memberId = root.memberId;

                    // Following function recursively attaches further connections to the corresponding nodes.
                    this.parseConnections(person, allConnections, 1, maxDepth, filters);
                    console.log(JSON.stringify(person));
                    resolve(person);


                } else {
                    reject(new Error(ErrorType.notFount));
                }
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    /**
    * Recursively attaches connections to the given person node.
    */
    private parseConnections(person: any, allConnections: any[], depth: number, maxDepth: number, filters: any) {

        // Find the current person object from the list of connections
        let currentPersonConnection = allConnections.filter((connection) => {
            return connection.memberId === person.memberId;
        })[0];

        // Copy the additional person details to the person object
        person = (<any>Object).assign(person, currentPersonConnection);

        // Set the connections for current person
        // To avoid the circular dependency, create a new object
        person.connections = currentPersonConnection.connections.map((relation: any) => {

            return {
                memberId: relation.memberId,
                type: relation.type,
                degree: depth
            }
        });

        // TODO: dirty fix as the above 'Object.assign' call overwrites the depth which was set earlier.
        person.depth = person.degree;

        // Make sure we respect the given max-depth
        if (depth <= maxDepth) {

            // Continue with each person in current person's connection list
            person.connections.forEach((relatedPerson: any) => {

                // (Recursive)  
                this.parseConnections(relatedPerson, allConnections, (depth + 1), maxDepth, filters);
            });
        } else {

            // End of tree
            person.connections = undefined;
        }
    }
}
