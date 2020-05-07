import fs = require('fs');
import * as installer from '../src/installer';

describe('installer', () => {
  it('acquires v3.95 version of UPX', async () => {
    const upx = await installer.getUPX('v3.95');
    console.log(upx);
    expect(fs.existsSync(upx)).toBe(true);
  }, 100000);

  it('acquires latest version of UPX', async () => {
    const upx = await installer.getUPX('latest');
    console.log(upx);
    expect(fs.existsSync(upx)).toBe(true);
  }, 100000);
});
