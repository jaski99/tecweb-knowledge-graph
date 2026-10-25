import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const WEB = new URL('../', import.meta.url);
async function jsFiles(folder) {
  const found = [];
  for (const entry of await readdir(new URL(folder, WEB), { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) found.push(...await jsFiles(path));
    else if (entry.isFile() && path.endsWith('.js') && !path.includes('/tests/')) found.push(path);
  }
  return found;
}

test('tutti i moduli JS applicativi sono importabili (main è verificato dagli e2e)', async () => {
  const files = [...await jsFiles('js'), ...await jsFiles('modules')].filter((file) => !file.endsWith('js/main.js'));
  assert.ok(files.length >= 30);
  for (const file of files) {
    const url = pathToFileURL(new URL(file, WEB).pathname);
    await assert.doesNotReject(() => import(url.href), relative('web', file));
  }
});
