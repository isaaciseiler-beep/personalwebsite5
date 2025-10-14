// lib/recede.ts
export function mountRecede() {
  const visor = document.getElementById("header-visor");
  if (!visor) return;

  const sections = Array.from(document.querySelectorAll("main section")) as HTMLElement[];
  let active: HTMLElement | null = null;
  const cloneWrapper = document.createElement("div");
  cloneWrapper.style.position = "absolute";
  cloneWrapper.style.inset = "0";
  cloneWrapper.style.transformStyle = "preserve-3d";
  visor.appendChild(cloneWrapper);

  const animate = () => {
    const vb = visor.getBoundingClientRect();
    const top = vb.top;
    const bottom = vb.bottom;
    const h = bottom - top;

    let target: HTMLElement | null = null;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top < bottom && r.bottom > top) {
        target = s;
        break;
      }
    }

    if (!target) {
      cloneWrapper.innerHTML = "";
      active = null;
      requestAnimationFrame(animate);
      return;
    }

    if (active !== target) {
      cloneWrapper.innerHTML = "";
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
      cloneWrapper.appendChild(c);
      active = target;
    }

    const r = target.getBoundingClientRect();
    const t = Math.min(Math.max((bottom - r.top) / h, 0), 1);
    const c = cloneWrapper.firstElementChild as HTMLElement;
    c.style.transform = `translateY(${-20 * t}px) scale(${1 - 0.12 * t}) translateZ(${-200 * t}px)`;
    c.style.filter = `blur(${t}px)`;
    c.style.opacity = String(1 - 0.3 * t);

    // hide real content while inside visor
    target.style.visibility = r.top < bottom ? "hidden" : "";

    // reset when fully gone
    if (r.bottom <= top) {
      target.style.visibility = "";
      cloneWrapper.innerHTML = "";
      active = null;
    }

    requestAnimationFrame(animate);
  };

  animate();
}
