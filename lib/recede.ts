// lib/recede.ts — FULL REPLACEMENT (robust visor-based recede)
export function mountRecede() {
  const visor = document.getElementById("header-visor");
  if (!visor) return;

  const sections = () =>
    Array.from(
      document.querySelectorAll("#content section, main section")
    ) as HTMLElement[];

  let activeEl: HTMLElement | null = null;
  let cloneEl: HTMLElement | null = null;

  const ensureClone = (target: HTMLElement) => {
    if (activeEl === target && cloneEl) return cloneEl;
    if (cloneEl) {
      cloneEl.remove();
      cloneEl = null;
    }
    activeEl = target;
    const wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.inset = "0";
    wrap.style.transformStyle = "preserve-3d";
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
    visor.appendChild(wrap);
    cloneEl = c;
    return c;
  };

  const loop = () => {
    const vb = visor.getBoundingClientRect();
    const bandTop = vb.top;
    const bandBottom = vb.bottom;
    const bandH = Math.max(1, bandBottom - bandTop);

    // find first section intersecting the visor band
    let target: HTMLElement | null = null;
    for (const s of sections()) {
      const r = s.getBoundingClientRect();
      if (r.top < bandBottom && r.bottom > bandTop) {
        target = s;
        break;
      }
    }

    if (!target) {
      if (cloneEl) {
        cloneEl.parentElement?.remove();
        cloneEl = null;
        if (activeEl) activeEl.style.visibility = "";
        activeEl = null;
      }
      requestAnimationFrame(loop);
      return;
    }

    const r = target.getBoundingClientRect();
    const t = Math.min(Math.max((bandBottom - r.top) / bandH, 0), 1);
    if (t <= 0) {
      if (cloneEl) {
        cloneEl.parentElement?.remove();
        cloneEl = null;
        if (activeEl) activeEl.style.visibility = "";
        activeEl = null;
      }
      requestAnimationFrame(loop);
      return;
    }

    const c = ensureClone(target)!;

    // align the inner wrapper to the section’s x
    const left = Math.round(r.left - vb.left);
    if (c.parentElement) {
      (c.parentElement as HTMLElement).style.left = `${left}px`;
      (c.parentElement as HTMLElement).style.width = `${r.width}px`;
    }

    // depth mapping inside the visor only
    const translateZ = -220 * t;
    const translateY = -22 * t;
    const scale = 1 - 0.16 * t;
    const blur = 1.2 * t;
    const opacity = 1 - 0.25 * t;

    c.style.transform = `perspective(900px) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`;
    c.style.filter = `blur(${blur}px)`;
    c.style.opacity = String(opacity);

    // hide the real element while overlapping the band
    target.style.visibility = r.top < bandBottom ? "hidden" : "";

    // clean up once it’s past the band
    if (r.bottom <= bandTop) {
      target.style.visibility = "";
      c.parentElement?.remove();
      cloneEl = null;
      activeEl = null;
    }

    requestAnimationFrame(loop);
  };

  loop();
}
