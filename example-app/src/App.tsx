import AccordionCards from "./components/AccordionCards";
import AchievementInfinityStrip from "./components/AchievementInfinityStrip";
import AchievementInfinityStripCenteredNoBorders from "./components/AchievementInfinityStripCenteredNoBorders";
import AchievementStrip from "./components/AchievementStrip";
import AchievementStripNoBorders from "./components/AchievementStripNoBorders";
import StackedCardsReveal from "./components/StackedCardsReveal";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col gap-10 bg-white p-6">
      <AccordionCards />
      <AchievementStrip />
      <AchievementStripNoBorders />
      <AchievementInfinityStrip />
      <AchievementInfinityStripCenteredNoBorders />
      <StackedCardsReveal />
    </main>
  );
}
