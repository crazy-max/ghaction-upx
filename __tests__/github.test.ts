import {describe, expect, it} from '@jest/globals';
import * as github from '../src/github';

describe('github', () => {
  it('returns latest UPX GitHub release', async () => {
    const release = await github.getRelease('latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v3.96 GoReleaser GitHub release', async () => {
    const release = await github.getRelease('v3.96');
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v3.96');
  });
});
