import * as installer from './installer';
import * as fs from 'fs';
import * as os from 'os';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function run(silent?: boolean) {
  try {
    if (os.platform() == 'darwin') {
      core.setFailed('Not supported on darwin platform');
      return;
    }

    const version = core.getInput('version') || 'latest';
    const file = core.getInput('file', {required: true});
    const args = core.getInput('args');
    const upx = await installer.getUPX(version);

    if (!fs.existsSync(file)) {
      core.setFailed(`⛔ File to compress not found: ${file}`);
    }

    console.log('🏃 Running UPX...');
    await exec.exec(`${upx} ${args} ${file}`, undefined, {
      silent: silent
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
