import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync(new URL('./weird/index.html', import.meta.url), 'utf8');

function levelLabels() {
  const block = html.match(/const levels = \[([\s\S]*?)\n      \];/);
  assert.ok(block, 'levels array is present');
  return [...block[1].matchAll(/label: '([^']+)'/g)].map((match) => match[1]);
}

test('wheel provides twelve all-unhinged outcomes', () => {
  const labels = levelLabels();
  assert.equal(labels.length, 12);
  assert.equal(labels[0], 'QUESTIONABLE ENERGY');
  assert.equal(labels.at(-1), 'MAXIMUM WEIRD');
  assert.equal(labels.some((label) => /tame|mild|lightly|normal|sensible|safe/i.test(label)), false);
});

test('wheel contains only abstract intensity labels, not dares', () => {
  const labels = levelLabels();
  const prohibited = /\b(?:drink|kiss|text|call|remove|take off|buy|eat|go to|steal)\b/i;
  assert.equal(labels.some((label) => prohibited.test(label)), false);
});

test('interactive controls and accessible result region exist', () => {
  assert.match(html, /<canvas id="wheel"/);
  assert.match(html, /id="spin" type="button"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /How unhinged are we getting\?/i);
  assert.match(html, /Spin the chaos wheel/i);
});

test('page is self-contained', () => {
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+(?:stylesheet|preconnect)/i);
  assert.doesNotMatch(html, /<img[^>]+src=["']https?:/i);
});
