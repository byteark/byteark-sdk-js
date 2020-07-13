import crypto from 'crypto';
import { stringify, parse } from 'qs';
import urlParse from 'url-parse';
import ByteArkSignedUrlExpiredError from './ByteArkSignedUrlExpiredError';
import ByteArkSignedUrlInvalidConditionError from './ByteArkSignedUrlInvalidConditionError';
import ByteArkSignedUrlInvalidSignatureError from './ByteArkSignedUrlInvalidSignatureError';

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
    }

    sign (url, expires = null, options = {}) {
        if (!expires) {
            expires = Math.floor(Date.now() / 1000) + this.options.default_age;
        }

        const queryString = stringify(
            this.makeQueryParams(url, expires, this.makeCanonicalOptions(options)),
            { encode: !this.options.skip_url_encoding }
        );

        return `${url}?${queryString}`;
    }

    verify (url, now = null) {
        if (!now) {
            now = Math.floor(Date.now() / 1000);
        }

        const parsedUrl = new URL(url);
        const parsedUrlWithoutQuery = `${parsedUrl.origin}${parsedUrl.pathname}`;
        const parsedQuery = parse(parsedUrl.search.substring(1));

        const parsedExpires = Number.parseInt(parsedQuery['x_ark_expires']);
        if (parsedExpires < now) {
            throw new ByteArkSignedUrlExpiredError();
        }

        if (parsedQuery['x_ark_path_prefix'] && !parsedUrl.pathname.startsWith(parsedQuery['x_ark_path_prefix'])) {
            throw new ByteArkSignedUrlInvalidConditionError();
        }

        let options = {};
        Object.keys(parsedQuery)
            .filter(this.shouldQueryExistsInOptions)
            .forEach((key) => {
                options[key.replace('x_ark_', '')] = parsedQuery[key];
            });
        const expectedSignature = this.makeSignature(
            parsedUrlWithoutQuery,
            parsedExpires,
            options
        );
        if (expectedSignature !== parsedQuery['x_ark_signature']) {
            throw new ByteArkSignedUrlInvalidSignatureError()
        }

        return true;
    }

    makeQueryParams(url, expires, options) {
        let queryParams = {
            'x_ark_access_id': this.options.access_id,
            'x_ark_auth_type': 'ark-v2',
            'x_ark_expires': expires,
            'x_ark_signature': this.makeSignature(url, expires, options),
        };

        Object.keys(options)
            .filter(this.shouldOptionExistsInQuery)
            .forEach((key) => {
                queryParams[`x_ark_${key}`] = this.shouldOptionValueExistsInQuery(key)
                    ? options[key]
                    : 1;
            });

        return this.makeSortedObject(queryParams);
    }

    makeSortedObject(unsorted) {
        return Object.keys(unsorted).sort().reduce((result, key) => {
            result[key] = unsorted[key];
            return result;
        }, {});
    }

    makeSignature(url, expires, options) {
        const stringToSign = this.makeStringToSign(url, expires, options);

        const hasher = crypto.createHash('md5');
        hasher.update(stringToSign);

        return hasher.digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    makeStringToSign(url, expires, options) {
        const urlComponents = urlParse(url);

        let linesToSign = [];
        linesToSign.push(options.method ? options.method : 'GET');
        linesToSign.push(urlComponents.host);
        linesToSign.push(options.path_prefix ? options.path_prefix : urlComponents.pathname);
        linesToSign = linesToSign.concat(this.makeCustomPolicyLines(options));
        linesToSign.push(expires);
        linesToSign.push(this.options.access_secret);

        return linesToSign.join('\n');
    }

    makeCustomPolicyLines(options) {
        return Object.keys(options)
            .filter(this.shouldOptionExistsInCustomPolicyLine)
            .sort()
            .map((key) => {
                return `${key}:${options[key]}`;
            });
    }

    makeCanonicalOptions(options) {
        return Object.keys(options).reduce((result, key) => {
            const canonicalKey = this.makeCanonicalKey(key);
            result[canonicalKey] = options[key];
            return result;
        }, {});
    }

    makeCanonicalKey(key) {
        return key.toLowerCase().replace(/-/g, '_');
    }

    shouldOptionExistsInCustomPolicyLine($key) {
        return $key !== 'method'
            && $key !== 'path_prefix';
    }

    shouldOptionExistsInQuery(key) {
        return key !== 'method';
    }

    shouldOptionValueExistsInQuery(key) {
        return key !== 'client_ip' && key !== 'user_agent';
    }

    shouldQueryExistsInOptions(key) {
        return key.startsWith('x_ark_')
            && key !== 'x_ark_access_id'
            && key !== 'x_ark_auth_type'
            && key !== 'x_ark_expires'
            && key !== 'x_ark_signature';
    }

}
