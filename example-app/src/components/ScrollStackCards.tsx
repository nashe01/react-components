import { useEffect, useMemo, useState } from "react";

type ScrollStackCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const defaultCards: ScrollStackCard[] = [
  {
    id: "strategy",
    eyebrow: "Phase 01",
    title: "Define your launch strategy",
    description:
      "Shape your positioning, audience, and rollout plan with a clear narrative your team can execute.",
    primaryCtaLabel: "Book strategy call",
    primaryCtaHref: "#strategy",
    secondaryCtaLabel: "See framework",
    secondaryCtaHref: "#framework",
  },
  {
    id: "design",
    eyebrow: "Phase 02",
    title: "Craft a message that converts",
    description:
      "Turn ideas into concise copy blocks and visual direction your users understand in seconds.",
    primaryCtaLabel: "Review messaging",
    primaryCtaHref: "#messaging",
    secondaryCtaLabel: "Get examples",
    secondaryCtaHref: "#examples",
  },
  {
    id: "build",
    eyebrow: "Phase 03",
    title: "Build and ship with confidence",
    description:
      "Ship faster with component-ready tasks, clear owners, and measurable release checkpoints.",
    primaryCtaLabel: "Start implementation",
    primaryCtaHref: "#implementation",
    secondaryCtaLabel: "View timeline",
    secondaryCtaHref: "#timeline",
  },
  {
    id: "optimize",
    eyebrow: "Phase 04",
    title: "Optimize with real usage data",
    description:
      "Use post-launch signals to prioritize what matters and keep improving conversion over time.",
    primaryCtaLabel: "Open analytics plan",
    primaryCtaHref: "#analytics",
    secondaryCtaLabel: "Talk to expert",
    secondaryCtaHref: "#expert",
  },
  {
    id: "scale",
    eyebrow: "Phase 05",
    title: "Scale your next growth chapter",
    description:
      "Move from one successful release to a repeatable growth system supported by your team.",
    primaryCtaLabel: "Plan next quarter",
    primaryCtaHref: "#quarter",
    secondaryCtaLabel: "Download checklist",
    secondaryCtaHref: "#checklist",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type ScrollStackCardsProps = {
  cards?: ScrollStackCard[];
};

export default function ScrollStackCards({ cards: cardsProp }: ScrollStackCardsProps) {
  const cards = useMemo(
    () => (cardsProp && cardsProp.length > 0 ? cardsProp : defaultCards),
    [cardsProp],
  );

  const [progress, setProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(900);

  useEffect(() => {
    const updateProgress = () => {
      const section = document.getElementById("scroll-stack-cards-driver");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;

      if (total <= 0) {
        setProgress(0);
        return;
      }

      setProgress(clamp(-rect.top / total, 0, 1));
    };

    const updateViewport = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewport();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const steps = cards.length > 1 ? cards.length - 1 : 1;
  const stackPeekY = 14;

  return (
    <section className="w-full bg-emerald-50 text-zinc-900">
      

      <div id="scroll-stack-cards-driver" className="relative h-[900vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4">
          {cards.map((card, index) => {
            if (index === 0) {
              return (
                <article
                  key={card.id}
                  className="absolute h-[50vh] min-h-[360px] w-[80vw] max-w-[1200px] rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.12)] md:p-8"
                  style={{
                    transform: `translateY(${(cards.length - 1) * stackPeekY}px)`,
                    zIndex: cards.length,
                  }}
                >
                  <div className="space-y-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                      {card.eyebrow}
                    </p>
                    <h3 className="text-balance font-serif text-3xl font-light text-zinc-900 md:text-4xl">
                      {card.title}
                    </h3>
                    <p className="text-pretty text-sm leading-7 text-zinc-600 md:text-base">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                      href={card.primaryCtaHref}
                    >
                      {card.primaryCtaLabel}
                    </a>
                    {card.secondaryCtaLabel && card.secondaryCtaHref ? (
                      <a
                        className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
                        href={card.secondaryCtaHref}
                      >
                        {card.secondaryCtaLabel}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            }

            const step = 1 / steps;
            const cardProgress = clamp((progress - (index - 1) * step) / step, 0, 1);
            const eased = easeOutCubic(cardProgress);
            const finalY = (cards.length - 1 - index) * stackPeekY;
            const translateY = lerp(viewportHeight * 0.7, finalY, eased);
            const scale = lerp(0.92, 1, eased);
            const opacity = cardProgress < 0.05 ? lerp(0, 1, cardProgress / 0.05) : 1;

            return (
              <article
                key={card.id}
                className="absolute h-[50vh] min-h-[360px] w-[80vw] max-w-[1200px] rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.12)] md:p-8"
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  zIndex: cards.length + index,
                }}
              >
                <div className="space-y-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                    {card.eyebrow}
                  </p>
                  <h3 className="text-balance font-serif text-3xl font-light text-zinc-900 md:text-4xl">
                    {card.title}
                  </h3>
                  <p className="text-pretty text-sm leading-7 text-zinc-600 md:text-base">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                    href={card.primaryCtaHref}
                  >
                    {card.primaryCtaLabel}
                  </a>
                  {card.secondaryCtaLabel && card.secondaryCtaHref ? (
                    <a
                      className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
                      href={card.secondaryCtaHref}
                    >
                      {card.secondaryCtaLabel}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
