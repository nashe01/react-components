import { useEffect, useRef, useState } from "react";

type Profile = {
  id: string;
  img: string;
  name: string;
  role: string;
  bio: string;
  linkedin: string | null;
};

type TeamMember = {
  name: string;
  role: string;
  linkedin: string;
};

const profiles: Profile[] = [
  {
    id: "felix",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/felix-new-1.jpg",
    name: "Felix Wong, PhD",
    role: "Chief Executive Officer & Co-founder",
    bio: "Felix co-founded Integrated Bio after serving as an NIH-funded independent fellow at the Broad Institute of MIT and Harvard. He brings over a decade of experience at the intersection of AI and biology. His research has been published in over 30 scientific papers and in leading journals such as Nature, Science, and Cell, and he has contributed to breakthroughs in the discovery of next-generation therapeutics, including senolytics. Felix holds degrees in applied physics, computer science, and mathematics from Harvard University, where he focused on the application of soft condensed matter and statistical physics to biology.",
    linkedin: "https://www.linkedin.com/in/felixjwong/",
  },
  {
    id: "max",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/max_final.jpg",
    name: "Max Wilson, PhD",
    role: "Chief Technology Officer & Co-founder",
    bio: "Max is driven by the conviction that biology is the ultimate engineering challenge. In his role at Integrated Bio, Max leads high-throughput screening technology and assay development. He is an Associate Professor at UC Santa Barbara, where since 2018 he has pioneered optogenetic systems: light-controlled tools that allow precise manipulation of cells, pathways and proteins, enabling the discovery of novel therapeutic strategies. Max holds degrees in molecular biology and biophysics from Princeton and has authored over 30 scientific papers in leading journals such as Cell, Nature Biotechnology, and Nature Chemical Biology.",
    linkedin: "https://www.linkedin.com/in/max-wilson-b2671138/",
  },
  {
    id: "dan",
    img: "https://integratedbio.com/wp-content/uploads/2026/01/dan.jpg",
    name: "Dan Anderson, PhD",
    role: "Chief Scientific Officer",
    bio: "Dan is a seasoned drug discovery leader with over 20 years of biotechnology experience, known for building and scaling high-impact research organizations. Most recently, he served as Chief Scientific Officer of Eikon Therapeutics, where he oversaw all research and preclinical development, managing a team of 130 scientists. Dan was instrumental in launching Eikon in 2019 and building its drug discovery pipeline. Prior to Eikon, Dan served as Vice President of Biology at Recursion Pharmaceuticals. Earlier in his career, Dan led biology at Cleave Biosciences and started his industry career at Genentech. Since earning his PhD in cell biology and biochemistry from UC San Diego, Dan has focused on bringing cutting-edge technology and data science approaches to drug discovery, advancing 10 programs into the clinic and publishing over 25 scientific papers.",
    linkedin: "https://www.linkedin.com/in/daniel-j-anderson-489886b/",
  },
  {
    id: "zuzanna",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/zuzanna.jpg",
    name: "Zuzanna Brzosko, PhD",
    role: "Chief Business Officer",
    bio: "Zuzanna combines deep expertise in biotechnology with a strong track record in business development and venture. Prior to joining Integrated, she served as Senior Director of Corporate Business Development at Eli Lilly & Company, where she executed a broad range of deals, including licensing agreements, strategic collaborations, equity investments, and M&A transactions. Earlier, she worked in pharma and biotech equity research at Goldman Sachs and co-founded a Y Combinator-backed biotech company, serving as its CEO. Zuzanna holds degrees in neuroscience and biological sciences from Cambridge University and Oxford University.",
    linkedin: "https://www.linkedin.com/in/zuzannabrzosko/",
  },
];

const leadershipIds = ["felix", "max", "dan", "zuzanna"] as const;
const sabIds = ["collins", "macmillan", "young", "alon", "tony"] as const;

const teamMembers: TeamMember[] = [
  {
    name: "Sean Brown, PhD",
    role: "Head of Medicinal Chemistry",
    linkedin: "https://www.linkedin.com/in/sean-brown-80058651/",
  },
  {
    name: "Dan Whalen, PhD",
    role: "Head of Biochemistry",
    linkedin: "https://www.linkedin.com/in/dan-whalen-protein-sciences/",
  },
  {
    name: "Satotaka Omori, PhD",
    role: "Head of Aging Biology",
    linkedin: "https://www.linkedin.com/in/satotaka-omori-b99146230/",
  },
  {
    name: "Brent Lyda, PhD",
    role: "Head of Discovery Chemistry",
    linkedin: "https://www.linkedin.com/in/brent-l-a221a572/",
  },
  {
    name: "Alex Peysakhovich, PhD",
    role: "Head of AI",
    linkedin: "https://www.linkedin.com/in/alex-peysakhovich-72336154/",
  },
  {
    name: "Yunke (Claudia) Ren, PhD",
    role: "Senior Research Scientist",
    linkedin: "https://www.linkedin.com/in/yunke-claudia-ren/",
  },
  {
    name: "Huixun (Zoe) Du, PhD",
    role: "Research Scientist",
    linkedin: "https://www.linkedin.com/in/huixun-zoe-du/",
  },
  {
    name: "Natsuki Furukawa, PhD",
    role: "Research Scientist",
    linkedin: "https://www.linkedin.com/in/natsuki-furukawa/",
  },
  {
    name: "Will Berman, BS",
    role: "ML Engineer",
    linkedin: "https://www.linkedin.com/in/william-berman-a8581a132/",
  },
  {
    name: "Ahmed Alhadid, BS",
    role: "Research Associate",
    linkedin: "https://www.linkedin.com/in/ahmedalhadid/",
  },
  {
    name: "Alex Godfrey, BS",
    role: "Codepoint Fellow",
    linkedin: "https://www.linkedin.com/in/alexgodfreyapi/",
  },
  {
    name: "Amy Pellicane, BA",
    role: "Entrepreneur in Residence",
    linkedin: "https://www.linkedin.com/in/amy-pellicane-80330829/",
  },
  {
    name: "Lynda Medina, BA",
    role: "Vivarium Technician",
    linkedin: "https://www.linkedin.com/in/lynda-medina-641012162/",
  },
  {
    name: "Setareh Alipour, MS",
    role: "Vivarium Technician",
    linkedin: "https://www.linkedin.com/in/setareh-alipour/",
  },
];

const getProfile = (id: string) => profiles.find((profile) => profile.id === id);

export default function MeetTheTeamSection() {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [teamIndex, setTeamIndex] = useState(0);
  const [teamSlidesPerView, setTeamSlidesPerView] = useState(4);
  const [teamStepPx, setTeamStepPx] = useState(0);
  const teamTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProfile(null);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth <= 600) {
        setTeamSlidesPerView(1);
        return;
      }
      if (window.innerWidth <= 900) {
        setTeamSlidesPerView(2);
        return;
      }
      setTeamSlidesPerView(4);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    const updateTeamStep = () => {
      const firstCard = teamTrackRef.current?.querySelector(
        ".team-member",
      ) as HTMLElement | null;
      if (!firstCard) return;
      setTeamStepPx(firstCard.getBoundingClientRect().width + 12);
    };

    updateTeamStep();
    window.addEventListener("resize", updateTeamStep);
    return () => window.removeEventListener("resize", updateTeamStep);
  }, [teamSlidesPerView]);

  const maxTeamIndex = Math.max(0, teamMembers.length - teamSlidesPerView);

  useEffect(() => {
    setTeamIndex((current) => Math.min(current, maxTeamIndex));
  }, [maxTeamIndex]);

  const handleTeamPrev = () => {
    setTeamIndex((current) => Math.max(0, current - 1));
  };

  const handleTeamNext = () => {
    setTeamIndex((current) => Math.min(maxTeamIndex, current + 1));
  };

  return (
    <div className="bg-[#f9f8f6] font-['Georgia',serif] text-[#1a1a1a]">
      <div className="mx-auto max-w-[1100px] px-8 py-20 max-[600px]:px-5">
        <div className="mx-[calc(50%-48vw)] w-[96vw] bg-[#f0eeea] px-10 py-14 max-[900px]:px-5 max-[900px]:py-10">
          <div className="grid grid-cols-[380px_minmax(0,1fr)] items-start gap-[34px] max-[900px]:grid-cols-1 max-[900px]:gap-5">
            <div>
              <div className="mb-[18px] flex min-w-[120px] items-center gap-2">
                <div className="h-[14px] w-[14px] shrink-0 rounded-[2px] bg-[#9de05a]" />
                <span className="font-['Helvetica_Neue',Arial,sans-serif] text-[17px] font-medium uppercase tracking-[0.12em] text-[#888]">
                  Leadership
                </span>
              </div>
              <p className="max-w-[680px] text-[18px] leading-[1.65] text-[#555]">
                Our leadership team embodies our mission, combining expertise in
                synthetic biology, chemistry and AI to transform human health and
                aging.
              </p>
            </div>

            <div className="ml-20 mr-auto grid w-fit grid-cols-2 gap-y-3 gap-x-3">
              {leadershipIds.map((id) => {
                const profile = getProfile(id);
                if (!profile) return null;
                return (
                  <div
                    key={profile.id}
                    className="group max-w-[420px] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.38)] [backdrop-filter:blur(14px)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1.5 hover:border-[rgba(255,255,255,0.6)] hover:shadow-[0_22px_40px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)]"
                    onClick={() => setActiveProfile(profile)}
                  >
                    <div className="relative overflow-hidden px-[9px] pt-[9px]">
                      <img
                        src={profile.img}
                        alt={profile.name}
                        className="block aspect-[1.45/1] w-full rounded-xl object-cover transition-[transform,filter] duration-200 [filter:grayscale(0.6)_saturate(0.8)_contrast(1.05)] group-hover:scale-[1.03] group-hover:[filter:grayscale(0.45)_saturate(0.95)_contrast(1.08)]"
                        onError={(event) => {
                          const target = event.currentTarget;
                          target.onerror = null;
                          target.src =
                            "https://placehold.co/300x400/e8e4dc/888?text=Photo";
                        }}
                      />
                      {profile.linkedin ? (
                        <a
                          href={profile.linkedin}
                          className="absolute bottom-[10px] right-[18px] inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#111] text-[12px] font-bold text-white no-underline"
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`${profile.name} LinkedIn`}
                        >
                          in
                        </a>
                      ) : null}
                    </div>

                    <div className="px-[14px] pt-[14px]">
                      <div className="font-['Helvetica_Neue',Arial,sans-serif] text-[24px] font-medium leading-none tracking-[-0.02em] text-[#1a1a1a]">
                        {profile.name}
                      </div>
                      <div className="mb-[18px] mt-2 font-['Helvetica_Neue',Arial,sans-serif] text-[10px] uppercase tracking-[0.12em] text-[#8b8b8b]">
                        {profile.role}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#ebebeb] pb-2 pt-3">
                      <span className="ml-4 font-['Helvetica_Neue',Arial,sans-serif] text-[11px] font-medium uppercase tracking-[0.08em] text-[#1a1a1a]">
                        View profile
                      </span>
                      <span
                        className="mr-0 inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px_0_0_10px] bg-[#c8f26b] text-base font-semibold text-[#1a1a1a] transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-[#b8ea49]"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <hr className="my-16 border-0 border-t border-[#ddd]" />

        <div className="mx-[calc(50%-48vw)] w-[96vw] bg-[#f0eeea] px-10 py-14 max-[600px]:px-5 max-[600px]:py-10">
          <div className="mb-[68px] grid grid-cols-[auto_minmax(0,1fr)] items-start gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-5">
            <div className="flex min-w-[120px] items-center gap-2">
              <div className="h-[14px] w-[14px] shrink-0 rounded-[2px] bg-[#9de05a]" />
              <span className="font-['Helvetica_Neue',Arial,sans-serif] text-[20px] font-medium uppercase tracking-[0.12em] text-[#888]">
                Team
              </span>
            </div>
            <h2 className="w-full max-w-[640px] justify-self-center font-['Helvetica_Neue',Arial,sans-serif] text-[34px] font-normal leading-[1.2] text-[#1a1a1a] max-[900px]:text-[24px]">
              Our team thrives on bold ideas, challenges conventional thinking,
              and shapes how transformative medicines are discovered.
            </h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                ref={teamTrackRef}
                className="team-grid flex gap-3 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  transform: `translateX(-${teamIndex * teamStepPx}px)`,
                }}
              >
                {teamMembers.map((member) => (
                  <article
                    key={member.name}
                    className="team-member flex min-h-[220px] min-w-[calc(25%-9px)] flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.38)] p-6 [backdrop-filter:blur(14px)] max-[900px]:min-w-[calc(50%-6px)] max-[600px]:min-w-full"
                  >
                    <div className="flex-1">
                      <div className="font-['Helvetica_Neue',Arial,sans-serif] text-[18px] font-medium leading-[1.35] text-[#1a1a1a]">
                        {member.name}
                      </div>
                      <div className="mt-1.5 font-['Helvetica_Neue',Arial,sans-serif] text-[11px] font-medium uppercase tracking-[0.1em] text-[#8c8c8c]">
                        {member.role}
                      </div>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <a
                        className="font-['Helvetica_Neue',Arial,sans-serif] text-[11px] font-medium uppercase tracking-[0.1em] text-[#888] no-underline"
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                      <a
                        className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#9de05a] no-underline"
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="#1a1a1a"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div
              className="mt-5 flex justify-end gap-2"
              role="group"
              aria-label="Team carousel navigation"
            >
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#ccc] bg-white text-[#1a1a1a] transition hover:bg-[#f0eeea] disabled:cursor-default disabled:opacity-30"
                onClick={handleTeamPrev}
                disabled={teamIndex === 0}
                aria-label="Previous team members"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M10 12L6 8l4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#ccc] bg-white text-[#1a1a1a] transition hover:bg-[#f0eeea] disabled:cursor-default disabled:opacity-30"
                onClick={handleTeamNext}
                disabled={teamIndex >= maxTeamIndex}
                aria-label="Next team members"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
          {sabIds.map((id) => {
            const profile = getProfile(id);
            if (!profile) return null;
            return (
              <div
                key={profile.id}
                className="cursor-pointer rounded-[14px] border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.34)] p-[14px] [backdrop-filter:blur(12px)]"
                onClick={() => setActiveProfile(profile)}
              >
                <div>
                  <img
                    src={profile.img}
                    alt={profile.name}
                    className="mb-3 block aspect-square w-full object-cover"
                    onError={(event) => {
                      const target = event.currentTarget;
                      target.onerror = null;
                      target.src =
                        "https://placehold.co/200x200/e8e4dc/888?text=Photo";
                    }}
                  />
                </div>
                <div className="font-['Helvetica_Neue',Arial,sans-serif] text-[13px] font-semibold text-[#1a1a1a]">
                  {profile.name}
                </div>
                <div className="mb-2 mt-[3px] font-['Helvetica_Neue',Arial,sans-serif] text-[11px] leading-[1.4] text-[#888]">
                  {profile.role}
                </div>
                <span className="cursor-pointer font-['Helvetica_Neue',Arial,sans-serif] text-[11px] font-medium uppercase tracking-[0.08em] text-[#1a1a1a]">
                  View profile
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[100] flex items-stretch justify-end bg-[rgba(8,13,16,0.55)] p-0 transition-[opacity,visibility] duration-[260ms] ${activeProfile ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setActiveProfile(null);
          }
        }}
      >
        <button
          className={`fixed right-[min(428px,calc(100vw-8px))] top-[10px] z-[101] inline-flex h-9 w-9 items-center justify-center rounded-[11px] border-0 bg-[#bdf06a] text-[19px] leading-none text-[#1d261b] transition-[transform,opacity] duration-300 max-[600px]:right-3 max-[600px]:top-2 ${activeProfile ? "translate-x-0 opacity-100" : "translate-x-[14px] opacity-0"}`}
          onClick={() => setActiveProfile(null)}
          aria-label="Close profile modal"
        >
          &#x2715;
        </button>
        <div
          className={`h-screen w-full max-w-[420px] overflow-y-auto border-l border-[rgba(193,220,228,0.2)] bg-[linear-gradient(145deg,rgba(30,50,57,0.94),rgba(24,38,43,0.95))] p-[14px_18px_26px] shadow-[-14px_0_40px_rgba(0,0,0,0.38)] transition-[transform,opacity] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] max-[600px]:p-[12px_12px_24px] ${activeProfile ? "translate-x-0 opacity-100" : "translate-x-[18px] opacity-0"}`}
        >
          <div className="w-full">
            <img
              src={activeProfile?.img ?? ""}
              alt={activeProfile?.name ?? ""}
              className={`block aspect-[1.45/1] w-full rounded-[14px] object-cover transition-[opacity,transform] duration-[520ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeProfile ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.985] opacity-0"}`}
              onError={(event) => {
                const target = event.currentTarget;
                target.onerror = null;
                target.src = "https://placehold.co/240x320/e8e4dc/888?text=Photo";
              }}
            />
          </div>
          <div className="px-[2px] pt-[18px]">
            <div
              className={`font-['Helvetica_Neue',Arial,sans-serif] text-[35px] font-medium leading-none tracking-[-0.02em] text-[#f4f7f8] max-[600px]:text-[29px] transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeProfile ? "translate-y-0 opacity-100" : "translate-y-[14px] opacity-0"}`}
              style={{ transitionDelay: activeProfile ? "520ms" : "0ms" }}
            >
              {activeProfile?.name ?? ""}
            </div>
            <div
              className={`mb-5 mt-2 font-['Helvetica_Neue',Arial,sans-serif] text-[11px] uppercase tracking-[0.12em] text-[rgba(216,229,233,0.76)] transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeProfile ? "translate-y-0 opacity-100" : "translate-y-[14px] opacity-0"}`}
              style={{ transitionDelay: activeProfile ? "700ms" : "0ms" }}
            >
              {activeProfile?.role ?? ""}
            </div>
            <p
              className={`mb-6 font-['Helvetica_Neue',Arial,sans-serif] text-[16px] font-medium leading-[1.4] text-[#f2f8fa] transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeProfile ? "translate-y-0 opacity-100" : "translate-y-[14px] opacity-0"}`}
              style={{ transitionDelay: activeProfile ? "860ms" : "0ms" }}
            >
              {activeProfile?.bio ?? ""}
            </p>
            {activeProfile?.linkedin ? (
              <a
                className={`font-['Helvetica_Neue',Arial,sans-serif] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f2f8fa] no-underline [border-bottom:1px_solid_rgba(242,248,250,0.7)] transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeProfile ? "translate-y-0 opacity-100" : "translate-y-[14px] opacity-0"}`}
                style={{ transitionDelay: activeProfile ? "1020ms" : "0ms" }}
                href={activeProfile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
