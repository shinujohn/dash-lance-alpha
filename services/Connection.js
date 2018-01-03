"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsvp_1 = require("rsvp");
var errorType_1 = require("./../enums/common/errorType");
var ConnectionService = /** @class */ (function () {
    /**
     *
     * @param locator
     * @param clientContext
     */
    function ConnectionService(locator, clientContext) {
        this.locator = null;
        this.clientContext = null;
        this.locator = locator;
        this.clientContext = clientContext;
    }
    /**
     * Gets the connections for given member
     */
    ConnectionService.prototype.getConnections = function (memberId, depth) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            depth = depth || 3;
            var query = [
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
            _this.locator.database.aggregate('Connections', query).then(function (result) {
                if (result && result.length) {
                    var maxDepth = depth;
                    var filters = {};
                    /*
                    The aggregation should return the data in a flat structure. But the connection list does not give the extra details we used to describe the relationships. For example, the type. Just by looking at the array of connections you cannot determine Oliver's relationship with William, unless you look in to the relatedTo properties of each connection.
                    We need an additional step to identify the relationship tree within the connections array, and to transform it in to a friendly structure.
                    */
                    // Finding the root node (the person we originally searched for)
                    var allConnections = result[0].relations;
                    var root = allConnections.find(function (connection) {
                        return connection.depth === 0;
                    });
                    var person = {};
                    person.memberId = root.memberId;
                    // Following function recursively attaches further connections to the corresponding nodes.
                    _this.parseConnections(person, allConnections, 1, maxDepth, filters);
                    console.log(JSON.stringify(person));
                    resolve(person);
                }
                else {
                    reject(new Error(errorType_1.ErrorType.notFount));
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    /**
    * Recursively attaches connections to the given person node.
    */
    ConnectionService.prototype.parseConnections = function (person, allConnections, depth, maxDepth, filters) {
        var _this = this;
        // Find the current person object from the list of connections
        var currentPersonConnection = allConnections.filter(function (connection) {
            return connection.memberId === person.memberId;
        })[0];
        // Copy the additional person details to the person object
        person = Object.assign(person, currentPersonConnection);
        // Set the connections for current person
        // To avoid the circular dependency, create a new object
        person.connections = currentPersonConnection.connections.map(function (relation) {
            return {
                memberId: relation.memberId,
                type: relation.type,
                degree: depth
            };
        });
        // TODO: dirty fix as the above 'Object.assign' call overwrites the depth which was set earlier.
        person.depth = person.degree;
        // Make sure we respect the given max-depth
        if (depth <= maxDepth) {
            // Continue with each person in current person's connection list
            person.connections.forEach(function (relatedPerson) {
                // (Recursive)  
                _this.parseConnections(relatedPerson, allConnections, (depth + 1), maxDepth, filters);
            });
        }
        else {
            // End of tree
            person.connections = undefined;
        }
    };
    return ConnectionService;
}());
exports.ConnectionService = ConnectionService;
