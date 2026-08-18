import { useEffect, useState } from "react";

/** Futuristic global effects: scroll progress rail + pointer spotlight + card glow tracking. */
export function FxLayer() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const root = document.documentElement;
      root.style.setProperty("--cursor-x", `${e.clientX}px`);
      root.style.setProperty("--cursor-y", `${e.clientY}px`);

      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-glow]");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        card.style.setProperty("--rx", `${rx}deg`);
        card.style.setProperty("--ry", `${ry}deg`);
      }
    };

    const onOut = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-glow]");
      if (card) {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <>
      <div className="scroll-rail" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="cursor-spotlight" aria-hidden />
    </>
  );
}
