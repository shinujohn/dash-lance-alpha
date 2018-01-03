import * as  shortId from "shortid";
import { MongoClient, Db, Collection } from "mongodb";
import * as nconf from "nconf";
import { Promise } from "rsvp";

export abstract class Database {
 
    constructor() {  
    }

    /**
     * Inserts a single document in to the collection
     */
    abstract insert(type: string, document: any): any;

    /**
     * Updates the given data in all documents returned by the query
     */
    abstract update(type: string, query: Object, dataToUpdate: any): any;

    /**
     * Finds a single document from the collection
     */
    abstract findOne(type: string, query: Object): any;

    /**
    * Finds all documents from the collection which satisfies the condition
    */
    abstract find(type: string, query: Object, options: any): any;

    /**
    * Performs aggretagion
    */
    abstract aggregate(type: string, pipeline: Object[]): any;

    /**
     * Reset the database 
     * Used for test setup only
     */
    abstract reset(): any;

    /**
     * Drops the given collection
     * @param {*} collectionName 
     */
    abstract dropCollection(collection: Collection): any;

    /**
     * Ping the db server
     */
    abstract ping(): any;

    /**
     * Gets the collection by its name
     * @param type 
     */
    abstract getCollection(type: string): any;
}