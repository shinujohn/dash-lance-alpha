let nconf = require('nconf');

class AzureStorage {
    blobService: any = null;

    constructor() {
        this.blobService = this._getBlobService();
    }

    /**
     * Creates a stream to write to azure blob storage
     */
    getWritableStream(filename: string, callback: Function) {
        return this.blobService.createWriteStreamToBlockBlob(nconf.get('config:storage:azure_container'), filename, callback);
    }

    /**
     * Reads the file from azure blob storage and writes to the given stream
     */
    getReadableStream(filename: string, writeStream: Buffer, callback: Function) {
        return this.blobService.getBlobToStream(nconf.get('config:storage:azure_container'), filename, writeStream, callback);
    }

    /** 
      * Gets the azure blob service 
      * Private
      * */
    _getBlobService() {
        var storage = require('azure-storage');
        var accessKey = nconf.get('config:storage:azure_accessKey');
        var storageAccount = nconf.get('config:storage:azure_storageAccount');

        return storage.createBlobService(storageAccount, accessKey);
    }
}

module.exports = new AzureStorage();