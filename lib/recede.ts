// lib/recede.ts — FULL REPLACEMENT (band-only, tapered, bidirectional, no ghosts)
export function mountRecede() {
  if (typeof window === "undefined") return;

  const visor = document.getElementById("header-visor");
  if (!visor) return;

  // Respect reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  Object.assign(visor.style, {
    position: "fixed",
    overflow: "hidden",
    pointerEvents: "none",
    transformStyle: "preserve-3d",
    perspective: "900px",
    willChange: "transform",
  } as CSSStyleDeclaration);

  const sections = () =>
    Array.from(
      document.querySelectorAll("#content section, main section")
    ) as HTMLElement[];

  let raf: number | null = null;
  let active: HTMLElement | null = null;
  let wrap: HTMLElement | null = null;
  let cloneEl: HTMLElement | null = null;
  let lastY = window.scrollY;

  const easeInOutCubic = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  const clear = () => {
    if (active) {
      active.style.visibility = "";
      active.style.clipPath = "";
      (active.style as any).webkitClipPath = "";
    }
    if (cloneEl) cloneEl.remove();
    if (wrap) wrap.remove();
    active = wrap = cloneEl = null;
  };

  const ensureClone = (target: HTMLElement) => {
    if (active === target && wrap && cloneEl) return cloneEl;

    clear();
    active = target;

    // Wrapper inside visor with soft fade at top/bottom of band
    wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.top = "0";
    wrap.style.left = "0";
    wrap.style.width = "100%";
    wrap.style.height = "100%";
    wrap.style.transformStyle = "preserve-3d";
    wrap.style.willChange = "transform,opacity,filter";

    const mask =
      "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)";
    (wrap.style as any).maskImage = mask;
    (wrap.style as any).webkitMaskImage = mask;

    visor.appendChild(wrap);

    cloneEl = target.cloneNode(true) as HTMLElement;
    Object.assign(cloneEl.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      margin: "0",
      transformOrigin: "top center",
      backfaceVisibility: "hidden",
      willChange: "transform,opacity,filter",
    } as CSSStyleDeclaration);
    wrap.appendChild(cloneEl);
    return cloneEl;
  };

  const frame = () => {
    const vb = visor.getBoundingClientRect();
    const bandTop = vb.top;
    const bandBottom = vb.bottom;
    const bandH = Math.max(1, bandBottom - bandTop);
    const dirUp = window.scrollY < lastY;
    lastY = window.scrollY;

    // First section intersecting band
    let target: HTMLElement | null = null;
    let r!: DOMRect;
    for (const s of sections()) {
      const rr = s.getBoundingClientRect();
      if (rr.top < bandBottom && rr.bottom > bandTop) {
        target = s;
        r = rr;
        break;
      }
    }

    if (!target) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    // Strict band-only
    if (r.bottom <= bandTop || r.top >= bandBottom) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    // Progress across band
    const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);

    // Direction-aware: coming from above appears from distance
    const comingFromAbove = r.top < bandTop || dirUp;
    const base = comingFromAbove ? 1 - t : t;
    const p = easeInOutCubic(base);

    const c = ensureClone(target)!;
    if (!wrap || !c) {
      raf = requestAnimationFrame(frame);
      return;
    }

    // Align wrapper horizontally with section
    const left = Math.round(r.left - vb.left);
    wrap.style.left = `${left}px`;
    wrap.style.width = `${r.width}px`;

    // Overlap size
    const overlapPx = Math.min(bandBottom, r.bottom) - Math.max(bandTop, r.top);

    // Live section: clip away ONLY the overlapped slice (no early disappear)
    if (comingFromAbove) {
      const liveBottomClipPx = Math.min(Math.max(0, r.bottom - bandTop), r.height);
      const clip = `inset(0 0 ${liveBottomClipPx}px 0)`;
      target.style.clipPath = clip;
      (target.style as any).webkitClipPath = clip;
    } else {
      const liveTopClipPx = Math.min(Math.max(0, bandBottom - r.top), r.height);
      const clip = `inset(${liveTopClipPx}px 0 0 0)`;
      target.style.clipPath = clip;
      (target.style as any).webkitClipPath = clip;
    }
    target.style.visibility = "visible";

    // Clone in visor: show exactly the overlapped strip
    if (comingFromAbove) {
      const cloneTopHidden = Math.max(0, r.height - overlapPx);
      const clip = `inset(${cloneTopHidden}px 0 0 0)`;
      c.style.clipPath = clip;
      (c.style as any).webkitClipPath = clip;
    } else {
      const cloneBottomHidden = Math.max(0, r.height - overlapPx);
      const clip = `inset(0 0 ${cloneBottomHidden}px 0)`;
      c.style.clipPath = clip;
      (c.style as any).webkitClipPath = clip;
    }

    // Motion: tapered “road” with rounded path
    if (prefersReduced) {
      c.style.transform = "none";
      c.style.filter = "none";
      c.style.opacity = "1";
    } else {
      const translateZ = -250 * p;
      const translateY = -20 * p - 6 * p * p; // subtle curve
      const rotateX = 12 * p; // conveys ~100° belt feel
      const scaleX = 1 - 0.14 * p; // taper inward
      const scaleY = 1 - 0.06 * p; // keep structure
      const blur = 1.1 * p;
      const opacity = 1 - 0.22 * p;

      c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) rotateX(${rotateX}deg) scale3d(${scaleX}, ${scaleY}, 1)`;
      c.style.filter = `blur(${blur}px)`;
      c.style.opacity = String(opacity);
    }

    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    clear();
  };
  const start = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  };

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()), {
    passive: true,
  });
  window.addEventListener("resize", start, { passive: true });
  window.addEventListener("scroll", start, { passive: true });

  start();
}
