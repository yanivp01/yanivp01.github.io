import { describe, expect, it } from 'vitest';
import { CONNECTIONS, INTERVENTIONS, LAYERS, toGraphData } from '../../src/lib/ecosystem-model';

describe('ecosystem model data', () => {
  it('has 22 interventions across 6 layers', () => {
    expect(INTERVENTIONS).toHaveLength(22);
    expect(new Set(INTERVENTIONS.map((n) => n.layer))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    expect(LAYERS).toHaveLength(6);
  });
  it('every connection references known nodes', () => {
    const ids = new Set(INTERVENTIONS.map((n) => n.id));
    for (const c of CONNECTIONS) { expect(ids.has(c.from), c.from).toBe(true); expect(ids.has(c.to), c.to).toBe(true); }
  });
  it('toGraphData returns force-graph shaped data', () => {
    const g = toGraphData();
    expect(g.nodes[0]).toMatchObject({ id: '1a', layer: 1 });
    expect(g.links[0]).toEqual({ source: '1a', target: '1b', label: 'entity data' });
  });
});
