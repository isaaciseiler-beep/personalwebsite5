// lib/recede.ts — FULL REPLACEMENT (band-only, bidirectional, tapered “road”)
export function mountRecede() {
  if (typeof window === "undefined") return;

  const visor = document.getElementById("header-visor");
  if (!visor) return;

  Object.assign(visor.style, {
    overflow: "hidden",
    pointerEvents: "none",
    transformStyle: "preserve-3d",
    willChange: "transform",
  } as CSSStyleDeclaration);

  const sections = () =>
    Array.from(document.querySelectorAll("#content section, main section")) as HTMLElement[];

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

    // wrapper inside visor with soft top/bottom fade
    wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.inset = "0";
    wrap.style.transformStyle = "preserve-3d";
    wrap.style.willChange = "transform";
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

    // pick first intersecting section
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

    // strictly in-band only
    if (r.bottom <= bandTop || r.top >= bandBottom) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    // progress across band
    const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);

    // direction-aware mapping:
    // coming from BELOW (normal scroll-down): use p = ease(t)
    // coming from ABOVE (scroll-up into view): use p = ease(1 - t) so it appears from distance
    const comingFromAbove = r.top < bandTop; // top already inside band, i.e., section was above
    const base = comingFromAbove ? 1 - t : t;
    const p = easeInOutCubic(base);

    const c = ensureClone(target)!;
    if (!wrap || !c) {
      raf = requestAnimationFrame(frame);
      return;
    }

    // align wrapper horizontally with section
    const left = Math.round(r.left - vb.left);
    wrap.style.left = `${left}px`;
    wrap.style.width = `${r.width}px`;

    // overlap amount
    const overlapPx = Math.min(bandBottom, r.bottom) - Math.max(bandTop, r.top);
    const liveTopClipPx = Math.max(0, bandBottom - r.top);
    const liveBottomClipPx = Math.max(0, r.bottom - bandTop);

    // live section clip: remove only the overlapped strip, direction-aware
    if (comingFromAbove) {
      // section descending from above: clip from bottom
      const clip = `inset(0 0 ${Math.min(liveBottomClipPx, r.height)}px 0)`;
      target.style.clipPath = clip;
      (target.style as any).webkitClipPath = clip;
    } else {
      // section ascending from below: clip from top
      const clip = `inset(${Math.min(liveTopClipPx, r.height)}px 0 0 0)`;
      target.style.clipPath = clip;
      (target.style as any).webkitClipPath = clip;
    }
    target.style.visibility = "visible";

    // clone clip: show only the band slice (top or bottom slice to match)
    if (comingFromAbove) {
      // show the bottom slice of the section inside the band
      const cloneTopHidden = Math.max(0, r.height - overlapPx);
      const clip = `inset(${cloneTopHidden}px 0 0 0)`;
      c.style.clipPath = clip;
      (c.style as any).webkitClipPath = clip;
    } else {
      // show the top slice of the section inside the band
      const cloneBottomHidden = Math.max(0, r.height - overlapPx);
      const clip = `inset(0 0 ${cloneBottomHidden}px 0)`;
      c.style.clipPath = clip;
      (c.style as any).webkitClipPath = clip;
    }

    // tapered “road” look: anisotropic scale (scaleX more than scaleY), mild rotateX, depth, gentle rise
    const translateZ = -250 * p;
    const translateY = -20 * p - 6 * p * p;
    const rotateX = 12 * p;
    const scaleX = 1 - 0.14 * p; // stronger to create taper
    const scaleY = 1 - 0.06 * p; // smaller reduction to keep structure
    const blur = 1.1 * p;
    const opacity = 1 - 0.22 * p;

    c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) rotateX(${rotateX}deg) scale3d(${scaleX}, ${scaleY}, 1)`;
    c.style.filter = `blur(${blur}px)`;
    c.style.opacity = String(opacity);

    raf = requestAnimationFrame(frame);
  };

  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);

  // housekeeping
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    clear();
  };
  const resume = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : resume()), {
    passive: true,
  });
  window.addEventListener("resize", resume, { passive: true });
  window.addEventListener("scroll", resume, { passive: true });
}
