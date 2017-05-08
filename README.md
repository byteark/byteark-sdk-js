# ByteArk SDK for js

[![NPM Version](https://img.shields.io/byteark-sdk/v/jquery.svg)](https://cdnjs.com/libraries/byteark-sdk)
[![Build Status](https://travis-ci.org/byteark/byteark-sdk-js.svg?branch=master)](https://travis-ci.org/byteark/byteark-sdk-js)

## Installation

For NodeJS, You may install this SDK via [NPM](https://npmjs.org)

    npm install byteark-sdk

## Usages

Now the only feature availabled is creating signed URL with ByteArk Signature Version 2

### Usage using ES6

```javascript
import { ByteArkV2UrlSigner } from 'byteark-sdk';

const signer = new ByteArkV2UrlSigner([
    'access_id' => '2Aj6Wkge4hi1ZYLp0DBG',
    'access_secret' => '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
]);

const signedUrl = signer->sign(
    'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8',
    1514764800,
    [
        'client_ip' => '103.253.132.65',
    ]
);

/*
Got this url:
http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8
    ?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG
    &x_ark_auth_type=ark-v2
    &x_ark_client_ip=1
    &x_ark_expires=1514764800
    &x_ark_signature=57aebae531c3d582029fc2440d3ff132
*/
```

## Usage using CommonJS

```javascript
var byteark = require('byteark-sdk');
var ByteArkV2UrlSigner = byteark.ByteArkV2UrlSigner;

// And so on...
```

For more usage details, please visit [ByteArk Documentation](https://docs.byteark.com)
