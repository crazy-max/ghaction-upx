import {describe, expect, it} from '@jest/globals';
import * as fs from 'fs';
import * as installer from '../src/installer';

describe('getRelease', () => {
  it('returns latest UPX GitHub release', async () => {
    const release = await installer.getRelease('latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v3.95 UPX GitHub release', async () => {
    const release = await installer.getRelease('v3.95');
    expect(release).not.toBeNull();
    expect(release?.id).toEqual(12577195);
    expect(release?.tag_name).toEqual('v3.95');
    expect(release?.html_url).toEqual('https://github.com/upx/upx/releases/tag/v3.95');
  });

  it('unknown release', async () => {
    await expect(installer.getRelease('foo')).rejects.toThrowError(
      new Error(
        'Cannot find UPX release foo in https://raw.githubusercontent.com/crazy-max/ghaction-upx/master/.github/upx-releases.json'
      )
    );
  });
});

describe('installer', () => {
  it('acquires v3.95 version of UPX', async () => {
    const upx = await installer.getUPX('v3.95');
    expect(fs.existsSync(upx)).toBe(true);
  }, 100000);

  it('acquires latest version of UPX', async () => {
    const upx = await installer.getUPX('latest');
    expect(fs.existsSync(upx)).toBe(true);
  }, 100000);
});
