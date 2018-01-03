"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var rsvp_1 = require("rsvp");
var _ = require("lodash");
var Database_1 = require("../../models/common/Database");
var Mongo = /** @class */ (function (_super) {
    __extends(Mongo, _super);
    function Mongo(settings) {
        var _this = _super.call(this) || this;
        _this.db = null;
        _this.settings = null;
        _this.settings = settings;
        return _this;
    }
    Mongo.prototype.init = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var url = _this.settings.url;
            mongodb_1.MongoClient.connect(url, function (err, db) {
                _this.db = db;
                resolve(_this);
            });
        });
    };
    /**
     * Inserts a single document in to the collection
     */
    Mongo.prototype.insert = function (type, data) {
        var _this = this;
        var document = _.cloneDeep(data);
        return new rsvp_1.Promise(function (resolve, reject) {
            if (!document.id) {
                reject("Document ID not set");
                return;
            }
            var collection = _this.getCollection(type);
            collection.insert(document, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else if (result.insertedCount !== 1) {
                    reject(new Error("DB Insert failed"));
                }
                else {
                    resolve(document);
                }
            });
        });
    };
    /**
     * Updates the given data in all documents returned by the query
     */
    Mongo.prototype.update = function (type, query, dataToUpdate) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var collection = _this.getCollection(type);
            collection.update(query, dataToUpdate, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else if (result.nModified === 0) {
                    resolve(null);
                }
                else {
                    resolve(dataToUpdate);
                }
            });
        });
    };
    /**
     * Finds a single document from the collection
     */
    Mongo.prototype.findOne = function (type, query) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var collection = _this.getCollection(type);
            collection.findOne(query, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    /**
    * Finds all documents from the collection which satisfies the condition
    */
    Mongo.prototype.find = function (type, query, options) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var collection = _this.getCollection(type);
            var cursor = collection.find(query);
            // Sort
            if (options && options.orderby) {
                cursor.sort(options.orderby);
            }
            // Projection
            if (options && options.fields) {
                var fields = options.fields.map(function (fieldName) {
                    var field = {};
                    field[fieldName] = 1;
                    return field;
                });
                cursor.project(fields);
            }
            cursor.toArray(function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    /**
    * Performs aggretagion
    */
    Mongo.prototype.aggregate = function (type, pipeline) {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            var collection = _this.getCollection(type);
            var cursor = collection.aggregate(pipeline);
            cursor.toArray(function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    /**
     * Reset the database
     * Used for test setup only
     */
    Mongo.prototype.reset = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            _this.db.collections(function (err, collections) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    var promises = [];
                    collections.forEach(function (collection) {
                        promises.push(_this.dropCollection(collection));
                    });
                    rsvp_1.Promise.all(promises).then(function () {
                        resolve();
                    });
                }
            });
        });
    };
    /**
     * Drops the given collection
     * @param {*} collectionName
     */
    Mongo.prototype.dropCollection = function (collection) {
        return new rsvp_1.Promise(function (resolve, reject) {
            collection.drop(function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            ;
        });
    };
    /**
     * Ping the db server
     */
    Mongo.prototype.ping = function () {
        var _this = this;
        return new rsvp_1.Promise(function (resolve, reject) {
            _this.db.command({ ping: 1 }, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    Mongo.prototype.getCollection = function (type) {
        return this.db.collection((process.env.ENV_NAME || 'DEV') + '_' + type);
    };
    return Mongo;
}(Database_1.Database));
module.exports = Mongo;
