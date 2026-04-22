import AccordionCards from "./components/AccordionCards";
import AchievementInfinityStrip from "./components/AchievementInfinityStrip";
import AchievementStrip from "./components/AchievementStrip";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col gap-10 bg-white p-6">
      <AccordionCards />
      <AchievementStrip />
      <AchievementInfinityStrip />
    </main>
  );
}
