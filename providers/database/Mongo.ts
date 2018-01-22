import { MongoClient, Db, Collection } from "mongodb";
import * as nconf from "nconf";
import { Promise } from "rsvp";
import * as _ from "lodash";
import { Database } from "../../models/common/Database";
import { ErrorType } from "./../../enums/common/errorType";

class Mongo extends Database {

    db: Db = null;
    settings: any = null;

    constructor(settings: any) {
        super();
        this.settings = settings;
    }

    init() {
        return new Promise((resolve, reject) => {
            var url = this.settings.url;
            MongoClient.connect(url, (err, db) => {
                this.db = db;
                resolve(this);
            });
        });
    }

    /**
     * Inserts a single document in to the collection
     */
    insert(type: string, data: any) {

        let document = _.cloneDeep(data);

        return new Promise((resolve, reject) => {

            if (!document.id) {
                reject("Document ID not set");
                return;
            }

            var collection = this.getCollection(type);
            collection.insert(document, (err, result) => {

                if (err) {
                    console.error(err);
                    reject(err);
                } else if (result.insertedCount !== 1) {
                    reject(new Error("DB Insert failed"));
                } else {
                    resolve(document);
                }
            });
        });
    }

    /**
     * Updates the given data in all documents returned by the query
     */
    update(type: string, query: Object, dataToUpdate: any, options?: Object) {

        return new Promise((resolve, reject) => {
            var collection = this.getCollection(type);

            collection.update(query, dataToUpdate, options, (err, result: any) => {

                if (err) {
                    console.error(err);
                    reject(err);
                } else if (result.nModified === 0) {
                    resolve(null);
                } else {
                    resolve(dataToUpdate);
                }
            });
        });
    }

    /**
     * Finds a single document from the collection
     */
    findOne(type: string, query: Object) {

        return new Promise((resolve, reject) => {

            var collection = this.getCollection(type);
            collection.findOne(query, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
    * Finds all documents from the collection which satisfies the condition
    */
    find(type: string, query: Object, options: any) {

        return new Promise((resolve, reject) => {

            var collection = this.getCollection(type);
            let cursor = collection.find(query);

            // Sort
            if (options && options.orderby) {
                cursor.sort(options.orderby);
            }

            // Projection
            if (options && options.fields) {

                var fields = options.fields.map((fieldName: string) => {

                    var field: any = {};
                    field[fieldName] = 1;
                    return field;
                });

                cursor.project(fields);
            }

            cursor.toArray((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
    * Performs aggretagion
    */
    aggregate(type: string, pipeline: Object[]) {

        return new Promise((resolve, reject) => {

            var collection = this.getCollection(type);
            let cursor = collection.aggregate(pipeline);

            cursor.toArray((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Reset the database 
     * Used for test setup only
     */
    reset() {

        return new Promise((resolve, reject) => {

            this.db.collections((err, collections) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    var promises: Promise<any>[] = [];
                    collections.forEach((collection) => {
                        promises.push(this.dropCollection(collection));
                    });

                    Promise.all(promises).then(() => {
                        resolve();
                    });
                }
            });
        });

    }

    /**
     * Drops the given collection
     * @param {*} collectionName 
     */
    dropCollection(collection: Collection) {

        return new Promise((resolve, reject) => {
            collection.drop((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            });;
        });

    }

    /**
     * Ping the db server
     */
    ping() {

        return new Promise((resolve, reject) => {
            this.db.command({ ping: 1 }, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getCollection(type: string) {
        return this.db.collection((process.env.ENV_NAME || 'DEV') + '_' + type);
    }
}

module.exports = Mongo;