'use strict';
// Execute the production mapping in isolation; this runner has no HTTP, browser,
// credentials, Supabase clients, or service dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repo = path.resolve(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'compare-gear-slots.json'), 'utf8'));
const elements = new Map();
const context = vm.createContext({
  window: {},
  $: id => {
    if (!elements.has(id)) elements.set(id, {addEventListener() {}});
    return elements.get(id);
  }
});
vm.runInContext(fs.readFileSync(path.join(repo, 'compare', 'scouting.js'), 'utf8'), context, {
  filename: 'compare/scouting.js', timeout: 1000
});
assert.equal(typeof context.window.KvkScouting?.gearTiles, 'function');
const slots = ['helmet', 'gloves', 'armour', 'boots'];
const titles = ['Helmet', 'Gloves', 'Armour', 'Boots'];
const byId = new Map(fixture.cases.map(value => [value.id, value]));

function expectedTiles(value) {
  const inherited = value.expectedFrom ? byId.get(value.expectedFrom)?.expected : {};
  assert.ok(inherited, 'Fixture inheritance must refer to an existing fixture');
  const entries = {...inherited, ...value.expected};
  return slots.map((slot, index) => ({
    slot, title: titles[index], state: value.defaultState || 'Unavailable',
    tier: null, enhancement: '—', mastery: '—', artwork: null,
    ...entries[slot]
  }));
}

let orderings = 0;
for (const value of fixture.cases) {
  const variants = [{name: 'original', hero: value.hero}];
  if (Array.isArray(value.hero.gear) && value.hero.gear.length > 1) {
    variants.push({name: 'reversed', hero: {...value.hero, gear: [...value.hero.gear].reverse()}});
    variants.push({name: 'rotated', hero: {...value.hero, gear: [...value.hero.gear.slice(1), value.hero.gear[0]]}});
  }
  for (const variant of variants) {
    const input = JSON.parse(JSON.stringify(variant.hero));
    const before = JSON.stringify(input);
    const actual = JSON.parse(JSON.stringify(context.window.KvkScouting.gearTiles(input)));
    const label = value.id + ' [' + variant.name + ']';
    assert.deepEqual(actual, expectedTiles(value), label);
    assert.equal(JSON.stringify(input), before, label + ': mapping must not mutate source metadata');
    orderings++;
  }
  console.log('PASS ' + value.id);
}
console.log(`All ${fixture.cases.length} gear-slot fixtures passed (${orderings} input orderings); production mapping executed offline.`);
