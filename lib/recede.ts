// lib/recede.ts — FULL REPLACEMENT (slice-at-band, seamless flow)
export function mountRecede() {
  if (typeof window === "undefined") return;

  const visor = document.getElementById("header-visor");
  if (!visor) return;

  // Visor = clipped 3D stage.
  Object.assign(visor.style, {
    overflow: "hidden",
    pointerEvents: "none",
    transformStyle: "preserve-3d",
  } as CSSStyleDeclaration);

  const getSections = () =>
    Array.from(document.querySelectorAll("#content section, main section")) as HTMLElement[];

  let active: HTMLElement | null = null;
  let wrap: HTMLElement | null = null;
  let cloneEl: HTMLElement | null = null;
  let raf: number | null = null;

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

    // Wrapper aligns horizontally to target inside visor and masks top/bottom softly
    wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.top = "0";
    wrap.style.left = "0";
    wrap.style.width = "100%";
    wrap.style.height = "100%";
    wrap.style.transformStyle = "preserve-3d";

    // Soft fade at band edges to avoid hard cuts
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
      height: "auto",
      margin: "0",
      transformOrigin: "top center",
      backfaceVisibility: "hidden",
      willChange: "transform, opacity, filter",
    } as CSSStyleDeclaration);

    wrap.appendChild(cloneEl);
    return cloneEl;
  };

  const easeInOutCubic = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  const frame = () => {
    const vb = visor.getBoundingClientRect();
    const bandTop = vb.top;
    const bandBottom = vb.bottom;
    const bandH = Math.max(1, bandBottom - bandTop);

    // Find first section intersecting band
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

    // If fully outside band, reset
    if (r.bottom <= bandTop || r.top >= bandBottom) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    // Progress in band: 0 at band bottom contact, 1 at band top exit
    const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);
    const p = easeInOutCubic(t);

    const c = ensureClone(target)!;
    if (!wrap || !c) {
      raf = requestAnimationFrame(frame);
      return;
    }

    // Align wrapper horizontally to section relative to visor
    const left = Math.round(r.left - vb.left);
    wrap.style.left = `${left}px`;
    wrap.style.width = `${r.width}px`;

    // Amount of section that is inside the band in pixels
    const overlapPx = Math.min(bandBottom, r.bottom) - Math.max(bandTop, r.top);

    // LIVE SECTION: clip away the overlapped slice at its top so it never shows above the band.
    // We only cut the top by overlap, leaving the rest visible and scrolling.
    const liveTopClip = Math.max(0, bandBottom - r.top); // px to hide from top
    const clip = `inset(${liveTopClip}px 0 0 0)`;
    target.style.visibility = "visible";
    target.style.clipPath = clip;
    (target.style as any).webkitClipPath = clip;

    // CLONE IN VISOR: show only the overlapped slice height; let that slice recede.
    // Clip the clone from bottom so its visible height equals overlapPx.
    const cloneBottomClip = Math.max(0, Math.max(0, r.height) - overlapPx);
    const cloneClip = `inset(0 0 ${cloneBottomClip}px 0)`;
    c.style.clipPath = cloneClip;
    (c.style as any).webkitClipPath = cloneClip;

    // Rounded, conveyor-like motion inside the band
    const translateZ = -240 * p;
    const translateY = -18 * p - 6 * p * p; // subtle extra curve
    const rotateX = 12 * p; // gentle tilt to imply ~100° conveyor feel
    const scale = 1 - 0.10 * p;
    const blur = 1.0 * p;
    const opacity = 1 - 0.22 * p;

    c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
    c.style.filter = `blur(${blur}px)`;
    c.style.opacity = String(opacity);

    // Advance
    raf = requestAnimationFrame(frame);
  };

  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);

  // Safety: reset on visibility change / resize
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
