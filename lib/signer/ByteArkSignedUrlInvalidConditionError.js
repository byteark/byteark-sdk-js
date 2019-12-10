export default class ByteArkSignedUrlInvalidConditionError extends Error {
    constructor() {
        super('Invalid signed URL condition');
    }
}