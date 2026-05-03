// Shared site footer. Inject once on DOMContentLoaded into any
// <footer data-site-footer></footer> placeholder.
(function () {
  const HTML = `
    <div class="footer-links">
      <a class="social-btn" href="https://www.linkedin.com/in/yaniv-proselkov/" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
        LinkedIn
      </a>
      <a class="social-btn" href="https://scholar.google.com/citations?user=ePHr-8wAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 12.08L4.5 11l-1.5.82v5.36C4.54 19.07 8.02 21 12 21s7.46-1.93 9-4.82v-5.36L19.5 11 12 15.08z"/></svg>
        Google Scholar
      </a>
      <a class="social-btn" href="https://www.researchgate.net/profile/Yaniv-Proselkov" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.586 0H4.414A4.414 4.414 0 0 0 0 4.414v15.172A4.414 4.414 0 0 0 4.414 24h15.172A4.414 4.414 0 0 0 24 19.586V4.414A4.414 4.414 0 0 0 19.586 0zM8.5 17.5H6.75V9.25H8.5v8.25zm-.875-9.5a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1zm10.125 9.5h-1.75v-4.6c0-1.1-.4-1.85-1.4-1.85-.76 0-1.21.51-1.41 1.01-.07.18-.09.43-.09.68v4.76h-1.75s.02-7.72 0-8.25h1.75v1.17c.23-.36.65-.87 1.58-.87 1.15 0 2.07.75 2.07 2.36v5.59z"/></svg>
        ResearchGate
      </a>
    </div>
    <p class="footer-copy">&copy; ${new Date().getFullYear()} Dr. Yaniv Proselkov</p>
  `;

  function render() {
    document.querySelectorAll('footer[data-site-footer]').forEach((el) => {
      el.classList.add('site-footer');
      el.innerHTML = HTML;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
