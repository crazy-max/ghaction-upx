import * as fs from 'fs';
import * as os from 'os';
import * as installer from './installer';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    if (os.platform() == 'darwin') {
      core.setFailed('Not supported on darwin platform');
      return;
    }

    const version = core.getInput('version') || 'latest';
    const file = core.getInput('file', {required: true});
    const args = core.getInput('args');

    if (!fs.existsSync(file)) {
      core.setFailed(`File to compress not found: ${file}`);
      return;
    }

    const upx = await installer.getUPX(version);

    core.info('🏃 Running UPX...');
    await exec.exec(`${upx} ${args} ${file}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
