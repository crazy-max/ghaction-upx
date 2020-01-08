import fs = require('fs');
import * as installer from '../src/installer';

describe('installer', () => {
  it('acquires 3.95 version of UPX', async () => {
    const upx = await installer.getUPX('3.95');
    expect(fs.existsSync(upx)).toBe(true);
  }, 100000);

  it('acquires latest version of UPX', async () => {
    const upx = await installer.getUPX('latest');
    expect(fs.existsSync(upx)).toBe(true);
  }, 100000);
});
