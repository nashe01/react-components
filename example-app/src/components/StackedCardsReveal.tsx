import { useEffect, useMemo, useState } from "react";

type RevealCard = {
  id: string;
  title: string;
  text: string;
};

type CardDef = {
  width: number;
  height: number;
  start: { ox: number; oy: number; r: number; z: number };
  end: { ox: number; oy: number; r: number; z: number };
};

const cards: RevealCard[] = [
  {
    id: "c1",
    title: "Lorem dolor",
    text: "Sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "c2",
    title: "Amet consectetur",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "c3",
    title: "Adipiscing elit",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "c4",
    title: "Sed eiusmod",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getCardDefs(viewportWidth: number, viewportHeight: number): CardDef[] {
  const scale = Math.min(1, viewportWidth / 1100);
  const widths = [220, 230, 235, 210].map((v) => Math.round(v * scale));
  const heights = [280, 300, 290, 260].map((v) => Math.round(v * scale));

  const gx = viewportWidth * 0.28;
  const gy = viewportHeight * 0.22;

  return [
    {
      width: widths[0],
      height: heights[0],
      start: { ox: -10, oy: -8, r: -5, z: 4 },
      end: { ox: -gx, oy: -gy, r: -6, z: 4 },
    },
    {
      width: widths[1],
      height: heights[1],
      start: { ox: 4, oy: 4, r: 3, z: 3 },
      end: { ox: -gx, oy: gy, r: 8, z: 3 },
    },
    {
      width: widths[2],
      height: heights[2],
      start: { ox: -4, oy: 6, r: -2, z: 2 },
      end: { ox: gx, oy: gy, r: -5, z: 2 },
    },
    {
      width: widths[3],
      height: heights[3],
      start: { ox: 8, oy: -6, r: 6, z: 1 },
      end: { ox: gx, oy: -gy, r: 7, z: 1 },
    },
  ];
}

export default function StackedCardsReveal() {
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 1200, height: 900 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    const updateProgress = () => {
      const driver = document.getElementById("stacked-cards-driver");
      if (!driver) return;

      const rect = driver.getBoundingClientRect();
      const total = driver.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }

      const raw = Math.max(0, Math.min(1, -rect.top / total));
      setProgress(easeInOutCubic(raw));
    };

    updateViewport();
    updateProgress();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("resize", updateProgress);
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  const cardDefs = useMemo(
    () => getCardDefs(viewport.width, viewport.height),
    [viewport.height, viewport.width],
  );

  const textOpacity = {
    title: 0.18 + 0.62 * progress,
    body: 0.22 + 0.6 * progress,
    cta: 0.16 + 0.5 * progress,
  } as const;

  return (
    <section className="w-full bg-white text-black">
      <div id="stacked-cards-driver" className="h-[300vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-1 flex flex-col items-center justify-center px-8 text-center"
          >
            <p
              className="mt-6 max-w-[520px] text-[clamp(0.95rem,1.6vw,1.15rem)] leading-[1.75] font-normal text-black"
              style={{ opacity: textOpacity.body }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div
              className="mt-8 text-[0.85rem] tracking-[0.12em] text-black uppercase"
              style={{ opacity: textOpacity.cta }}
            >
              Dolor sit amet
            </div>
          </div>

          <div className="absolute inset-0 z-2">
            {cards.map((card, index) => {
              const def = cardDefs[index];
              const ox = lerp(def.start.ox, def.end.ox, progress);
              const oy = lerp(def.start.oy, def.end.oy, progress);
              const rotation = lerp(def.start.r, def.end.r, progress);
              const left = viewport.width / 2 - def.width / 2 + ox;
              const top = viewport.height / 2 - def.height / 2 + oy;

              return (
                <article
                  key={card.id}
                  className="absolute flex flex-col justify-between overflow-hidden rounded-[18px] border border-zinc-200/90 bg-zinc-50/95 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.08)]"
                  style={{
                    width: `${def.width}px`,
                    height: `${def.height}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                    transform: `rotate(${rotation}deg)`,
                    zIndex: def.start.z,
                  }}
                >
                  <h3 className="text-balance text-base font-semibold leading-snug tracking-tight text-zinc-900">
                    {card.title}
                  </h3>
                  <p className="text-pretty text-[0.82rem] leading-[1.55] text-zinc-600">{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
