import * as glob from 'glob';
import {lstatSync} from 'fs';
import * as core from '@actions/core';

export interface Inputs {
  version: string;
  files: string[];
  args: string;
  installOnly: boolean;
}

export async function getInputs(): Promise<Inputs> {
  return {
    version: core.getInput('version') || 'latest',
    files: getInputList(core.getInput('files') || core.getInput('file'), true),
    args: core.getInput('args'),
    installOnly: core.getBooleanInput('install-only')
  };
}

export function getInputList(items: string, ignoreComma?: boolean): string[] {
  if (items == '') {
    return [];
  }
  return items
    .split(/\r?\n/)
    .filter(x => x)
    .reduce<string[]>(
      (acc, line) => acc.concat(!ignoreComma ? line.split(',').filter(x => x) : line).map(pat => pat.trim()),
      []
    );
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const resolvePaths = (patterns: string[]): string[] => {
  return patterns.reduce((acc: string[], pattern: string): string[] => {
    return acc.concat(glob.sync(pattern).filter(path => lstatSync(path).isFile()));
  }, []);
};
