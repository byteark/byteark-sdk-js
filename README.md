# ByteArk SDK for js

[![NPM Version](https://img.shields.io/npm/v/byteark-sdk.svg)](https://www.npmjs.com/package/byteark-sdk)
[![Build Status](https://travis-ci.org/byteark/byteark-sdk-js.svg?branch=master)](https://travis-ci.org/byteark/byteark-sdk-js)

* [Installation](#installation)
* [Usages](#usages)
* [Usage for HLS](#usage-for-hls)
* [Options](#options)

## Installation

For NodeJS 5+, You may install this SDK via [NPM](https://npmjs.org)

    npm install byteark-sdk

## Usages

Now the only feature availabled is creating signed URL with ByteArk Signature Version 2.

First, create a ByteArkV2UrlSigner instance with access_id and access_secret. (access_id is currently optional for ByteArk Fleet).

Then, call sign method with URL to sign, Unix timestamp that the URL should expired, and sign options.

For sign options argument, you may include method, which determines which HTTP method is allowed (GET is the default is not determined), and may includes custom policies.

### Usage using ES6

First, create a ByteArkV2UrlSigner instance with `access_id` and `access_secret`.
(`access_id` is currently optional for ByteArk Fleet).

Then, call `sign` method with URL to sign,
Unix timestamp that the URL should expired, and sign options.

For sign options argument, you may include `method`, which determines
which HTTP method is allowed (`GET` is the default is not determined),
and may includes custom policies that appears in
[ByteArk Documentation](https://docs.byteark.com/article/secure-url-signature-v2/).

The following example will create a signed URL that allows to GET the resource
within 1st January 2018 (Unix timestamp is 1514764800):

```javascript
import { ByteArkV2UrlSigner } from 'byteark-sdk';

const signer = new ByteArkV2UrlSigner([
    'access_id' => '2Aj6Wkge4hi1ZYLp0DBG',
    'access_secret' => '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
]);

const signedUrl = signer->sign(
    'https://example.cdn.byteark.com/path/to/file.png',
    1514764800,
    {
        method: 'GET'
    }
);

console.log(signedUrl)

/*
Output:
https://example.cdn.byteark.com/path/to/file.png
    ?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG
    &x_ark_auth_type=ark-v2
    &x_ark_expires=1514764800
    &x_ark_signature=OsBgZpn9LTAJowa0UUhlYQ
*/
```

### Usage using CommonJS

```javascript
var byteark = require('byteark-sdk');
var ByteArkV2UrlSigner = byteark.ByteArkV2UrlSigner;

// Following steps just like using with CommonJS
```

For more usage details, please visit [ByteArk Documentation](https://docs.byteark.com)

## Usage for HLS

When signing URL for HLS, you have to choose common path prefix
and assign to `path_prefix` option is required,
since ByteArk will automatically create secured URLs for each segments
using the same options and signature.

For example, if your stream URL is `https://example.cdn.byteark.com/live/playlist.m3u8`,
you may use `/live/` as a path prefix.

```javascript
import { ByteArkV2UrlSigner } from 'byteark-sdk';

const signer = new ByteArkV2UrlSigner([
    'access_id' => '2Aj6Wkge4hi1ZYLp0DBG',
    'access_secret' => '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
]);

const signedUrl = signer->sign(
    'https://example.cdn.byteark.com/live/playlist.m3u8',
    1514764800,
    {
        method: 'GET',
        path_prefix: '/live/'
    }
);

console.log(signedUrl)

/*
Output:
https://example.cdn.byteark.com/live/playlist.m3u8
    ?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG
    &x_ark_auth_type=ark-v2
    &x_ark_expires=1514764800
    &x_ark_path_prefix=%2Flive%2F
    &x_ark_signature=7JGsff2mBQEOoSYHTjxiVQ
*/
```

## Options

### ByteArkV2UrlSigner

| Option        | Required | Default | Description                                                               |
|---------------|----------|---------|---------------------------------------------------------------------------|
| access_id     | Required | -       | Access key ID for signing                                                 |
| acesss_secret | Required | -       | Access key secret for signing                                             |
| default_age   | -        | 900     | Default signed URL age (in seconds), if signing without expired date/time |

### ByteArkV2UrlSigner.sign(url, expires = null, options = [])

| Option      | Required | Default | Description                                                                                                                                                   |
|-------------|----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| method      | -        | GET     | HTTP Method that allowed to use with the signed URL                                                                                                           |
| path_prefix | -        | -       | Path prefix that allowed to use with the signed URL (the same signing options and signature can be reuse with the