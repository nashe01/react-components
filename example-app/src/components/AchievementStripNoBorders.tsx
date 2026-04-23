type AchievementItem = {
  text: string;
  path: string;
};

const items: AchievementItem[] = [
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
];

export default function AchievementStripNoBorders() {
  return (
    <div className="mx-auto w-full max-w-[900px] bg-white px-10 py-7">
      <div className="flex items-center justify-between gap-6">
        {items.map((item, index) => (
          <div
            key={item.text}
            className={`flex flex-1 items-center gap-4 ${
              index > 0 ? "border-l border-[#e0e0e0] pl-6" : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 shrink-0 fill-[#111]"
              aria-hidden="true"
            >
              <path d={item.path} />
            </svg>
            <p className="text-[0.95rem] leading-[1.45] font-normal text-[#111]">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
