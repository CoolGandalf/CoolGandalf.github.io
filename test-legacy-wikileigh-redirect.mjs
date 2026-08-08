import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./legacy-wikileigh-redirect.js', import.meta.url), 'utf8');

function redirectedUrl(pathname, search = '', hash = '') {
  let target = null;
  const window = {
    location: {
      pathname,
      search,
      hash,
      replace(value) { target = value; },
    },
  };
  vm.runInNewContext(source, { window });
  return target;
}

test('old dated today URLs preserve their path, query, and hash', () => {
  assert.equal(
    redirectedUrl('/today/2026-07-28/', '?view=full', '#pictures'),
    '/wikileighs/today/2026-07-28/?view=full#pictures',
  );
});

test('old wiki routes redirect to the deployed WikiLeigh base', () => {
  assert.equal(redirectedUrl('/wiki/cortana'), '/wikileighs/wiki/cortana');
  assert.equal(redirectedUrl('/today/'), '/wikileighs/today/');
});

test('unrelated missing lgl.gg pages stay on the branded 404', () => {
  assert.equal(redirectedUrl('/definitely-not-a-wiki-route'), null);
});
