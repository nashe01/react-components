import type { Meta, StoryObj } from "@storybook/react-vite";
import AccordionCards from "./AccordionCards";
import AchievementInfinityStrip from "./AchievementInfinityStrip";
import AchievementInfinityStripCenteredNoBorders from "./AchievementInfinityStripCenteredNoBorders";
import AchievementStrip from "./AchievementStrip";
import AchievementStripNoBorders from "./AchievementStripNoBorders";
import StackedCardsReveal from "./StackedCardsReveal";
import StackedCardsRevealHorizontal from "./StackedCardsRevealHorizontal";

const meta = {
  title: "Components/Library",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccordionCardsStory: Story = {
  name: "Accordion Cards",
  render: () => <AccordionCards />,
};

export const AchievementStripStory: Story = {
  name: "Achievement Strip",
  render: () => <AchievementStrip />,
};

export const AchievementStripNoBordersStory: Story = {
  name: "Achievement Strip No Borders",
  render: () => <AchievementStripNoBorders />,
};

export const AchievementInfinityStripStory: Story = {
  name: "Achievement Infinity Strip",
  render: () => <AchievementInfinityStrip />,
};

export const AchievementInfinityStripCenteredNoBordersStory: Story = {
  name: "Achievement Infinity Strip Centered No Borders",
  render: () => <AchievementInfinityStripCenteredNoBorders />,
};

export const StackedCardsRevealStory: Story = {
  name: "Stacked Cards Reveal",
  render: () => <StackedCardsReveal />,
};

export const StackedCardsRevealHorizontalStory: Story = {
  name: "Stacked Cards Reveal Horizontal",
  render: () => <StackedCardsRevealHorizontal />,
};
