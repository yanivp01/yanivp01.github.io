// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONNECTIONS, INTERVENTIONS } from '../../src/lib/ecosystem-model';
import { EMPTY_PROMPT, renderNodeStar } from '../../src/lib/node-star';

const node3a = INTERVENTIONS.find((n) => n.id === '3a')!;
const texts = (root: ParentNode, sel: string) => Array.from(root.querySelectorAll(sel)).map((e) => e.textContent?.trim());

describe('renderNodeStar', () => {
  let el: HTMLElement;
  beforeEach(() => { el = document.createElement('aside'); document.body.replaceChildren(el); });

  it('renders the empty-state prompt for null', () => {
    renderNodeStar(el, null, { onSelect: () => {} });
    expect(el.classList.contains('node-star--empty')).toBe(true);
    expect(el.textContent).toContain(EMPTY_PROMPT);
    expect(el.querySelector('.node-star__cols')).toBeNull();
  });

  it('renders 3a with its label, layer chip and three columns from INTERVENTIONS', () => {
    renderNodeStar(el, '3a', { onSelect: () => {} });
    expect(el.dataset.node).toBe('3a');
    expect(el.querySelector('.node-star__id')?.textContent).toBe('3a');
    expect(el.querySelector('.node-star__label')?.textContent).toBe('Deal Flow Matching');
    expect(el.querySelector('.node-star__chip')?.textContent).toBe('Layer 3: Capital');
    expect(el.querySelector<HTMLElement>('.node-star__chip')?.style.getPropertyValue('--chip')).toBe('#F59E0B');

    expect(el.querySelectorAll('.node-star__col')).toHaveLength(3);
    expect(el.querySelectorAll('[data-col="inputs"] li')).toHaveLength(node3a.inputs.length);
    expect(el.querySelectorAll('[data-col="efforts"] li')).toHaveLength(node3a.efforts.length);
    expect(el.querySelectorAll('[data-col="outputs"] li')).toHaveLength(node3a.outputs.length);
    expect(texts(el, '[data-col="inputs"] li')).toEqual(node3a.inputs);
    expect(texts(el, '[data-col="efforts"] li')).toEqual(node3a.efforts);
    expect(texts(el, '[data-col="outputs"] li')).toEqual(node3a.outputs);
  });

  it('lists "Receives from" / "Feeds into" edges from CONNECTIONS', () => {
    renderNodeStar(el, '3a', { onSelect: () => {} });
    const incoming = CONNECTIONS.filter((c) => c.to === '3a');
    const outgoing = CONNECTIONS.filter((c) => c.from === '3a');
    expect(incoming.length).toBeGreaterThan(0);
    expect(outgoing.length).toBeGreaterThan(0);
    expect(el.querySelectorAll('[data-edges="in"] .node-star__edge')).toHaveLength(incoming.length);
    expect(el.querySelectorAll('[data-edges="out"] .node-star__edge')).toHaveLength(outgoing.length);
    expect(el.querySelector('[data-edges="in"] h4')?.textContent).toBe(`Receives from (${incoming.length})`);
    expect(el.querySelector('[data-edges="out"] h4')?.textContent).toBe(`Feeds into (${outgoing.length})`);
    // Each entry: other node's short label + connection label.
    const first = el.querySelector('[data-edges="in"] .node-star__edge')!;
    const other = INTERVENTIONS.find((n) => n.id === incoming[0].from)!;
    expect(first.querySelector('.node-star__edge-node')?.textContent).toBe(other.short);
    expect(first.querySelector('.node-star__edge-label')?.textContent).toBe(incoming[0].label);
  });

  it('routes edge clicks and Close through onSelect', () => {
    const onSelect = vi.fn();
    renderNodeStar(el, '3a', { onSelect });
    const edge = el.querySelector<HTMLButtonElement>('[data-edges="out"] .node-star__edge')!;
    edge.click();
    expect(onSelect).toHaveBeenLastCalledWith(edge.dataset.node);
    el.querySelector<HTMLButtonElement>('.node-star__close')!.click();
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('re-rendering replaces content and clears the empty state', () => {
    renderNodeStar(el, null, { onSelect: () => {} });
    renderNodeStar(el, '1a', { onSelect: () => {} });
    expect(el.classList.contains('node-star--empty')).toBe(false);
    expect(el.querySelectorAll('.node-star__label')).toHaveLength(1);
    expect(el.querySelector('.node-star__label')?.textContent).toBe('Venture Registry');
  });
});
