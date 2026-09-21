/// <reference types="astro/client" />

// `pnpm check` runs `astro check` (which type-checks `.astro` files with
// full fidelity via Astro's own language service) followed by a plain
// `tsc --noEmit` pass. Plain tsc has no idea how to parse `.astro` files at
// all, so anything that imports one directly — the container-render unit
// tests under tests/unit/*.test.ts, and the vendored
// src/components/starwind/*/index.ts re-exports — needs a fallback ambient
// module declaration or tsc fails with "Cannot find module". This doesn't
// affect astro check's real checking of .astro components.
declare module '*.astro' {
  const Component: any;
  export default Component;
}
