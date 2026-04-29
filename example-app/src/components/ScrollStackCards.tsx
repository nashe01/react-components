import { useEffect, useMemo, useState } from "react";

type ScrollStackCard = {
  id: string;
  
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const defaultCards: ScrollStackCard[] = [
  {
    id: "strategy",
    title: "Developers",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imageUrl: "https://placehold.co/1200x800/022731/ffffff?text=Placeholder+Image+1",
    imageAlt: "Placeholder image 1",
    primaryCtaLabel: "Book strategy call",
    primaryCtaHref: "#strategy",
    secondaryCtaLabel: "See framework",
    secondaryCtaHref: "#framework",
  },
  {
    id: "design",
    
    title: "Business",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum praesent mauris fusce nec tellus sed augue semper porta. Mauris massa vestibulum lacinia arcu eget nulla class aptent taciti sociosqu ad litora torquent.",
    imageUrl: "https://placehold.co/1200x800/022731/ffffff?text=Placeholder+Image+2",
    imageAlt: "Placeholder image 2",
    primaryCtaLabel: "Review messaging",
    primaryCtaHref: "#messaging",
    secondaryCtaLabel: "Get examples",
    secondaryCtaHref: "#examples",
  },
  {
    id: "build",
    
    title: "Wimates",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero sed dignissim lacinia nunc. Curabitur tortor pellentesque nibh aenean quam in scelerisque sem at dolor. Maecenas mattis sed convallis tristique sem proin ut ligula vel nunc egestas porttitor. Morbi lectus risus iaculis vel suscipit quis luctus non massa.",
    imageUrl: "https://placehold.co/1200x800/022731/ffffff?text=Placeholder+Image+3",
    imageAlt: "Placeholder image 3",
    primaryCtaLabel: "Start implementation",
    primaryCtaHref: "#implementation",
    secondaryCtaLabel: "View timeline",
    secondaryCtaHref: "#timeline",
  },
  {
    id: "optimize",
    
    title: "Partners",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec ante sed lacinia urna non tincidunt mattis tortor neque adipiscing diam. Aenean quam in scelerisque sem at dolor maecenas mattis sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor morbi lectus risus. Cras mattis consectetur purus sit amet fermentum donec ullamcorper nulla non metus.",
    imageUrl: "https://placehold.co/1200x800/022731/ffffff?text=Placeholder+Image+4",
    imageAlt: "Placeholder image 4",
    primaryCtaLabel: "Open analytics plan",
    primaryCtaHref: "#analytics",
    secondaryCtaLabel: "Talk to expert",
    secondaryCtaHref: "#expert",
  },
  {
    id: "scale",
    
    title: "Country and currency",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Cras justo odio dapibus ac facilisis in egestas eget quam.",
    imageUrl: "https://placehold.co/1200x800/022731/ffffff?text=Placeholder+Image+5",
    imageAlt: "Placeholder image 5",
    primaryCtaLabel: "Plan next quarter",
    primaryCtaHref: "#quarter",
    secondaryCtaLabel: "Download checklist",
    secondaryCtaHref: "#checklist",
  },
  {
    id: "retention",
    
    title: "carriers",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus auctor fringilla aenean eu leo quam pellentesque ornare. Maecenas faucibus mollis interdum sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur donec id elit non mi porta.",
    imageUrl: "https://placehold.co/1200x800/022731/ffffff?text=Placeholder+Image+6",
    imageAlt: "Placeholder image 6",
    primaryCtaLabel: "Improve retention",
    primaryCtaHref: "#retention",
    secondaryCtaLabel: "See lifecycle map",
    secondaryCtaHref: "#lifecycle",
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

  const renderCardBody = (card: ScrollStackCard) => (
    <div className="ssc-card-grid">
      <div className="ssc-card-content">
        <div className="ssc-copy-block">

          <h3 className="ssc-title">
            {card.title}
          </h3>
          <p className="ssc-description">
            {card.description}
          </p>
        </div>
        <div className="ssc-cta-row">
          <a
            className="ssc-cta ssc-cta-primary"
            href={card.primaryCtaHref}
          >
            {card.primaryCtaLabel}
          </a>
          {card.secondaryCtaLabel && card.secondaryCtaHref ? (
            <a
              className="ssc-cta ssc-cta-secondary"
              href={card.secondaryCtaHref}
            >
              {card.secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
      <div className="ssc-image-wrap">
        <img
          src={card.imageUrl}
          alt={card.imageAlt}
          className="ssc-image"
          loading="lazy"
        />
      </div>
    </div>
  );

  return (
    <section className="ssc-root">
      

      <div id="scroll-stack-cards-driver" className="ssc-driver">
        <div className="ssc-sticky">
          {cards.map((card, index) => {
            if (index === 0) {
              return (
                <article
                  key={card.id}
                  className="ssc-card"
                  style={{
                    transform: `translateY(${(cards.length - 1) * stackPeekY}px)`,
                    zIndex: cards.length,
                  }}
                >
                  {renderCardBody(card)}
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
                className="ssc-card"
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  zIndex: cards.length + index,
                }}
              >
                {renderCardBody(card)}
              </article>
            );
          })}
        </div>
      </div>
      <style>{`
        .ssc-root {
          width: 100%;
          background: #ecfdf5;
          color: #18181b;
        }
        .ssc-driver {
          position: relative;
          height: 900vh;
        }
        .ssc-sticky {
          position: sticky;
          top: 0;
          display: flex;
          height: 100vh;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 0 1rem;
        }
        .ssc-card {
          position: absolute;
          height: 50vh;
          min-height: 360px;
          width: 80vw;
          max-width: 1200px;
          border-radius: 1rem;
          border: 1px solid #e4e4e7;
          background: #fff;
          padding: 1.5rem;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
        }
        .ssc-card-grid {
          display: grid;
          height: 100%;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        .ssc-card-content {
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 1rem;
        }
        .ssc-copy-block {
          display: grid;
          gap: 1rem;
        }
        .ssc-title {
          text-wrap: balance;
          font-family: Georgia, serif;
          font-size: 1.875rem;
          font-weight: 300;
          color: #18181b;
          margin: 0;
        }
        .ssc-description {
          text-wrap: pretty;
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.75rem;
          color: #52525b;
        }
        .ssc-cta-row {
          margin-top: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .ssc-cta {
          border-radius: 999px;
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 160ms ease;
        }
        .ssc-cta-primary {
          background: #047857;
          color: #fff;
        }
        .ssc-cta-primary:hover {
          background: #065f46;
        }
        .ssc-cta-secondary {
          border: 1px solid #d4d4d8;
          color: #3f3f46;
        }
        .ssc-cta-secondary:hover {
          border-color: #a1a1aa;
          color: #18181b;
        }
        .ssc-image-wrap {
          position: relative;
          height: 170px;
          overflow: hidden;
          border-radius: 1rem;
          background: #e4e4e7;
        }
        .ssc-image {
          height: 100%;
          width: 100%;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 768px) {
          .ssc-card {
            padding: 2rem;
          }
          .ssc-card-grid {
            grid-template-columns: 1.35fr 0.65fr;
            gap: 2rem;
          }
          .ssc-card-content {
            padding-top: 1.5rem;
          }
          .ssc-title {
            font-size: 2.25rem;
          }
          .ssc-description {
            font-size: 1rem;
          }
          .ssc-image-wrap {
            margin-left: -2rem;
            height: 100%;
            min-height: 220px;
          }
        }
      `}</style>
    </section>
  );
}
