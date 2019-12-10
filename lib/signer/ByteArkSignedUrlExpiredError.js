export default class ByteArkSignedUrlExpiredError extends Error {
    constructor() {
        super('Signed URL is expired');
    }
}