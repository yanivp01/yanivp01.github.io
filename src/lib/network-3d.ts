import { layerColor, toGraphData } from './ecosystem-model';

export interface Network3DHandle { destroy(): void }

export async function mountNetwork3D(el: HTMLElement, opts: { autoRotate?: boolean; interactive?: boolean } = {}): Promise<Network3DHandle> {
  const { default: ForceGraph3D } = await import('3d-force-graph');
  const { autoRotate = true, interactive = true } = opts;
  const graph = new ForceGraph3D(el, { controlType: 'orbit' })
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
    .enablePointerInteraction(interactive)
    .width(el.clientWidth)
    .height(el.clientHeight);

  graph.cameraPosition({ z: 260 });

  // OrbitControls auto-rotation: yields to pointer input natively and is ticked by
  // 3d-force-graph's own render loop. Note that loop only calls controls.update() while
  // controls.enabled is true, so non-interactive (hero) mode keeps the controls enabled and
  // switches off the individual pointer behaviours instead of using enableNavigationControls(false).
  const controls = graph.controls() as any;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.6;
  if (!interactive) { controls.enableRotate = false; controls.enableZoom = false; controls.enablePan = false; }

  const onResize = () => graph.width(el.clientWidth).height(el.clientHeight);
  window.addEventListener('resize', onResize);
  return { destroy() { window.removeEventListener('resize', onResize); graph._destructor?.(); el.replaceChildren(); } };
}
