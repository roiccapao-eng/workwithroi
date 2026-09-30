(() => {
  'use strict';

  const PHP_PER_USD = 62.685;
  // Add a Formspree, Web3Forms, or similar HTTPS endpoint here before launch.
  const FORM_ENDPOINT = '';

  const formatPHP = (usd) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(usd * PHP_PER_USD);

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      siteNav.classList.remove('open');
      document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      siteNav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  document.querySelectorAll('[data-builder]').forEach((builder) => {
    const rows = [...builder.querySelectorAll('.builder-item')];
    const usdOutput = builder.querySelector('[data-total-usd]');
    const phpOutput = builder.querySelector('[data-total-php]');

    const calculate = () => {
      let total = 0;
      const selected = [];

      rows.forEach((row) => {
        const checkbox = row.querySelector('input[type="checkbox"][data-price]');
        const qty = row.querySelector('[data-qty]');
        const label = row.querySelector('label');
        if (!checkbox || !qty) return;

        if (checkbox.checked) {
          const quantity = Math.max(1, Number(qty.value) || 1);
          const price = Number(checkbox.dataset.price) || 0;
          total += price * quantity;
          selected.push(`${label ? label.textContent.trim() : 'Service'} x ${quantity}`);
        }
      });

      if (usdOutput) usdOutput.textContent = `$${total.toLocaleString('en-US')} USD`;
      if (phpOutput) phpOutput.textContent = `approximately ${formatPHP(total)} PHP`;

      builder.dataset.selectedServices = selected.join('; ');
      builder.dataset.totalUsd = String(total);
    };

    builder.addEventListener('change', calculate);
    calculate();
  });

  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');

  if (form) {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        if (status) status.textContent = 'Please complete the required fields before submitting.';
        return;
      }

      const customBuilder = form.querySelector('[data-builder]');
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'custom_package_estimate';
      hidden.value = customBuilder
        ? `${customBuilder.dataset.selectedServices || 'No custom services selected'} | $${customBuilder.dataset.totalUsd || '0'} USD (approximately ${formatPHP(Number(customBuilder.dataset.totalUsd || 0))} PHP)`
        : 'No custom package selected';
      form.appendChild(hidden);

      if (!FORM_ENDPOINT) {
        event.preventDefault();
        if (status) {
          status.textContent = 'This demo is ready for an external form endpoint. Add it in assets/js/main.js before launch.';
          status.style.color = '#cf3d0d';
        }
        return;
      }

      form.action = FORM_ENDPOINT;
    });
  }
})();
