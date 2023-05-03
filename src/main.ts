import * as os from 'os';
import * as path from 'path';
import * as context from './context';
import * as installer from './installer';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    if (os.platform() == 'darwin') {
      core.setFailed('Not supported on darwin platform');
      return;
    }

    const inputs: context.Inputs = await context.getInputs();
    const upx = await installer.getUPX(inputs.version);

    if (inputs.installOnly) {
      const dir = path.dirname(upx);
      core.addPath(dir);
      core.debug(`Added ${dir} to PATH`);
      return;
    }

    const files: string[] = context.resolvePaths(inputs.files);
    if (files.length == 0) {
      core.warning(`No files were found. Please check the 'files' input.`);
      return;
    }

    await context.asyncForEach(files, async filepath => {
      core.startGroup(`Compressing ${filepath}...`);
      await exec.exec(`${upx} ${inputs.args} ${filepath}`);
      core.endGroup();
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
