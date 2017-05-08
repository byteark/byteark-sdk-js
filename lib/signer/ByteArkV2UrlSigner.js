import crypto from 'crypto';
import { stringify } from 'qs';
import urlParse from 'url-parse';

export class ByteArkV2UrlSigner {

    constructor(options) {
        this.options = options;

        if (!this.options.access_id) {
            this.options.access_id = '';
        }

        if (!this.options.access_secret) {
            throw 'Access ID secret is required.';
        }

        if (!this.options.default_age) {
            this.options.default_age = 900;
        }

        this.hasher = crypto.createHash('md5');
    }

    sign (url, expires = null, options = {}) {
        if (!expires) {
            expires = (Date().getTime() / 1000) + this.options.default_age;
        }

        const queryString = stringify(this.makeQueryParams(url, expires, options));

        return `${url}?${queryString}`;
    }

    makeQueryParams(url, expires, options) {
        let queryParams = {
            'x_ark_access_id': this.options.access_id,
            'x_ark_auth_type': 'ark-v2',
            'x_ark_expires': expires,
            'x_ark_signature': this.makeSignature(url, expires, options),
        };

        Object.keys(options).forEach((key) => {
            const canonicalKey = this.makeCanonicalKey(key);
            queryParams[`x_ark_${canonicalKey}`] = 1;
        });

        return this.makeSortedObject(queryParams);
    }

    makeSortedObject(unsorted) {
        let sorted = {};

        Object.keys(unsorted).sort().forEach((key) => {
            sorted[key] = unsorted[key];
        });

        return sorted;
    }

    makeSignature(url, expires, options) {
        const stringToSign = this.makeStringToSign(url, expires, options);

        this.hasher.update(stringToSign);

        return this.hasher.digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    makeStringToSign(url, expires, options) {
        const urlComponents = urlParse(url);

        let linesToSign = [];
        linesToSign.push(options.method ? options.method : 'GET');
        linesToSign.push(urlComponents.host);
        linesToSign.push(urlComponents.pathname);
        linesToSign = linesToSign.concat(this.makeCustomPolicyLines(options));
        linesToSign.push(expires);
        linesToSign.push(this.options.access_secret);

        return linesToSign.join('\n');
    }

    makeCustomPolicyLines(options) {
        return Object.keys(options)
            .sort()
            .map((key) => {
                const canonicalKey = this.makeCanonicalKey(key);
                const value = options[key];
                return `${canonicalKey}:${value}`;
            });
    }

    makeCanonicalKey(key) {
        return key.toLowerCase().replace(/-/g, '_');
    }

}
