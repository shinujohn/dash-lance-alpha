
let fs = require('fs');
class LocalStorage {

    path: string = null;

    constructor() {
        this.path = './uploadedmedia';
    }

    /**
     * Gets a stream to write to local file storage
     */
    getWritableStream(filename: string, callback: Function) {
        let writeStream = fs.createWriteStream(`${this.path}/${filename}`);
        writeStream.on('finish', callback);
        return writeStream;
    }

    /**
     * Read the file and writes its to given stream
     */
    getReadableStream(filename: string, writeStream: Buffer, callback: Function) {
        let readStream = fs.createReadStream(`${this.path}/${filename}`);
        readStream.pipe(writeStream);
        readStream.on('finish', callback);
        return readStream;
    }
}

module.exports = new LocalStorage();