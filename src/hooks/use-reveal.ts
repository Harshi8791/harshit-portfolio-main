import { useEffect } from "react";

/** Reveals every element with `data-reveal` as it scrolls into view, with stagger per section. */
export function useReveal() {
  useEffect(() => {
    const apply = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
        (n) => !n.dataset.observed,
      );
      if (nodes.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          visible.forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
            el.dataset.visible = "true";
            observer.unobserve(el);
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
      );

      nodes.forEach((node) => {
        node.dataset.observed = "true";
        observer.observe(node);
      });
      return observer;
    };

    const observer = apply();
    const raf = window.setTimeout(apply, 400);
    return () => {
      window.clearTimeout(raf);
      observer?.disconnect();
    };
  }, []);
}
