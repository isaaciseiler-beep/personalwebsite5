// lib/recede.ts — FULL REPLACEMENT
// Header-visor recede effect confined strictly to the header band.
// Robust to resizes, dynamic DOM changes, route transitions, and HMR.

type RecedeState = {
  raf: number | null;
  visor: HTMLElement | null;
  activeEl: HTMLElement | null;
  wrapEl: HTMLElement | null; // positions the clone inside visor
  cloneEl: HTMLElement | null; // actual cloned section
  mo: MutationObserver | null;
  ro: ResizeObserver | null;
  running: boolean;
};

// Singleton guard (safe across HMR)
const KEY = "__recede_state__";

function getState(): RecedeState {
  if (typeof window === "undefined") {
    // SSR no-op
    // @ts-expect-error SSR state
    return {};
  }
  const anyWin = window as any;
  if (!anyWin[KEY]) {
    anyWin[KEY] = {
      raf: null,
      visor: null,
      activeEl: null,
      wrapEl: null,
      cloneEl: null,
      mo: null,
      ro: null,
      running: false,
    } satisfies RecedeState;
  }
  return anyWin[KEY] as RecedeState;
}

function sections(): HTMLElement[] {
  // Prefer your main content root; fall back to any <main> sections.
  return Array.from(
    document.querySelectorAll("#content section, main section")
  ) as HTMLElement[];
}

function clearClone(state: RecedeState) {
  if (state.cloneEl) {
    state.cloneEl.remove();
    state.cloneEl = null;
  }
  if (state.wrapEl) {
    state.wrapEl.remove();
    state.wrapEl = null;
  }
  if (state.activeEl) {
    state.activeEl.style.visibility = "";
    state.activeEl = null;
  }
}

function ensureWrap(state: RecedeState) {
  if (!state.visor) return null;
  if (state.wrapEl && state.wrapEl.parentElement === state.visor) return state.wrapEl;
  const wrap = document.createElement("div");
  wrap.style.position = "absolute";
  wrap.style.inset = "0";
  wrap.style.transformStyle = "preserve-3d";
  wrap.style.willChange = "transform";
  state.visor.appendChild(wrap);
  state.wrapEl = wrap;
  return wrap;
}

function ensureClone(state: RecedeState, target: HTMLElement) {
  const wrap = ensureWrap(state);
  if (!wrap) return null;

  if (state.activeEl === target && state.cloneEl && state.cloneEl.parentElement === wrap) {
    return state.cloneEl;
  }
  clearClone(state);

  const c = target.cloneNode(true) as HTMLElement;
  Object.assign(c.style, {
    margin: "0",
    width: "100%",
    transformOrigin: "top center",
    position: "absolute",
    top: "0",
    left: "0",
    willChange: "transform, opacity, filter",
  });
  wrap.appendChild(c);
  state.cloneEl = c;
  state.activeEl = target;
  return c;
}

function step(state: RecedeState) {
  if (!state.running || !state.visor) return;

  const vb = state.visor.getBoundingClientRect();
  const bandTop = vb.top;
  const bandBottom = vb.bottom;
  const bandH = Math.max(1, bandBottom - bandTop);

  // Find first section intersecting the header band
  let target: HTMLElement | null = null;
  const list = sections();
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    const r = s.getBoundingClientRect();
    if (r.top < bandBottom && r.bottom > bandTop) {
      target = s;
      break;
    }
  }

  if (!target) {
    clearClone(state);
    state.raf = requestAnimationFrame(() => step(state));
    return;
  }

  const r = target.getBoundingClientRect();

  // If the section is fully outside the band, reset.
  if (r.bottom <= bandTop || r.top >= bandBottom) {
    clearClone(state);
    state.raf = requestAnimationFrame(() => step(state));
    return;
  }

  // Progress strictly within the band [0..1]
  const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);

  const c = ensureClone(state, target);
  if (!c || !state.wrapEl) {
    state.raf = requestAnimationFrame(() => step(state));
    return;
  }

  // Align wrapper horizontally with the real section relative to visor
  const left = Math.round(r.left - vb.left);
  state.wrapEl.style.left = `${left}px`;
  state.wrapEl.style.width = `${r.width}px`;

  // Depth mapping confined to header band
  // Tune these four numbers for desired taste. Current values are subtle and professional.
  const translateZ = -200 * t;
  const translateY = -18 * t;
  const scale = 1 - 0.12 * t;
  const blur = 1.1 * t;
  const opacity = 1 - 0.25 * t;

  c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`;
  c.style.filter = `blur(${blur}px)`;
  c.style.opacity = String(opacity);

  // Hide real element ONLY while intersecting the band (prevents bleed over the header)
  target.style.visibility = "hidden";

  state.raf = requestAnimationFrame(() => step(state));
}

function start(state: RecedeState) {
  if (state.running) return;
  state.running = true;
  state.raf = requestAnimationFrame(() => step(state));
}

function stop(state: RecedeState) {
  state.running = false;
  if (state.raf != null) cancelAnimationFrame(state.raf);
  state.raf = null;
  clearClone(state);
}

export function mountRecede(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const state = getState();

  // Re-acquire visor every time in case of route changes.
  state.visor = document.getElementById("header-visor");
  if (!state.visor) return;

  // Ensure visor has proper clipping/perspective (idempotent).
  state.visor.style.pointerEvents = "none";
  state.visor.style.overflow = "hidden";
  state.visor.style.perspective = state.visor.style.perspective || "900px";
  state.visor.style.transformStyle = "preserve-3d";

  // Keep running; refresh on DOM mutations that add/remove sections.
  if (state.mo) state.mo.disconnect();
  state.mo = new MutationObserver(() => {
    // No heavy work here; step() recomputes per frame.
  });
  state.mo.observe(document.body, { childList: true, subtree: true });

  // If visor resizes (responsive header), continue seamlessly.
  if (state.ro) state.ro.disconnect();
  state.ro = new ResizeObserver(() => {
    // step() reads fresh rects each frame; nothing needed here beyond keeping loop alive.
  });
  state.ro.observe(state.visor);

  // Pause on tab hidden to save battery; resume on visible.
  const onVis = () => (document.hidden ? stop(state) : start(state));
  document.removeEventListener("visibilitychange", onVis);
  document.addEventListener("visibilitychange", onVis, { passive: true });

  // Scroll/resize listeners are unnecessary for correctness since we run every rAF,
  // but attaching passive listeners keeps the loop “hot” after long idle.
  const keepAlive = () => {
    if (!state.running) start(state);
  };
  window.addEventListener("scroll", keepAlive, { passive: true });
  window.addEventListener("resize", keepAlive, { passive: true });

  start(state);
}
