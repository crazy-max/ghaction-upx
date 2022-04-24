import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();
const osArch: string = os.arch();

export async function getUPX(version: string): Promise<string> {
  core.startGroup(`Checking UPX ${version} release...`);
  const release: github.GitHubRelease | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find UPX ${version} release`);
  }
  const semver: string = release.tag_name.replace(/^v/, '');
  core.info(`UPX ${semver} found`);
  core.endGroup();

  const filename = util.format('%s.%s', getName(semver), osPlat == 'win32' ? 'zip' : 'tar.xz');
  const downloadUrl = util.format('https://github.com/upx/upx/releases/download/v%s/%s', semver, filename);

  core.startGroup(`Downloading ${downloadUrl}...`);

  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.info(`Downloaded to ${downloadPath}`);

  let extPath: string;
  if (osPlat == 'win32') {
    extPath = await tc.extractZip(downloadPath);
  } else {
    extPath = await tc.extractTar(downloadPath, undefined, 'x');
  }
  core.info(`Extracted to ${extPath}`);

  const cachePath: string = await tc.cacheDir(extPath, 'ghaction-upx', semver);
  core.debug(`Cached to ${cachePath}`);

  const exePath: string = path.join(cachePath, getName(semver), osPlat == 'win32' ? 'upx.exe' : 'upx');
  core.debug(`Exe path is ${exePath}`);
  core.endGroup();

  return exePath;
}

function getName(version: string): string {
  let platform = '';
  if (osPlat == 'win32') {
    platform = osArch == 'x64' ? 'win64' : 'win32';
  } else if (osPlat == 'linux') {
    platform = osArch == 'x64' ? 'amd64_linux' : 'i386_linux';
  }
  return util.format('upx-%s-%s', version, platform);
}
