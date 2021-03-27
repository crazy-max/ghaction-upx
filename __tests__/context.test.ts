import * as context from '../src/context';
import * as core from '@actions/core';
import * as path from 'path';

describe('getInputList', () => {
  it('handles single line correctly', async () => {
    await setInput('foo', 'bar');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar']);
  });

  it('handles multiple lines correctly', async () => {
    setInput('foo', 'bar\nbaz');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar', 'baz']);
  });

  it('remove empty lines correctly', async () => {
    setInput('foo', 'bar\n\nbaz');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar', 'baz']);
  });

  it('handles comma correctly', async () => {
    setInput('foo', 'bar,baz');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar', 'baz']);
  });

  it('remove empty result correctly', async () => {
    setInput('foo', 'bar,baz,');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar', 'baz']);
  });

  it('handles different new lines correctly', async () => {
    setInput('foo', 'bar\r\nbaz');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar', 'baz']);
  });

  it('handles different new lines and comma correctly', async () => {
    setInput('foo', 'bar\r\nbaz,bat');
    const res = await context.getInputList(core.getInput('foo'));
    console.log(res);
    expect(res).toEqual(['bar', 'baz', 'bat']);
  });

  it('handles multiple lines and ignoring comma correctly', async () => {
    setInput('files', './bin/binary.exe\n./bin/binary2.exe');
    const res = await context.getInputList(core.getInput('files'), true);
    console.log(res);
    expect(res).toEqual(['./bin/binary.exe', './bin/binary2.exe']);
  });

  it('handles different new lines and ignoring comma correctly', async () => {
    setInput('driver-opts', './bin/binary.exe\r\n./bin/binary2.exe');
    const res = await context.getInputList(core.getInput('files'), true);
    console.log(res);
    expect(res).toEqual(['./bin/binary.exe', './bin/binary2.exe']);
  });
});

describe('asyncForEach', () => {
  it('executes async tasks sequentially', async () => {
    const testValues = [1, 2, 3, 4, 5];
    const results: number[] = [];

    await context.asyncForEach(testValues, async value => {
      results.push(value);
    });

    expect(results).toEqual(testValues);
  });
});

describe('resolvePaths', () => {
  it('resolve files given a set of paths', async () => {
    expect(
      context.resolvePaths([path.join(__dirname, 'fixtures/data/**/*').split(path.sep).join(path.posix.sep)])
    ).toEqual([path.join(__dirname, 'fixtures/data/foo/bar.txt').split(path.sep).join(path.posix.sep)]);
  });
});

// See: https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts#L67
function getInputName(name: string): string {
  return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
}

function setInput(name: string, value: string): void {
  process.env[getInputName(name)] = value;
}
