import type { Meta, StoryObj } from "@storybook/react-vite";
import AccordionCards from "./AccordionCards";
import AchievementInfinityStrip from "./AchievementInfinityStrip";
import AchievementInfinityStripCenteredNoBorders from "./AchievementInfinityStripCenteredNoBorders";
import AchievementStrip from "./AchievementStrip";
import AchievementStripNoBorders from "./AchievementStripNoBorders";
import StackedCardsReveal from "./StackedCardsReveal";
import StackedCardsRevealHorizontal from "./StackedCardsRevealHorizontal";
import StackedCardsRevealHorizontalFourCards from "./StackedCardsRevealHorizontalFourCards";
import ScrollStackCards from "./ScrollStackCards";

const meta = {
  title: "Components/Library",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type LibraryStory = StoryObj<typeof meta>;
type AccordionCardsStoryType = StoryObj<typeof AccordionCards>;
type StackedCardsRevealHorizontalStoryType = StoryObj<
  typeof StackedCardsRevealHorizontal
>;
type ScrollStackCardsStoryType = StoryObj<typeof ScrollStackCards>;
type AccordionCardsProps = Parameters<typeof AccordionCards>[0];
type StackedCardsRevealHorizontalProps = Parameters<
  typeof StackedCardsRevealHorizontal
>[0];
type ScrollStackCardsProps = Parameters<typeof ScrollStackCards>[0];

const accordionCardsControlData: NonNullable<AccordionCardsProps["cards"]> = [
  {
    id: "discover",
    title: "1. Discover",
    description:
      "We begin with in-depth discovery sessions to fully understand your brand, goals, and audience.",
    imageSrc:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop",
    imageAlt: "Team collaborating around a table",
  },
  {
    id: "define",
    title: "2. Define",
    description:
      "We create a clear roadmap. It's strategy meets creativity to set the right foundation.",
    imageSrc:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&auto=format&fit=crop",
    imageAlt: "People planning in front of laptops",
  },
  {
    id: "develop",
    title: "3. Develop",
    description:
      "Our engineers bring designs to life with clean, scalable, and performant code.",
    imageSrc:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
    imageAlt: "Developer workspace with code on screen",
  },
];

const stackedHorizontalControlData: NonNullable<
  StackedCardsRevealHorizontalProps["cards"]
> = [
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

const scrollStackCardsControlData: NonNullable<ScrollStackCardsProps["cards"]> = [
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
];

export const AccordionCardsStory: AccordionCardsStoryType = {
  name: "Accordion Cards",
  args: {
    initialActiveIndex: 0,
    cards: accordionCardsControlData,
  },
  argTypes: {
    initialActiveIndex: {
      control: { type: "number", min: 0, step: 1 },
      description: "Card index active on initial render.",
    },
    cards: {
      control: "object",
      description: "Cards to render in the accordion.",
    },
  },
  render: (args) => <AccordionCards {...args} />,
};

export const AchievementStripStory: LibraryStory = {
  name: "Achievement Strip",
  render: () => <AchievementStrip />,
};

export const AchievementStripNoBordersStory: LibraryStory = {
  name: "Achievement Strip No Borders",
  render: () => <AchievementStripNoBorders />,
};

export const AchievementInfinityStripStory: LibraryStory = {
  name: "Achievement Infinity Strip",
  render: () => <AchievementInfinityStrip />,
};

export const AchievementInfinityStripCenteredNoBordersStory: LibraryStory = {
  name: "Achievement Infinity Strip Centered No Borders",
  render: () => <AchievementInfinityStripCenteredNoBorders />,
};

export const StackedCardsRevealStory: LibraryStory = {
  name: "Stacked Cards Reveal",
  render: () => <StackedCardsReveal />,
};

export const StackedCardsRevealHorizontalStory: StackedCardsRevealHorizontalStoryType =
  {
  name: "Stacked Cards Reveal Horizontal",
  args: {
    cards: stackedHorizontalControlData,
  },
  argTypes: {
    cards: {
      control: "object",
      description: "Horizontal reveal card content.",
    },
  },
  render: (args) => <StackedCardsRevealHorizontal {...args} />,
  };

export const StackedCardsRevealHorizontalFourCardsStory: LibraryStory = {
  name: "Stacked Cards Reveal Horizontal 4 Cards",
  render: () => <StackedCardsRevealHorizontalFourCards />,
};

export const ScrollStackCardsStory: ScrollStackCardsStoryType = {
  name: "Scroll Stack Cards",
  args: {
    cards: scrollStackCardsControlData,
  },
  argTypes: {
    cards: {
      control: "object",
      description: "Text-only stacked card content with CTA labels and links.",
    },
  },
  render: (args) => <ScrollStackCards {...args} />,
};
