// Each stage is selected directly; CSS transitions can reverse mid-flight.
(() => {
  const section = document.querySelector('#process');
  if (!section) return;
  const buttons = [...section.querySelectorAll('[data-process-stage]')];
  const captions = ['Drawing & feasibility', 'Cutting, forming & assembly', 'Finishing & dimensional checks'];
  const descriptions = ['An exploded technical drawing of a metal bracket', 'The bracket plates come together into an assembled metal part', 'The finished metal bracket with a dimensional inspection mark'];

  function select(index) {
    section.dataset.stage = String(index);
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.closest('.process-step').classList.toggle('is-active', i === index);
    });
    section.querySelector('[data-process-counter]').textContent = `STAGE 0${index + 1} / 03`;
    section.querySelector('[data-process-caption]').textContent = captions[index];
    section.querySelector('#part-scene-title').textContent = descriptions[index];
  }

  buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
  section.classList.add('process-enhanced');
  select(0);
})();
