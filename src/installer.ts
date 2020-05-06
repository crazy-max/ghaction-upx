import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

let osPlat: string = os.platform();
let osArch: string = os.arch();

export async function getUPX(version: string): Promise<string> {
  const release: github.GitHubRelease | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find UPX ${version} release`);
  }

  const semver: string = release.tag_name.replace(/^v/, '');
  core.debug(`Semver is ${semver}`);

  core.info(`✅ UPX version found: ${semver}`);
  const filename = util.format('%s.%s', getName(semver), osPlat == 'win32' ? 'zip' : 'tar.xz');
  const downloadUrl = util.format('https://github.com/upx/upx/releases/download/v%s/%s', semver, filename);

  core.info(`⬇️ Downloading ${downloadUrl}...`);
  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.debug(`Downloaded to ${downloadPath}`);

  core.info('📦 Extracting UPX...');
  const extPath: string =
    osPlat == 'win32' ? await tc.extractZip(downloadPath) : await tc.extractTar(downloadPath, undefined, 'x');
  core.debug(`Extracted to ${extPath}`);

  const cachePath: string = await tc.cacheDir(extPath, 'ghaction-upx', version);
  core.debug(`Cached to ${cachePath}`);

  const exePath: string = path.join(cachePath, getName(semver), osPlat == 'win32' ? 'upx.exe' : 'upx');
  core.debug(`Exe path is ${exePath}`);

  return exePath;
}

function getName(version: string): string {
  let platform: string = '';
  if (osPlat == 'win32') {
    platform = osArch == 'x64' ? 'win64' : 'win32';
  } else if (osPlat == 'linux') {
    platform = osArch == 'x64' ? 'amd64_linux' : 'i386_linux';
  }
  return util.format('upx-%s-%s', version, platform);
}
