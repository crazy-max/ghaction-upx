import {describe, expect, it} from '@jest/globals';
import * as fs from 'fs';
import * as installer from '../src/installer';

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
