import { useState } from "react";

type Card = {
  title: string;
  description: string;
  image: string;
};

const cards: Card[] = [
  {
    title: "1. Discover",
    description:
      "We begin with in-depth discovery sessions to fully understand your brand, goals, and audience.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop",
  },
  {
    title: "2. Define",
    description:
      "We create a clear roadmap. It's strategy meets creativity to set the right foundation.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&auto=format&fit=crop",
  },
  {
    title: "3. Develop",
    description:
      "Our engineers bring designs to life with clean, scalable, and performant code.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
  },

];

function CardIcon({ index }: { index: number }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-10 w-10 fill-none stroke-white [stroke-width:1.6]",
  };

  if (index === 0) {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="8" width="7" height="7" rx="1" />
        <line x1="6.5" y1="10" x2="6.5" y2="20" strokeLinecap="round" />
        <line x1="6.5" y1="20" x2="17.5" y2="20" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <circle cx="5" cy="8" r="3" />
        <circle cx="19" cy="8" r="3" />
        <line x1="8" y1="10" x2="12" y2="12" />
        <line x1="16" y1="10" x2="12" y2="12" />
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg {...common}>
        <rect x="2" y="3" width="14" height="10" rx="1.5" />
        <polyline points="16 8 22 8 22 21 2 21 2 13" />
        <line x1="9" y1="17" x2="9" y2="21" />
        <line x1="6" y1="21" x2="12" y2="21" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 17l6-6 4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AccordionCards() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0ee] p-6 font-sans">
      <div
        className="flex h-[420px] w-full max-w-[760px] gap-3.5"
        onMouseLeave={() => setActiveIndex(0)}
      >
        {cards.map((card, index) => {
          const isActive = activeIndex === index;

          return (
            <article
              key={card.title}
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative cursor-pointer overflow-hidden rounded-[20px] transition-[flex] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                isActive ? "flex-[3.5]" : "flex-[0.35]"
              }`}
            >
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute inset-0 rounded-[inherit] bg-linear-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute left-4 top-4 z-10">
                <CardIcon index={index} />
              </div>
              <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
                <div
                  className={`text-lg font-bold tracking-[0.03em] whitespace-nowrap [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {card.title}
                </div>
                <h3
                  className={`mb-2 text-[1.65rem] font-extrabold leading-[1.1] transition-all duration-300 ${
                    isActive ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`max-w-[300px] text-[0.85rem] leading-normal transition-all duration-300 ${
                    isActive ? "translate-y-0 opacity-100 delay-280" : "translate-y-[10px] opacity-0"
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
