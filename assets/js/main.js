(() => {
  'use strict';

  const PHP_PER_USD = 62.685;
  // WEB3FORMS CONFIGURATION: paste your public form access key here before launch.
  // Get this form key from https://web3forms.com/ (never use an email password).
  const WEB3FORMS = Object.freeze({
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '4945add8-1438-4d9a-87ad-0394ff36335a'
  });

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

  const calculators = new Map();
  document.querySelectorAll('[data-builder]').forEach((builder) => {
    const rows = [...builder.querySelectorAll('.builder-item')];
    const usdOutput = builder.querySelector('[data-total-usd]');
    const phpOutput = builder.querySelector('[data-total-php]');

    const calculate = () => {
      let total = 0;
      const selected = [];
      const items = [];

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
          items.push({
            service: label ? label.textContent.trim() : 'Service',
            quantity, unit_price_usd: price, subtotal_usd: price * quantity
          });
        }
      });

      if (usdOutput) usdOutput.textContent = `$${total.toLocaleString('en-US')} USD`;
      if (phpOutput) phpOutput.textContent = `approximately ${formatPHP(total)} PHP`;

      builder.dataset.selectedServices = selected.join('; ');
      builder.dataset.totalUsd = String(total);
      return { items, total };
    };

    calculators.set(builder, calculate);
    builder.addEventListener('input', calculate);
    builder.addEventListener('change', calculate);
    calculate();
  });

  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');

  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonLabel = submitButton.textContent;
    let submitting = false;
    const showStatus = (message, error = false) => {
      if (!status) return;
      status.textContent = message;
      status.style.color = error ? '#cf3d0d' : '';
    };
    // Support the existing HTML without requiring any markup replacement.
    if (status) {
      status.setAttribute('role', 'status');
      showStatus('No payment is required to submit an inquiry.');
    }
    if (!form.querySelector('[name="botcheck"]')) {
      const honeypot = document.createElement('input');
      honeypot.type = 'checkbox';
      honeypot.name = 'botcheck';
      honeypot.tabIndex = -1;
      honeypot.setAttribute('aria-hidden', 'true');
      honeypot.style.display = 'none';
      form.appendChild(honeypot);
    }
    submitButton.disabled = false;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitting) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        showStatus('Please complete the required fields before submitting.', true);
        return;
      }

      if (!WEB3FORMS.accessKey.trim() || WEB3FORMS.accessKey === 'YOUR_ACCESS_KEY_HERE') {
        showStatus('Quote requests are temporarily unavailable. Please try again later. Your details have not been sent.', true);
        return;
      }

      const data = new FormData(form);
      if (data.get('botcheck')) return;
      // Preserve every named field, including every value of repeated checkboxes.
      const payload = {};
      for (const name of new Set(data.keys())) {
        payload[name] = data.getAll(name).join('; ');
      }
      const customBuilder = form.querySelector('[data-builder]');
      const quote = customBuilder
        ? calculators.get(customBuilder)()
        : { items: [], total: 0 };
      const packageSummary = quote.items.map((item) =>
        `${item.service} x ${item.quantity} | $${item.unit_price_usd} USD each | $${item.subtotal_usd} USD subtotal`
      ).join('\n') || 'No custom services selected';
      Object.assign(payload, {
        access_key: WEB3FORMS.accessKey.trim(),
        subject: 'New Work With Roi Quote Request',
        from_name: 'Work With Roi Website',
        needs: payload.needs || 'No services selected',
        custom_package: packageSummary,
        custom_package_items: JSON.stringify(quote.items),
        estimated_total_usd: quote.total.toFixed(2),
        estimated_total_php: (quote.total * PHP_PER_USD).toFixed(2),
        php_per_usd: String(PHP_PER_USD),
        custom_package_estimate: `${packageSummary}\nEstimated starting total: $${quote.total} USD (approximately ${formatPHP(quote.total)} PHP)`,
        pricing_note: 'Estimated starting prices only. Final pricing is confirmed after scope review.'
      });

      submitting = true;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      showStatus('Sending your quote request…');
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(WEB3FORMS.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Submission rejected');
        showStatus('Thank you! Your quote request has been sent. I’ll review your details and follow up with you.');
      } catch (error) {
        showStatus(error.name === 'AbortError'
          ? 'The request timed out and delivery could not be confirmed. Your details are still here. Please wait a moment before trying again.'
          : 'We could not confirm that your request was sent. Your details are still here. Please check your connection and try again.', true);
      } finally {
        window.clearTimeout(timeout);
        submitting = false;
        submitButton.disabled = false;
        submitButton.textContent = buttonLabel;
        form.removeAttribute('aria-busy');
      }
    });
  }
})();
