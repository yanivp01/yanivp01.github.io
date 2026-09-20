/* Node-star panel: pure DOM rendering of one intervention's inputs / efforts / outputs and its
   incoming + outgoing connections. Framework-free; data comes from ./ecosystem-model. Used beside
   the 3D graph on /model (the 2D fallback carries its own star view). */
import { CONNECTIONS, INTERVENTIONS, layerColor, layerName, type Intervention } from './ecosystem-model';

export interface NodeStarOptions { onSelect(id: string | null): void }

const byId = new Map(INTERVENTIONS.map((n) => [n.id, n]));

export const EMPTY_PROMPT = 'Click a node to open its node-star view.';

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: Array<Node | string | null | undefined> = [],
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

function column(title: string, items: string[]): HTMLElement {
  return h('div', { class: 'node-star__col', 'data-col': title.toLowerCase() }, [
    h('h4', { class: 'node-star__eyebrow', text: title }),
    h('ul', { class: 'node-star__list' }, items.map((t) => h('li', { text: t }))),
  ]);
}

function edgeList(title: string, edges: Array<{ other: Intervention; label: string }>, onSelect: NodeStarOptions['onSelect']): HTMLElement {
  const list = h('ul', { class: 'node-star__edges' });
  if (edges.length === 0) list.append(h('li', { class: 'node-star__none', text: 'None' }));
  for (const { other, label } of edges) {
    const btn = h('button', { type: 'button', class: 'node-star__edge', 'data-node': other.id }, [
      h('span', { class: 'node-star__edge-dot', style: `background:${layerColor(other.layer)}`, 'aria-hidden': 'true' }),
      h('span', { class: 'node-star__edge-node', text: other.short }),
      h('span', { class: 'node-star__edge-label', text: label }),
    ]);
    btn.addEventListener('click', () => onSelect(other.id));
    list.append(h('li', {}, [btn]));
  }
  return h('div', { class: 'node-star__edge-group', 'data-edges': title === 'Receives from' ? 'in' : 'out' }, [
    h('h4', { class: 'node-star__eyebrow', text: `${title} (${edges.length})` }),
    list,
  ]);
}

export function renderNodeStar(panel: HTMLElement, nodeId: string | null, opts: NodeStarOptions): void {
  const node = nodeId ? byId.get(nodeId) : undefined;
  panel.replaceChildren();
  panel.dataset.node = node?.id ?? '';

  if (!node) {
    panel.classList.add('node-star--empty');
    panel.append(
      h('p', { class: 'node-star__eyebrow', text: 'Node-star view' }),
      h('p', { class: 'node-star__prompt', text: EMPTY_PROMPT }),
    );
    return;
  }
  panel.classList.remove('node-star--empty');

  const incoming = CONNECTIONS.filter((c) => c.to === node.id)
    .map((c) => ({ other: byId.get(c.from)!, label: c.label }))
    .filter((e) => e.other);
  const outgoing = CONNECTIONS.filter((c) => c.from === node.id)
    .map((c) => ({ other: byId.get(c.to)!, label: c.label }))
    .filter((e) => e.other);

  const close = h('button', { type: 'button', class: 'node-star__close', 'aria-label': 'Close node-star view', text: 'Close' });
  close.addEventListener('click', () => opts.onSelect(null));

  panel.append(
    h('header', { class: 'node-star__head' }, [
      h('div', { class: 'node-star__title' }, [
        h('p', { class: 'node-star__id', text: node.id }),
        h('h3', { class: 'node-star__label', text: node.label }),
        h('span', { class: 'node-star__chip', style: `--chip:${layerColor(node.layer)}` }, [
          h('span', { class: 'node-star__chip-dot', 'aria-hidden': 'true' }),
          `Layer ${node.layer}: ${layerName(node.layer)}`,
        ]),
      ]),
      close,
    ]),
    h('div', { class: 'node-star__cols' }, [
      column('Inputs', node.inputs),
      column('Efforts', node.efforts),
      column('Outputs', node.outputs),
    ]),
    h('div', { class: 'node-star__flows' }, [
      edgeList('Receives from', incoming, opts.onSelect),
      edgeList('Feeds into', outgoing, opts.onSelect),
    ]),
  );
}
