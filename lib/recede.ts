// lib/recede.ts — WORLD-CLASS VERSION (final)
export function mountRecede() {
  if (typeof window === "undefined") return;

  const visor = document.getElementById("header-visor");
  if (!visor) return;

  // Defensive setup for the visor.
  Object.assign(visor.style, {
    overflow: "hidden",
    pointerEvents: "none",
    transformStyle: "preserve-3d",
    willChange: "transform",
  });

  const getSections = () =>
    Array.from(
      document.querySelectorAll("#content section, main section")
    ) as HTMLElement[];

  let active: HTMLElement | null = null;
  let clone: HTMLElement | null = null;
  let wrap: HTMLElement | null = null;
  let raf: number | null = null;

  const clear = () => {
    if (clone) clone.remove();
    if (wrap) wrap.remove();
    if (active) active.style.visibility = "";
    clone = wrap = active = null;
  };

  const ensureClone = (target: HTMLElement, bandRect: DOMRect) => {
    if (active === target && clone && wrap) return clone;

    clear();

    active = target;
    wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.inset = "0";
    wrap.style.transformStyle = "preserve-3d";
    visor.appendChild(wrap);

    clone = target.cloneNode(true) as HTMLElement;
    Object.assign(clone.style, {
      margin: "0",
      width: "100%",
      position: "absolute",
      top: "0",
      left: "0",
      transformOrigin: "top center",
      willChange: "transform, opacity, filter",
      backfaceVisibility: "hidden",
    });
    wrap.appendChild(clone);
    return clone;
  };

  const frame = () => {
    const vb = visor.getBoundingClientRect();
    const bandTop = vb.top;
    const bandBottom = vb.bottom;
    const bandH = Math.max(1, bandBottom - bandTop);

    const sections = getSections();
    let target: HTMLElement | null = null;

    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top < bandBottom && r.bottom > bandTop) {
        target = s;
        break;
      }
    }

    // Nothing intersecting the header zone
    if (!target) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    const r = target.getBoundingClientRect();

    // Progress strictly within header band (0 at entry, 1 at exit)
    const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);

    // Out of band → reset
    if (r.bottom <= bandTop || r.top >= bandBottom) {
      clear();
      raf = requestAnimationFrame(frame);
      return;
    }

    const c = ensureClone(target, vb);
    if (!c || !wrap) {
      raf = requestAnimationFrame(frame);
      return;
    }

    // Align wrapper horizontally with section
    const left = Math.round(r.left - vb.left);
    wrap.style.left = `${left}px`;
    wrap.style.width = `${r.width}px`;

    // Map t ∈ [0,1] → transform parameters
    // Easing curve (gentle acceleration + deceleration)
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const p = easeOutCubic(t);

    const translateZ = -250 * p;
    const translateY = -20 * p;
    const scale = 1 - 0.12 * p;
    const blur = 1.2 * p;
    const opacity = 1 - 0.25 * p;

    c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`;
    c.style.filter = `blur(${blur}px)`;
    c.style.opacity = String(opacity);

    // Hide real element only while inside the header band
    target.style.visibility =
      r.top < bandBottom && r.bottom > bandTop ? "hidden" : "";

    raf = requestAnimationFrame(frame);
  };

  // Robustness: clear on route/unmount
  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    clear();
  };

  // Auto cleanup on visibility change or navigation
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else raf = requestAnimationFrame(frame);
  });

  // Handle window resizes (viewport changes header position)
  window.addEventListener("resize", () => {
    clear();
  });

  // Kick off animation loop
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
}
