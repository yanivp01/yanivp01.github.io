/* Essays index renderer — reads data/essays.json and builds the blog list. */
(function () {
  'use strict';

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function renderCard(item) {
    const card = el('article', { class: 'essay-card' + (item.cover ? ' has-image' : '') });

    if (item.cover) {
      const a = el('a', { href: item.page, class: 'essay-thumb-link', 'aria-label': item.title });
      const fig = el('figure', { class: 'essay-thumb' }, [
        el('img', { src: item.cover.src, alt: item.cover.alt || '', loading: 'lazy' })
      ]);
      a.appendChild(fig);
      card.appendChild(a);
    }

    const body = el('div', { class: 'essay-body' });
    body.appendChild(el('h2', {}, [
      el('a', { href: item.page, text: item.title })
    ]));

    const meta = el('div', { class: 'essay-meta' });
    if (item.date) meta.appendChild(el('time', { datetime: item.date, text: formatDate(item.date) }));
    body.appendChild(meta);

    if (item.summary) body.appendChild(el('p', { class: 'essay-summary', text: item.summary }));

    if (Array.isArray(item.tags) && item.tags.length) {
      const tags = el('div', { class: 'essay-tags' });
      item.tags.forEach(t => tags.appendChild(el('span', { text: t })));
      body.appendChild(tags);
    }

    const actions = el('div', { class: 'essay-actions' });
    actions.appendChild(el('a', { href: item.page, class: 'pdf-link', text: 'Read essay →' }));
    if (item.linkedin) {
      actions.appendChild(el('a', {
        href: item.linkedin,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'ext-link',
        text: 'LinkedIn ↗'
      }));
    }
    body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  function render(data, mountEl) {
    mountEl.innerHTML = '';
    const items = (data.essays || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    items.forEach(item => mountEl.appendChild(renderCard(item)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('essays-mount');
    if (!mount) return;
    fetch('data/essays.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => render(data, mount))
      .catch(err => {
        mount.appendChild(el('p', {
          style: 'color:var(--color-muted);font-size:.9rem;'
        }, 'Could not load essays list: ' + err.message));
      });
  });
})();
