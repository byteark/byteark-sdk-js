import md5 from 'md5';
import { stringify } from 'qs';
import urlParse from 'url-parse';

export class ByteArkV2UrlSigner {

    constructor(options) {
        this.options = options;

        if (!this.options.access_id) {
            throw 'Access ID option is required.';
        }

        if (!this.options.access_secret) {
            throw 'Access ID secret is required.';
        }

        if (!this.options.default_age) {
            this.options.default_age = 900;
        }
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
            'x-ark-access-id': this.options.access_id,
            'x-ark-auth-type': 'ark-v2',
            'x-ark-expires': expires,
            'x-ark-signature': this.makeSignature(url, expires, options),
        };

        Object.keys(options).forEach((key) => {
            queryParams[`x-ark-sign-${key}`] = 1;
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
        return md5(this.makeStringToSign(url, expires, options));
    }

    makeStringToSign(url, expires, options) {
        const urlComponents = urlParse(url);

        let linesToSign = [];
        linesToSign.push('GET');
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
                const value = options[key];
                return `${key}:${value}`;
            });
    }

}
