import * as download from 'download';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as restm from 'typed-rest-client/RestClient';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

let osPlat: string = os.platform();
let osArch: string = os.arch();

export async function getUPX(version: string): Promise<string> {
  const selected = await determineVersion(version);
  if (selected) {
    version = selected;
  }

  core.info(`✅ UPX version found: ${version}`);
  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'upx-'));
  const fileName = getFileName(version);
  const downloadUrl = util.format('https://github.com/upx/upx/releases/download/v%s/%s', version, fileName);

  core.info(`⬇️ Downloading ${downloadUrl}...`);
  await download.default(downloadUrl, tmpdir, {filename: fileName});

  core.info('📦 Extracting UPX...');
  let extPath: string = tmpdir;
  if (osPlat == 'win32') {
    extPath = await tc.extractZip(`${tmpdir}/${fileName}`);
  } else {
    extPath = await tc.extractTar(`${tmpdir}/${fileName}`, undefined, 'x');
  }

  return path.join(extPath, getFileNameWithoutExt(version), osPlat == 'win32' ? 'upx.exe' : 'upx');
}

function getFileName(version: string): string {
  const ext: string = osPlat == 'win32' ? 'zip' : 'tar.xz';
  return util.format('%s.%s', getFileNameWithoutExt(version), ext);
}

function getFileNameWithoutExt(version: string): string {
  let platform: string = '';
  if (osPlat == 'win32') {
    platform = osArch == 'x64' ? 'win64' : 'win32';
  } else if (osPlat == 'linux') {
    platform = osArch == 'x64' ? 'amd64_linux' : 'i386_linux';
  }
  return util.format('upx-%s-%s', version, platform);
}

interface GitHubRelease {
  tag_name: string;
}

async function determineVersion(version: string): Promise<string> {
  let rest: restm.RestClient = new restm.RestClient('ghaction-upx', 'https://github.com', undefined, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (version !== 'latest') {
    version = `v${version}`;
  }

  let res: restm.IRestResponse<GitHubRelease> = await rest.get<GitHubRelease>(`/upx/upx/releases/${version}`);
  if (res.statusCode != 200 || res.result === null) {
    throw new Error(`Cannot find UPX ${version} release (http ${res.statusCode})`);
  }

  return res.result.tag_name.replace(/^v/, '');
}
