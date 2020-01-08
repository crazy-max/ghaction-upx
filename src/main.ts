import * as installer from './installer';
import * as fs from 'fs';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function run(silent?: boolean) {
  try {
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
