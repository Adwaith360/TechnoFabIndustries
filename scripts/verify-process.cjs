const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = fs.readFileSync('public/process.js', 'utf8');

function environment(reduce = false) {
  const element = () => {
    const classes = new Set();
    return { dataset: {}, attrs: {}, events: {}, textContent: '',
      classList: { add: name => classes.add(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name), contains: name => classes.has(name) },
      setAttribute(name, value) { this.attrs[name] = value; },
      addEventListener(name, callback) { this.events[name] = callback; }
    };
  };
  const steps = Array.from({ length: 3 }, element);
  const buttons = steps.map(step => Object.assign(element(), { closest: () => step }));
  const section = element();
  const children = Object.fromEntries(['.process-play', '[data-play-label]', '[data-play-icon]', '[data-process-counter]', '[data-process-caption]', '#part-scene-title', '.process-workbench'].map(key => [key, element()]));
  section.querySelector = key => children[key];
  section.querySelectorAll = () => buttons;
  const document = Object.assign(element(), { hidden: false, querySelector: () => section });
  const preference = Object.assign(element(), { matches: reduce });
  let observer;
  let now = 0;
  let id = 0;
  const timers = new Map();
  vm.runInNewContext(code, {
    document, matchMedia: () => preference, performance: { now: () => now },
    setTimeout: (callback, delay) => { timers.set(++id, { callback, due: now + delay }); return id; },
    clearTimeout: key => timers.delete(key),
    IntersectionObserver: class { constructor(callback) { observer = callback; } observe() {} }
  });
  return { section, steps, buttons, children, document, preference, timers,
    visible(value) { observer([{ isIntersecting: value }]); },
    advance(ms) {
      now += ms;
      for (const [key, timer] of [...timers]) if (timer.due <= now) { timers.delete(key); timer.callback(); }
    }
  };
}
const app = environment();
assert.equal(app.timers.size, 0, 'No timer before entering the viewport');
app.visible(true);
app.advance(6000);
assert.equal(app.section.dataset.stage, '1');
assert.equal(app.buttons[1].attrs['aria-pressed'], 'true');
assert.equal(app.buttons.filter(button => button.attrs['aria-pressed'] === 'true').length, 1);
app.advance(2000);
app.visible(false);
assert.equal(app.timers.size, 0, 'Off-screen animation must stop');
app.advance(20000);
assert.equal(app.section.dataset.stage, '1');
app.visible(true);
app.advance(4000);
assert.equal(app.section.dataset.stage, '2', 'Resume after the remaining stage time');
app.advance(6000);
assert.equal(app.section.dataset.stage, '0', 'Sequence loops back to the drawing');
app.buttons[2].events.click();
assert.equal(app.section.dataset.stage, '2');
assert.equal(app.timers.size, 0, 'Manual selection stays on the chosen stage');
assert.equal(app.children['.process-play'].attrs['aria-label'], 'Play process animation');
app.children['.process-play'].events.click();
assert.equal(app.timers.size, 1);
app.document.hidden = true;
app.document.events.visibilitychange();
assert.equal(app.timers.size, 0, 'Hidden browser tab must stop');
app.document.hidden = false;
app.document.events.visibilitychange();
assert.equal(app.timers.size, 1);
app.children['.process-play'].events.click();
assert.equal(app.timers.size, 0, 'Pause control stops playback');
const reduced = environment(true);
reduced.visible(true);
reduced.advance(20000);
assert.equal(reduced.section.dataset.stage, '0');
assert.equal(reduced.timers.size, 0, 'Reduced motion disables automatic cycling');
reduced.buttons[1].events.click();
assert.equal(reduced.section.dataset.stage, '1', 'Manual selection works with reduced motion');
vm.runInNewContext(code, { document: { querySelector: () => null } });
console.log('Process behavior verified: cycling, selection, pause/resume, off-screen and tab suspension, reduced motion, absent section.');
