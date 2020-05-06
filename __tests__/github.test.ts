import * as github from '../src/github';

describe('github', () => {
  it('returns 3.96 GitHub release', async () => {
    const release = await github.getRelease('3.96');
    expect(release).not.toBeNull();
    expect(release.tag_name).toEqual('v3.96');
  });
});
