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

type AchievementItem = {
  text: string;
  path: string;
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

const achievementItems: AchievementItem[] = [
  {
    text: "Rated 4.7 on Trustpilot",
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    text: "Used by 70+ million customers worldwide",
    path: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  },
  {
    text: "'Most Innovative Company in Personal Finance 2024' by FastCompany",
    path: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V18H7v2h10v-2h-4v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z",
  },
  {
    text: "Secure transfers protected\nby advanced encryption",
    path: "M12 1.75a10.25 10.25 0 100 20.5 10.25 10.25 0 000-20.5zm0 1.5a8.75 8.75 0 018.75 8.75A8.75 8.75 0 1112 3.25zm-.75 3.5v5.56l4.29 2.57.77-1.29-3.56-2.14V6.75h-1.5z",
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
  const stackYOffset = 116;

  return (
    <section className="w-full bg-white text-black">
      <div id="stacked-cards-h-driver" className="h-[300vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <h2 className="pointer-events-none absolute top-52 z-20 text-center text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Stacked Cards Reveal Horizontal
          </h2>
          <div className="absolute -top-8 z-20 w-full px-4">
            <div className="mx-auto w-full max-w-[1220px] bg-white px-8 py-7">
              <div className="grid grid-cols-4 gap-6">
                {achievementItems.map((item, index) => (
                  <div
                    key={item.text}
                    className={`flex items-center gap-4 ${index > 0 ? "border-l border-[#e0e0e0] pl-6" : ""}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-8 w-8 shrink-0 fill-[#111]"
                      aria-hidden="true"
                    >
                      <path d={item.path} />
                    </svg>
                    <p className="whitespace-pre-line text-[0.95rem] font-normal leading-[1.45] text-[#111] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              const top = viewport.height / 2 - def.height / 2 + oy + stackYOffset;

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
