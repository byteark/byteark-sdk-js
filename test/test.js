import { strictEqual } from 'assert';
import { ByteArkV2UrlSigner } from '..';

describe('ByteArkV2UrlSigner', () => {

  it('Returns valid signed URL', () => {
    const signer = new ByteArkV2UrlSigner({
      access_id: '2Aj6Wkge4hi1ZYLp0DBG',
      access_secret: '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
    });
    const signedUrl = signer.sign(
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8',
      1514764800
    );
    strictEqual(
      signedUrl,
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8'
        + '?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG'
        + '&x_ark_auth_type=ark-v2'
        + '&x_ark_expires=1514764800'
        + '&x_ark_signature=cLwtn96a-YPY7jt8ZKSf_Q'
    );
  });

  it('Returns signed URL with client IP', () => {
    const signer = new ByteArkV2UrlSigner({
      access_id: '2Aj6Wkge4hi1ZYLp0DBG',
      access_secret: '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
    });
    const signedUrl = signer.sign(
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8',
      1514764800,
      { 'client_ip': '103.253.132.65' },
    );
    strictEqual(
      signedUrl,
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8'
        + '?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG'
        + '&x_ark_auth_type=ark-v2'
        + '&x_ark_client_ip=1'
        + '&x_ark_expires=1514764800'
        + '&x_ark_signature=Gr9T_ZdHDy8l8CCPxpFjNg'
    );
  });


  it('Returns valid signed URL with client IP event with dash instead of underscore', () => {
    const signer = new ByteArkV2UrlSigner({
      access_id: '2Aj6Wkge4hi1ZYLp0DBG',
      access_secret: '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
    });
    const signedUrl = signer.sign(
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8',
      1514764800,
      { 'client-ip': '103.253.132.65' },
    );
    strictEqual(
      signedUrl,
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8'
        + '?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG'
        + '&x_ark_auth_type=ark-v2'
        + '&x_ark_client_ip=1'
        + '&x_ark_expires=1514764800'
        + '&x_ark_signature=Gr9T_ZdHDy8l8CCPxpFjNg'
    );
  });

  it('Returns signed URL with both client IP and user agent', () => {
    const signer = new ByteArkV2UrlSigner({
      access_id: '2Aj6Wkge4hi1ZYLp0DBG',
      access_secret: '31sX5C0lcBiWuGPTzRszYvjxzzI3aCZjJi85ZyB7',
    });
    const signedUrl = signer.sign(
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8',
      1514764800,
      {
        'client_ip': '103.253.132.65',
        'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) '
          + 'AppleWebKit/537.36 (KHTML, like Gecko) '
          + 'Chrome/58.0.3029.68 Safari/537.36',
      },
    );
    strictEqual(
      signedUrl,
      'http://inox.qoder.byteark.com/video-objects/QDuxJm02TYqJ/playlist.m3u8'
        + '?x_ark_access_id=2Aj6Wkge4hi1ZYLp0DBG'
        + '&x_ark_auth_type=ark-v2'
        + '&x_ark_client_ip=1'
        + '&x_ark_expires=1514764800'
        + '&x_ark_signature=yYFkwZolbxCarOLHuKjD7w'
        + '&x_ark_user_agent=1'
    );
  });

});
