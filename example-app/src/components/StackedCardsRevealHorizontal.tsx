import { useEffect, useMemo, useState, type ReactNode } from "react";

type RevealCard = {
  id: string;
  title: ReactNode;
  description: ReactNode;
};

type CardDef = {
  width: number;
  height: number;
  start: { ox: number; oy: number; r: number; z: number };
  end: { ox: number; oy: number; r: number; z: number };
};

const defaultCards: RevealCard[] = [
  {
    id: "c1",
    title: "Lorem dolor",
    description:
      "Sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "c2",
    title: "Amet consectetur",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "c3",
    title: "Adipiscing elit",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

const baseWidthPattern = [260, 275, 285, 250];
const baseHeightPattern = [280, 300, 290, 260];

const getRepeatedPattern = (pattern: number[], length: number) =>
  Array.from({ length }, (_, index) => pattern[index % pattern.length]);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Pixel offset from viewport center (x) so card centers line up in one horizontal row, centered in the viewport. */
function endOffsetsHorizontal(
  viewportWidth: number,
  widths: number[],
  gap: number,
): number[] {
  const n = widths.length;
  const total = widths.reduce((a, w) => a + w, 0) + gap * Math.max(0, n - 1);
  const left0 = (viewportWidth - total) / 2;
  const out: number[] = [];
  let x = left0;
  for (let i = 0; i < n; i++) {
    const cx = x + widths[i] / 2;
    out.push(cx - viewportWidth / 2);
    x += widths[i] + gap;
  }
  return out;
}

function getCardDefs(viewportWidth: number, cardCount: number): CardDef[] {
  let scale = Math.min(1, viewportWidth / 1100);
  const baseW = getRepeatedPattern(baseWidthPattern, cardCount);
  const baseH = getRepeatedPattern(baseHeightPattern, cardCount);

  const build = (s: number) => ({
    widths: baseW.map((v) => Math.round(v * s)),
    heights: baseH.map((v) => Math.round(v * s)),
  });

  let { widths, heights } = build(scale);
  let gap = 34;
  const gapCount = Math.max(0, cardCount - 1);

  for (let i = 0; i < 10; i++) {
    const total = widths.reduce((a, w) => a + w, 0) + gap * gapCount;
    if (total <= viewportWidth - 32) break;
    scale *= 0.94;
    ({ widths, heights } = build(scale));
    gap = Math.max(18, Math.round(gap * 0.9));
  }

  const endOx = endOffsetsHorizontal(viewportWidth, widths, gap);
  const endOy = 0;
  const endR = 0;

  return Array.from({ length: cardCount }, (_, index) => ({
    width: widths[index],
    height: heights[index],
    start: {
      ox: -10 + index * 4,
      oy: 6 - index * 3,
      r: -4 + index * 2.5,
      z: 4 - index,
    },
    end: {
      ox: endOx[index] ?? 0,
      oy: endOy,
      r: endR,
      z: 4 - index,
    },
  }));
}

export type StackedCardsRevealHorizontalProps = {
  cards?: RevealCard[];
};

export default function StackedCardsRevealHorizontal({
  cards: cardsProp = defaultCards,
}: StackedCardsRevealHorizontalProps) {
  const cards = cardsProp.length > 0 ? cardsProp : defaultCards;
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 1200, height: 900 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    const updateProgress = () => {
      const driver = document.getElementById("stacked-cards-h-driver");
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
    () => getCardDefs(viewport.width, cards.length),
    [viewport.width, cards.length],
  );
  const middleIndex = Math.floor(cards.length / 2);
  const activeZoomIndex = hoveredIndex ?? middleIndex;

  const textOpacity = {
    title: 0.18 + 0.62 * progress,
    body: 0.22 + 0.6 * progress,
  } as const;

  return (
    <section className="w-full bg-white text-black">
      <div id="stacked-cards-h-driver" className="h-[300vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-2">
            {cards.map((card, index) => {
              const def = cardDefs[index];
              const ox = lerp(def.start.ox, def.end.ox, progress);
              const oy = lerp(def.start.oy, def.end.oy, progress);
              const rotation = lerp(def.start.r, def.end.r, progress);
              const isActiveCard = index === activeZoomIndex;
              const scale = isActiveCard ? lerp(1, 1.1, progress) : 1;
              const activeShadowBoost = isActiveCard ? progress : 0;
              const left = viewport.width / 2 - def.width / 2 + ox;
              const top = viewport.height / 2 - def.height / 2 + oy;

              return (
                <article
                  key={card.id}
                  className="absolute flex flex-col justify-between overflow-hidden rounded-[18px] border border-zinc-200/90 bg-zinc-50/95 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.08)]"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    width: `${def.width}px`,
                    height: `${def.height}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    zIndex: isActiveCard ? cards.length + 10 : def.start.z,
                    boxShadow: isActiveCard
                      ? `0 ${Math.round(12 + 8 * activeShadowBoost)}px ${Math.round(44 + 8 * activeShadowBoost)}px rgba(0,0,0,${(0.14 + 0.1 * activeShadowBoost).toFixed(3)}), 0 ${Math.round(4 + 2 * activeShadowBoost)}px ${Math.round(14 + 4 * activeShadowBoost)}px rgba(0,0,0,${(0.08 + 0.05 * activeShadowBoost).toFixed(3)})`
                      : undefined,
                  }}
                >
                  <h3
                    className="text-balance text-base font-semibold leading-snug tracking-tight text-zinc-900"
                    style={{ opacity: textOpacity.title }}
                  >
                    {card.title}
                  </h3>
                  <div
                    className="text-pretty text-[0.82rem] leading-[1.55] text-zinc-600"
                    style={{ opacity: textOpacity.body }}
                  >
                    {card.description}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
