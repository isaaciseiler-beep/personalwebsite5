// lib/recede.ts — FULL REPLACEMENT (band-only, rounded, no ghosts)
export function mountRecede() {
  if (typeof window === "undefined") return;

  const visor = document.getElementById("header-visor");
  if (!visor) return;

  // One active clone max
  let activeEl: HTMLElement | null = null;
  let wrapEl: HTMLElement | null = null;
  let cloneEl: HTMLElement | null = null;
  let raf: number | null = null;

  // Visor is a clipped 3D stage
  Object.assign(visor.style, {
    overflow: "hidden",
    pointerEvents: "none",
    transformStyle: "preserve-3d",
    willChange: "transform",
  } as CSSStyleDeclaration);

  const getSections = () =>
    Array.from(
      document.querySelectorAll("#content section, main section")
    ) as HTMLElement[];

  const clear = () => {
    if (cloneEl) cloneEl.remove();
    if (wrapEl) wrapEl.remove();
    if (activeEl) activeEl.style.visibility = "";
    activeEl = wrapEl = cloneEl = null;
  };

  const ensureClone = (target: HTMLElement) => {
    if (activeEl === target && wrapEl && cloneEl) return cloneEl;

    clear();
    activeEl = target;

    // Wrapper aligns to target rect inside visor and applies soft band masks
    wrapEl = document.createElement("div");
    wrapEl.style.position = "absolute";
    wrapEl.style.inset = "0";
    wrapEl.style.transformStyle = "preserve-3d";
    wrapEl.style.willChange = "transform,opacity,filter";
    // Rounded fade at top/bottom of the band to avoid hard edges
    const mask =
      "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)";
    (wrapEl.style as any).webkitMaskImage = mask;
    (wrapEl.style as any).maskImage = mask;

    visor.appendChild(wrapEl);

    // Clone of the intersecting section
    cloneEl = target.cloneNode(true) as HTMLElement;
    Object.assign(cloneEl.style, {
      margin: "0",
      width: "100%",
      position: "absolute",
      top: "0",
      left: "0",
      transformOrigin: "top center",
      backfaceVisibility: "hidden",
      willChange: "transform,opacity,filter",
    } as CSSStyleDeclaration);
    wrapEl.appendChild(cloneEl);
    return cloneEl;
  };

  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

  const frame = () => {
    const vb = visor.getBoundingClientRect();
    const bandTop = vb.top;
    const bandBottom = vb.bottom;
    const bandH = Math.max(1, bandBottom - bandTop);

    // First section intersecting the band
    const sections = getSections();
    let target: HTMLElement | null = null;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top < bandBottom && r.bottom > bandTop) {
        target = s;
        break;
      }
    }

    if (!target) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    const r = target.getBoundingClientRect();

    // Strict band confinement
    if (r.bottom <= bandTop || r.top >= bandBottom) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    // Progress within the band
    const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);
    const p = easeOutCubic(t);

    const c = ensureClone(target)!;
    if (!wrapEl || !c) {
      raf = requestAnimationFrame(frame);
      return;
    }

    // Align wrapper with target’s x/width relative to visor
    const left = Math.round(r.left - vb.left);
    wrapEl.style.left = `${left}px`;
    wrapEl.style.width = `${r.width}px`;

    // Rounded, conveyor-like motion: depth + mild rise + slight tilt + tiny curvature
    const translateZ = -240 * p;
    const translateY = -18 * p + -6 * (p * p); // extra curve
    const rotateX = 12 * p; // apparent ~100° belt feel
    const scale = 1 - 0.10 * p;
    const blur = 1.0 * p;
    const opacity = 1 - 0.22 * p;

    c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
    c.style.filter = `blur(${blur}px)`;
    c.style.opacity = String(opacity);

    // Hide real element only while overlapping the band
    target.style.visibility = "hidden";

    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    clear();
  };

  // Robustness
  document.addEventListener(
    "visibilitychange",
    () => (document.hidden ? stop() : start()),
    { passive: true }
  );
  window.addEventListener("resize", start, { passive: true });
  window.addEventListener("scroll", start, { passive: true });

  start();
}
