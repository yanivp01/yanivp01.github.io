import { layerColor, toGraphData } from './ecosystem-model';

export interface Network3DHandle { destroy(): void }

export async function mountNetwork3D(el: HTMLElement, opts: { autoRotate?: boolean; interactive?: boolean } = {}): Promise<Network3DHandle> {
  const { default: ForceGraph3D } = await import('3d-force-graph');
  const { autoRotate = true, interactive = true } = opts;
  const graph = new ForceGraph3D(el)
    .graphData(toGraphData())
    .backgroundColor('rgba(0,0,0,0)')
    .showNavInfo(false)
    .nodeRelSize(5)
    .nodeColor((n: any) => layerColor(n.layer))
    .nodeOpacity(0.95)
    .linkColor(() => '#1f4ed8')
    .linkOpacity(0.35)
    .linkWidth(0.6)
    .nodeLabel((n: any) => (interactive ? `${n.id} · ${n.label}` : ''))
    .enableNodeDrag(interactive)
    .enableNavigationControls(interactive)
    .width(el.clientWidth)
    .height(el.clientHeight);

  graph.cameraPosition({ z: 260 });
  let raf = 0;
  if (autoRotate) {
    let angle = 0;
    const spin = () => { angle += 0.0025; graph.cameraPosition({ x: 260 * Math.sin(angle), z: 260 * Math.cos(angle) }); raf = requestAnimationFrame(spin); };
    raf = requestAnimationFrame(spin);
  }
  const onResize = () => graph.width(el.clientWidth).height(el.clientHeight);
  window.addEventListener('resize', onResize);
  return { destroy() { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); graph._destructor?.(); el.replaceChildren(); } };
}
