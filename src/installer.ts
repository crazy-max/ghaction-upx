import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as core from '@actions/core';
import * as httpm from '@actions/http-client';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();
const osArch: string = os.arch();

export interface GitHubRelease {
  id: number;
  tag_name: string;
  html_url: string;
  assets: Array<string>;
}

export const getRelease = async (version: string): Promise<GitHubRelease> => {
  const url = `https://raw.githubusercontent.com/crazy-max/ghaction-upx/master/.github/upx-releases.json`;
  const http: httpm.HttpClient = new httpm.HttpClient('ghaction-upx');
  const resp: httpm.HttpClientResponse = await http.get(url);
  const body = await resp.readBody();
  const statusCode = resp.message.statusCode || 500;
  if (statusCode >= 400) {
    throw new Error(`Failed to get UPX release ${version} from ${url} with status code ${statusCode}: ${body}`);
  }
  const releases = <Record<string, GitHubRelease>>JSON.parse(body);
  if (!releases[version]) {
    throw new Error(`Cannot find UPX release ${version} in ${url}`);
  }
  return releases[version];
};

export async function getUPX(version: string): Promise<string> {
  const release: GitHubRelease = await getRelease(version);
  const semver: string = release.tag_name.replace(/^v/, '');
  core.info(`UPX ${semver} found`);

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
  let platform: string;
  switch (osArch) {
    case 'x64': {
      platform = osPlat === 'win32' ? 'win64' : 'amd64_' + osPlat;
      break;
    }
    case 'x32': {
      platform = osPlat === 'win32' ? 'win32' : 'i386_' + osPlat;
      break;
    }
    case 'arm': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arm_version = (process.config.variables as any).arm_version;
      if (arm_version === '7') {
        platform = 'armeb_' + osPlat;
      } else {
        platform = 'arm_' + osPlat;
      }
      break;
    }
    default: {
      platform = osArch + '_' + osPlat;
      break;
    }
  }
  return util.format('upx-%s-%s', version, platform);
}
