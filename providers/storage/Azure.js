var nconf = require('nconf');
var AzureStorage = /** @class */ (function () {
    function AzureStorage() {
        this.blobService = null;
        this.blobService = this._getBlobService();
    }
    /**
     * Creates a stream to write to azure blob storage
     */
    AzureStorage.prototype.getWritableStream = function (filename, callback) {
        return this.blobService.createWriteStreamToBlockBlob(nconf.get('config:storage:azure_container'), filename, callback);
    };
    /**
     * Reads the file from azure blob storage and writes to the given stream
     */
    AzureStorage.prototype.getReadableStream = function (filename, writeStream, callback) {
        return this.blobService.getBlobToStream(nconf.get('config:storage:azure_container'), filename, writeStream, callback);
    };
    /**
      * Gets the azure blob service
      * Private
      * */
    AzureStorage.prototype._getBlobService = function () {
        var storage = require('azure-storage');
        var accessKey = nconf.get('config:storage:azure_accessKey');
        var storageAccount = nconf.get('config:storage:azure_storageAccount');
        return storage.createBlobService(storageAccount, accessKey);
    };
    return AzureStorage;
}());
module.exports = new AzureStorage();
