import { animate, inView, stagger } from 'motion';

export const motionOK = () => window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

export function heroEntrance(root: HTMLElement) {
  if (!motionOK()) return;
  const items = root.querySelectorAll<HTMLElement>('[data-hero-item]');
  items.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
  });
  animate(
    items,
    { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0)'] },
    { duration: 0.6, delay: stagger(0.06), ease: 'easeOut' },
  );
  const graph = root.querySelector<HTMLElement>('[data-hero-graph]');
  if (graph) {
    graph.style.opacity = '0';
    animate(graph, { opacity: [0, 1] }, { duration: 0.8, delay: 0.5 });
  }
}

export function reveal(selector = '[data-reveal]') {
  if (!motionOK()) return;
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.style.opacity = '0';
    inView(
      el,
      () => {
        animate(
          el,
          { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0)'] },
          { duration: 0.32, ease: 'easeOut' },
        );
      },
      { amount: 0.2 },
    );
  });
}
