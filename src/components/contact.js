/**
 * Contact Component
 * Real message delivery via Form Endpoint, Mailto & Web Gmail Compose
 */

import { contactData, siteConfig } from '../data/site.js';

export function renderContact(container) {
  if (!container) return;

  const headlineHtml = contactData.headline
    .map((line, idx) => {
      const isLast = idx === contactData.headline.length - 1;
      const content = isLast ? `<span class="acc">${line}</span>` : line;
      return `<span class="line-mask"><span class="line">${content}</span></span>`;
    })
    .join('');

  const socialsHtml = siteConfig.socials
    .map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="channel-link">${s.label} ↗</a>`)
    .join('');

  container.innerHTML = `
    <section id="contact" aria-label="Contact">
      <div class="contact-grid">
        <div class="contact-left">
          <span class="sec-tag">${contactData.tag}</span>
          <h2>${headlineHtml}</h2>
          <p class="sub" style="margin-top:1rem">${contactData.subtext}</p>

          <form id="contact-form" novalidate>
            <input type="text" name="_gotcha" class="sr-only" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div>
              <input type="text" name="name" placeholder="YOUR NAME" required autocomplete="name" aria-label="Your Name">
            </div>
            <div>
              <input type="email" name="email" placeholder="YOUR EMAIL" required autocomplete="email" aria-label="Your Email">
            </div>
            <div>
              <textarea name="message" rows="3" placeholder="WHAT'S ON YOUR MIND? (PROJECT, IDEA, COLLABORATION)" required aria-label="Your Message"></textarea>
            </div>
            <button type="submit" id="contact-submit-btn">${contactData.submitLabel}</button>
            <div id="contact-status" class="contact-status" aria-live="polite"></div>
          </form>
        </div>

        <div class="contact-right">
          <span class="contact-channels-title">// DIRECT CHANNELS</span>
          <div class="contact-channels">
            <a href="mailto:${siteConfig.email}" class="channel-link">EMAIL ↗</a>
            ${socialsHtml}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initContact() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');
  const submitBtn = document.getElementById('contact-submit-btn');
  if (!form || !statusEl || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const msgInput = form.querySelector('textarea[name="message"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !email || !emailInput.validity.valid || !message) {
      statusEl.className = 'contact-status status-error';
      statusEl.textContent = !name ? 'Please enter your name.' : (!email || !emailInput.validity.valid) ? 'Please enter a valid email address.' : 'Please enter your message.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'PREPARING MESSAGE...';
    statusEl.textContent = '';

    if (contactData.endpoint) {
      try {
        submitBtn.textContent = 'SENDING MESSAGE...';
        const res = await fetch(contactData.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message, _subject: `Portfolio Message from ${name}` })
        });
        if (res.ok) {
          form.reset();
          submitBtn.textContent = contactData.successMessage;
          statusEl.className = 'contact-status status-success';
          statusEl.innerHTML = `✓ Message delivered! I will reply to <b>${email}</b> soon.`;
          setTimeout(() => { submitBtn.textContent = contactData.submitLabel; submitBtn.disabled = false; }, 5000);
          return;
        }
      } catch (err) {
        console.warn('API delivery unavailable, falling back to direct email:', err);
      }
    }

    // Direct mailto & webmail delivery
    const subject = `Portfolio Inquiry: ${name}`;
    const body = `Hi Abhijeet,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`;
    const mailtoUrl = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    submitBtn.textContent = 'MESSAGE DRAFTED ✓';
    statusEl.className = 'contact-status status-info';
    statusEl.innerHTML = `
      <div class="status-box">
        <p class="status-head">✓ Draft opened in your email app</p>
        <p class="status-sub">If your mail app didn't open automatically, use these direct options:</p>
        <div class="status-btns">
          <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="status-link-btn">OPEN IN GMAIL ↗</a>
          <button type="button" class="status-copy-btn">COPY MESSAGE 📋</button>
        </div>
      </div>
    `;

    const copyBtn = statusEl.querySelector('.status-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(`To: ${siteConfig.email}\nSubject: ${subject}\n\n${body}`);
        copyBtn.textContent = 'COPIED TO CLIPBOARD ✓';
        setTimeout(() => { copyBtn.textContent = 'COPY MESSAGE 📋'; }, 3000);
      });
    }

    setTimeout(() => {
      submitBtn.textContent = contactData.submitLabel;
      submitBtn.disabled = false;
    }, 5000);
  });
}
