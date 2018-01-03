var fs = require('fs');
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
        this.path = null;
        this.path = './uploadedmedia';
    }
    /**
     * Gets a stream to write to local file storage
     */
    LocalStorage.prototype.getWritableStream = function (filename, callback) {
        var writeStream = fs.createWriteStream(this.path + "/" + filename);
        writeStream.on('finish', callback);
        return writeStream;
    };
    /**
     * Read the file and writes its to given stream
     */
    LocalStorage.prototype.getReadableStream = function (filename, writeStream, callback) {
        var readStream = fs.createReadStream(this.path + "/" + filename);
        readStream.pipe(writeStream);
        readStream.on('finish', callback);
        return readStream;
    };
    return LocalStorage;
}());
module.exports = new LocalStorage();
