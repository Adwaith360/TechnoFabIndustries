(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionPreference.matches;
  motionPreference.addEventListener('change', event => { reduceMotion = event.matches; });
  const canAnimate = Boolean(window.gsap && window.ScrollTrigger);
  const quoteDialog = $('#quote-dialog');
  const industryDialog = $('#industry-dialog');
  const form = $('#quote-form');
  let lastDialogTrigger = null;

  function setMenu(open) {
    const menu = $('#mobile-menu');
    menu.classList.toggle('open', open);
    menu.inert = !open;
    $('.menu-toggle').setAttribute('aria-expanded', String(open));
    $('.menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('dialog-open', open || Boolean($('dialog[open]')));
  }
  $('.menu-toggle').addEventListener('click', () => setMenu($('.menu-toggle').getAttribute('aria-expanded') !== 'true'));
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.matchMedia('(min-width: 801px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('.menu-toggle').getAttribute('aria-expanded') === 'true') { setMenu(false); $('.menu-toggle').focus(); }
    if (event.key === 'Tab' && $('.menu-toggle').getAttribute('aria-expanded') === 'true') {
      const links = $$('#mobile-menu a');
      if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); $('.menu-toggle').focus(); }
      else if (event.shiftKey && document.activeElement === $('.menu-toggle')) { event.preventDefault(); links.at(-1).focus(); }
    }
  });

  function showDialog(dialog, trigger) {
    setMenu(false);
    lastDialogTrigger = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    if (canAnimate && !reduceMotion) gsap.fromTo(dialog, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .3, ease: 'power2.out' });
  }
  function openQuote(service = '', trigger) {
    if (industryDialog.open) industryDialog.close();
    form.hidden = false;
    $('#quote-result').hidden = true;
    if (service) form.elements.service.value = service;
    showDialog(quoteDialog, trigger);
  }
  $$('[data-quote]').forEach(button => button.addEventListener('click', () => openQuote(button.dataset.quote, button)));
  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.toggle('dialog-open', Boolean($('dialog[open]')));
      if (!$('dialog[open]') && lastDialogTrigger?.isConnected) lastDialogTrigger.focus({ preventScroll: true });
    });
  });

  const serviceData = {
    fabrication: { image: 'fabrication', label: '01 / FABRICATION & ASSEMBLY', alt: 'Welded steel brackets and gusset reinforced assemblies' },
    laser: { image: 'laser-cutting', label: '02 / LASER CUTTING', alt: 'Laser cutting a steel plate with sparks at the cutting point' },
    bending: { image: 'cnc-bending', label: '03 / CNC BENDING', alt: 'CNC press brake forming a sheet metal bend' },
    coating: { image: 'coating', label: '04 / COATING', alt: 'Powder coated metal brackets and enclosures in red and black' }
  };
  function selectService(id) {
    const data = serviceData[id];
    if (!data) return;
    if ($('.service-item.active')?.dataset.serviceId === id) return;
    $$('.service-item').forEach(item => {
      const active = item.dataset.serviceId === id;
      item.classList.toggle('active', active);
      $('.service-trigger', item).setAttribute('aria-expanded', String(active));
      $('.service-symbol', item).textContent = active ? '−' : '+';
      $('.service-panel', item).hidden = !active;
    });
    $$('[data-image-service]').forEach(button => {
      const active = button.dataset.imageService === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (canAnimate && !reduceMotion) {
      gsap.fromTo(`#service-${id}`, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, overwrite: true });
      ScrollTrigger.refresh();
    }
  }
  $$('.service-trigger').forEach(button => button.addEventListener('click', () => selectService(button.closest('.service-item').dataset.serviceId)));
  $$('[data-service]').forEach(link => link.addEventListener('click', () => selectService(link.dataset.service)));
  const imagePanels = $$('[data-image-service]');
  imagePanels.forEach((button, index) => {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches && !$('.service-list').contains(document.activeElement)) selectService(button.dataset.imageService);
    });
    button.addEventListener('click', () => selectService(button.dataset.imageService));
    button.addEventListener('focus', () => selectService(button.dataset.imageService));
    button.addEventListener('keydown', event => {
      const keys = { ArrowRight: (index + 1) % imagePanels.length, ArrowDown: (index + 1) % imagePanels.length, ArrowLeft: (index - 1 + imagePanels.length) % imagePanels.length, ArrowUp: (index - 1 + imagePanels.length) % imagePanels.length, Home: 0, End: imagePanels.length - 1 };
      if (event.key in keys) { event.preventDefault(); imagePanels[keys[event.key]].focus({ preventScroll: true }); }
    });
  });

  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    $$('.industry-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
    if (canAnimate && !reduceMotion) { gsap.fromTo('.industry-card:not([hidden])', { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .045, duration: .4, overwrite: true }); ScrollTrigger.refresh(); }
  }));

  const applications = {
    structural: { title: 'Structural & heavy-duty fabrication', intro: 'Metal components for structural assemblies, equipment supports and installation work.', list: ['Base & anchor plates — custom profiles, fixing holes and welded base assemblies.', 'Gusset-reinforced brackets — multi-rib welded brackets, stiffener plates and support ribs.', 'Connection components — splice plates, cleats, end plates and heavy-duty brackets.', 'Fabricated supports — welded pedestals, mounting supports and frame joints.'], note: 'Supply your approved design, load requirements, material grade and weld details. Structural suitability follows the customer-approved engineering design.' },
    electrical: { title: 'Electrical & electronics', intro: 'Sheet metal solutions for electrical equipment, panel builders and system integrators.', list: ['Enclosures & cabinets — control panel bodies, doors and equipment housings.', 'Junction & terminal boxes — custom box sizes, cable entries and mounting provisions.', 'Trays & mounting plates — cable tray accessories, gland plates and backplates.', 'Covers & ventilation panels — perforated panels, protective covers and formed channels.'], note: 'Specify cut-outs, hardware, coating and protection requirements. IP ratings or other certifications are supplied only when explicitly agreed and validated.' },
    automation: { title: 'Automation & OEM equipment', intro: 'Custom metalwork for automation builders, special purpose machines and production lines.', list: ['Machine frames & bases — welded support frames, equipment bases and pedestals.', 'Sensor & motor brackets — slotted mounts, formed brackets and adjustment plates.', 'Guards & machine covers — sheet metal panels, access covers and enclosure parts.', 'Assembly line components — trays, fixture plates, guide brackets and support structures.'], note: 'Send interface dimensions and critical datums so mounting, access and assembly requirements are reviewed before production.' },
    mechanical: { title: 'Mechanical components & flanges', intro: 'Drawing-based plate components for machinery, fabrication and mechanical assemblies.', list: ['Flanges & annular rings — bolt-hole patterns, cut rings and custom plate flanges.', 'Mounting & adapter plates — motor mounts, interface plates and bolt-on adapters.', 'Brackets & clevis plates — formed brackets, support plates and connecting profiles.', 'Spacers & reinforcement plates — profile-cut shims, stiffeners and layered plate components.'], note: 'Laser-cut plate flanges are supplied to drawing. Pressure-service, sealing faces, machining and testing requirements must be specified separately.' },
    architectural: { title: 'Architectural & civil metalwork', intro: 'Fabricated metal components for fit-outs, facades and construction-related assemblies.', list: ['Screens & perforated panels — decorative patterns, privacy panels and feature metalwork.', 'Cladding & folded profiles — bespoke trims, folded sections and sheet metal details.', 'Fixing & support brackets — facade brackets, cleats, anchor plates and connectors.', 'Gates, railings & signage parts — cut infill panels, sign blanks and fabricated metal details.'], note: 'Discuss pattern, panel size, fixing points, outdoor exposure and finish. Components are manufactured to approved installation and structural details.' },
    process: { title: 'Machinery & process industries', intro: 'Custom assemblies and metal components for equipment builders and industrial users.', list: ['Hoppers & chutes — formed and welded parts for material handling equipment.', 'Skids, frames & supports — equipment support structures and fabricated machine bases.', 'Covers, trays & guards — application-specific sheet metal fabrication.', 'Custom welded assemblies — drawing-based combinations of cut, bent and welded parts.'], note: 'Food, pharmaceutical and process applications require agreed material grades, surface finishes, weld requirements and cleaning specifications.' }
  };
  $$('.industry-card').forEach(card => card.addEventListener('click', () => {
    const id = card.dataset.industry;
    const data = applications[id];
    $('#industry-title').textContent = data.title;
    $('#industry-detail-intro').textContent = data.intro;
    $('#industry-detail-note').textContent = data.note;
    $('#industry-detail-image').src = `/assets/${id}.webp`;
    $('#industry-detail-image').alt = $('img', card).alt;
    $('#industry-detail-list').replaceChildren(...data.list.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    showDialog(industryDialog, card);
    industryDialog.scrollTop = 0;
  }));
  $('#industry-enquire').addEventListener('click', () => {
    const title = $('#industry-title').textContent;
    const trigger = lastDialogTrigger;
    if (!form.elements.details.value.trim()) form.elements.details.value = `Application: ${title}\n`;
    $('.optional-enquiry').open = true;
    openQuote('Multiple services / not sure', trigger);
  });

  const contactInput = form.elements.contact;
  function validReplyContact(value) {
    const text = value.trim();
    if (text.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    const digits = text.replace(/\D/g, '');
    return /^\+?[\d\s().-]+$/.test(text) && digits.length >= 7 && digits.length <= 15;
  }
  contactInput.addEventListener('input', () => {
    contactInput.setCustomValidity('');
    $('#submit-status').textContent = '';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    contactInput.setCustomValidity(validReplyContact(contactInput.value) ? '' : 'Enter a valid phone number or email address.');
    if (!form.reportValidity()) return;
    const status = $('#submit-status');
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      status.textContent = 'Preview only: enquiries are not being sent yet. Your details have not been submitted.';
      return;
    }
    const button = $('button[type="submit"]', form);
    if (button.disabled) return;
    button.disabled = true;
    button.textContent = 'Submitting…';
    status.textContent = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();
      if (result.success !== true) throw new Error('Submission not confirmed');
      form.hidden = true;
      $('#quote-result').hidden = false;
      $('#quote-result').focus();
      quoteDialog.scrollTop = 0;
      form.reset();
    } catch {
      status.textContent = 'We couldn’t confirm your enquiry was received. Your details are still here. Please try again.';
    } finally {
      button.disabled = false;
      button.textContent = 'Submit';
    }
  });
  $('#year').textContent = new Date().getFullYear();

  if (canAnimate) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      if ($('.hero')) gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-topline', { y: 10, opacity: 0, duration: .6 }, .05)
        .from('.hero h1 .line > span', { yPercent: 115, rotate: 2, duration: 1.1, stagger: .13 }, .1)
        .from('.hero-intro > *', { y: 22, opacity: 0, duration: .75, stagger: .12 }, .65)
        .from('.hero-bottom', { y: 15, opacity: 0, duration: .7 }, .9)
        .from('.hero-photo', { opacity: 0, duration: 1.2 }, .1);
      if ($('.hero')) gsap.to('.hero-photo > img', { yPercent: 12, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      $$('.reveal').forEach(el => gsap.from(el, { y: 30, opacity: 0, duration: .75, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 91%', once: true } }));
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .15 } });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
})();

// Lightweight native adaptations of Magic UI interaction patterns.
// No React runtime, remote assets, polling, or idle animation loops.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};
  function setup() {
    cleanup();
    if (preference.matches) return;
    const controller = new AbortController();
    const { signal } = controller;
    const running = new Set();
    const decorations = new Set();
    document.documentElement.classList.add('enhanced-motion');
    const animate = (el, frames, options) => {
      const animation = el.animate(frames, options);
      running.add(animation);
      animation.finished.catch(() => {}).finally(() => running.delete(animation));
      return animation;
    };

    // Ripple feedback follows both pointer and keyboard activation.
    document.addEventListener('click', event => {
      const button = event.target.closest('.button, .filter');
      if (!button || button.disabled || document.hidden) return;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('i');
      ripple.className = 'motion-ripple';
      ripple.setAttribute('aria-hidden', 'true');
      const x = event.detail ? event.clientX - rect.left : rect.width / 2;
      const y = event.detail ? event.clientY - rect.top : rect.height / 2;
      Object.assign(ripple.style, { width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px` });
      button.append(ripple);
      decorations.add(ripple);
      animate(ripple, [{ transform: 'scale(0)', opacity: .3 }, { transform: 'scale(1)', opacity: 0 }], { duration: 480, easing: 'ease-out' }).finished.catch(() => {}).finally(() => { ripple.remove(); decorations.delete(ripple); });
    }, { signal });

    // Spotlight coordinates update only during an actual mouse movement.
    let frame = 0;
    let pending = null;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    document.querySelectorAll('.service-item').forEach(item => {
      item.addEventListener('pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const rect = item.getBoundingClientRect();
        pending = { item, x: event.clientX - rect.left, y: event.clientY - rect.top };
        if (!frame) frame = requestAnimationFrame(() => {
          frame = 0;
          if (!pending) return;
          pending.item.style.setProperty('--spot-x', `${pending.x}px`);
          pending.item.style.setProperty('--spot-y', `${pending.y}px`);
          pending = null;
        });
      }, { signal, passive: true });
    });

    // Short, one-time entrances; underlying content is never CSS-hidden.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || document.hidden) return;
        const el = entry.target;
        observer.unobserve(el);
        if (el.matches('.industry-img')) {
          animate(el, [{ opacity: .45, transform: 'translateY(12px)', filter: 'blur(2px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.3,1)' });
        } else if (el.matches('.quote-checklist')) {
          el.querySelectorAll('li').forEach((li, i) => animate(li, [{ opacity: .4, transform: 'translateX(14px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 380, delay: i * 65, easing: 'ease-out' }));
        } else if (el.matches('.service-visual')) {
          const beam = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          beam.classList.add('motion-border');
          beam.setAttribute('aria-hidden', 'true');
          const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          for (const [key, value] of Object.entries({ x: '1', y: '1', width: '99.5%', height: '99.5%', pathLength: '100', fill: 'none', stroke: '#f46a38', 'stroke-width': '2', 'stroke-dasharray': '14 86' })) outline.setAttribute(key, value);
          beam.append(outline); el.append(beam); decorations.add(beam);
          animate(outline, [{ strokeDashoffset: '100', opacity: 0 }, { opacity: 1, offset: .15 }, { strokeDashoffset: '0', opacity: 0 }], { duration: 2400, easing: 'ease-in-out' }).finished.catch(() => {}).finally(() => { beam.remove(); decorations.delete(beam); });
        }
      });
    }, { threshold: .18 });
    document.querySelectorAll('.industry-img, .quote-checklist, .service-visual').forEach(el => observer.observe(el));
    const visibility = () => {
      running.forEach(animation => document.hidden ? animation.pause() : animation.play());
      document.documentElement.classList.toggle('motion-paused', document.hidden);
    };
    document.addEventListener('visibilitychange', visibility, { signal });
    cleanup = () => {
      controller.abort(); observer.disconnect(); cancelAnimationFrame(frame);
      running.forEach(animation => animation.cancel());
      decorations.forEach(el => el.remove());
      document.documentElement.classList.remove('enhanced-motion', 'motion-paused');
    };
  }
  preference.addEventListener('change', setup);
  setup();
})();

(() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const animations=new Set();
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(preference.matches)return;
   const animation=entry.target.animate([{opacity:.3,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
   animations.add(animation);animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
  });
 },{threshold:.12});
 document.querySelectorAll('.page-card,.material-row,.contact-details,.about-foot').forEach(el=>observer.observe(el));
 preference.addEventListener('change',()=>{if(preference.matches)animations.forEach(a=>a.cancel())});
 document.addEventListener('visibilitychange',()=>animations.forEach(a=>document.hidden?a.pause():a.play()));
})();

(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => document.querySelectorAll('.testimonial-carousel').forEach(carousel => {
    carousel.classList.toggle('is-animated', !preference.matches);
  });
  preference.addEventListener('change', update);
  update();
})();

// One-time footer entrance. Content remains visible without JavaScript.
(() => {
  const footer = document.querySelector('.footer');
  if (!footer || !('IntersectionObserver' in window)) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const play = (element, frames, options) => {
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  };
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    if (preference.matches) return;
    footer.classList.add('footer-arrived');
    footer.querySelectorAll('.footer-letter').forEach((letter, i) => {
      play(letter, [{ transform: 'translateY(105%)', opacity: .15 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 850, delay: i * 45, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    });
    play(footer.querySelector('.footer-plus'), [{ transform: 'rotate(-90deg)', opacity: 0 }, { transform: 'rotate(0)', opacity: 1 }], { duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)' });
  }, { threshold: .2 });
  observer.observe(footer);
  preference.addEventListener('change', () => {
    if (preference.matches) animations.forEach(animation => animation.cancel());
  });
  document.addEventListener('visibilitychange', () => animations.forEach(animation => document.hidden ? animation.pause() : animation.play()));
})();
