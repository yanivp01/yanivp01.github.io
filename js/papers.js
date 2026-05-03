/* Papers page renderer — reads data/papers.json and builds the categorised list. */
(function () {
  'use strict';

  const LINK_DEFAULTS = {
    pdf:      { label: '⬇ Read PDF',  cls: 'pdf-link', external: true  },
    ext:      { label: 'Link',        cls: 'ext-link', external: true  },
    internal: { label: 'Open',        cls: 'pdf-link', external: false }
  };

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

  function renderLink(link) {
    const cfg = LINK_DEFAULTS[link.kind] || LINK_DEFAULTS.ext;
    const attrs = {
      class: cfg.cls,
      href: link.href
    };
    if (cfg.external) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }
    return el('a', attrs, link.label || cfg.label);
  }

  function renderCard(item) {
    const card = el('div', { class: 'paper-card' + (item.image ? ' has-image' : '') });
    if (item.image) {
      const fig = el('figure', { class: 'paper-thumb' }, [
        el('img', { src: item.image.src, alt: item.image.alt || '', loading: 'lazy' })
      ]);
      card.appendChild(fig);
    }
    const body = el('div', { class: 'paper-body' });
    body.appendChild(el('h3', { text: item.title }));
    if (item.byline) body.appendChild(el('span', { class: 'byline', text: item.byline }));
    (item.links || []).forEach(link => body.appendChild(renderLink(link)));
    card.appendChild(body);
    return card;
  }

  function renderCategory(cat) {
    const wrap = el('div', { class: 'papers-category', id: cat.id });
    wrap.appendChild(el('h2', { text: cat.title }));
    if (cat.image) {
      const fig = el('figure', { class: 'category-image' }, [
        el('img', { src: cat.image.src, alt: cat.image.alt || '', loading: 'lazy' })
      ]);
      if (cat.image.caption) fig.appendChild(el('figcaption', { text: cat.image.caption }));
      wrap.appendChild(fig);
    }
    (cat.items || []).forEach(item => wrap.appendChild(renderCard(item)));
    return wrap;
  }

  function render(data, mountEl) {
    mountEl.innerHTML = '';
    (data.categories || []).forEach(cat => mountEl.appendChild(renderCategory(cat)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('papers-mount');
    if (!mount) return;
    fetch('data/papers.json', { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => render(data, mount))
      .catch(err => {
        mount.appendChild(el('p', {
          style: 'color:var(--color-muted);font-size:.9rem;'
        }, 'Could not load papers list: ' + err.message));
      });
  });
})();
