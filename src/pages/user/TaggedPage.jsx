import { useEffect, useRef } from "react";

export default function TaggedPage() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const x = c.getContext("2d");

    const S = Math.sin;
    const C = Math.cos;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      c.width = Math.floor(window.innerWidth * dpr);
      c.height = Math.floor(window.innerHeight * dpr);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const u = (t) => {
      // Version “dwitter”: reset rapide + filtre invert
      c.style.filter = "invert(1)";
      c.width |= 0;

      for (let i = 1e4; i--; ) {
        const O = t / 2;
        const v = i / 2 + O;
        const F = i ** 0.9 % 10;

        const X = F * S(v) - S(i + O);
        const Y = F * C(v) + C(i - O);

        x.fillRect(960 + X * 120, 540 + Y * 120, 3, 3);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const loop = (now) => {
      const t = (now - start) / 1000;
      u(t);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", background: "#000" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
          color: "white",
          fontWeight: 800,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          opacity: 0.9,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Tagged Page — In construction
      </div>
    </div>
  );
}
