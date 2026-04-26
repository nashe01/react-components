import { useEffect, useState } from "react";

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
  {
    id: "collins",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/Collins-2.jpg",
    name: "Jim Collins, PhD",
    role: "Scientific Co-founder & SAB Chair, Professor at MIT",
    bio: "Jim holds the Termeer Professorship at MIT and appointments in biological engineering and at the Harvard-MIT Health Sciences & Technology program. He is a founding faculty member of the Wyss Institute and an institute member at the Broad Institute. His patented technologies have been licensed by over 25 biotech, pharmaceutical, and medical device companies. Jim has received numerous prestigious awards, including a MacArthur Genius Award and the Dickson Prize in Medicine.",
    linkedin: null,
  },
  {
    id: "macmillan",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/macmillan.jpg",
    name: "David MacMillan, PhD",
    role: "Professor at Princeton & 2021 Nobel Prize in Chemistry",
    bio: "Dave is the James S. McDonnell Distinguished University Professor of Chemistry at Princeton University. He joined Princeton in 2006 as the A. Barton Hepburn Professor and served as Department Chair from 2010 to 2015. In 2021, he was awarded the Nobel Prize in Chemistry, shared with Benjamin List, for the development of asymmetric organocatalysis.",
    linkedin: "https://www.linkedin.com/in/david-macmillan-47662914",
  },
  {
    id: "young",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/09613-feature5-youngcxd_Widescreen.jpeg",
    name: "Wendy Young, PhD",
    role: "Former SVP of Small Molecule Discovery at Genentech",
    bio: "Wendy is a seasoned biotech and pharma executive with over 30 years of experience in drug discovery and development. She serves as a board member and scientific advisor at several private and public biotechs and is a senior advisor at Google Ventures. As former SVP at Genentech (2006-2021), she led the advancement of 25+ clinical candidates into development. She led the research team and co-invented fenebrutinib (Phase 3), and has authored or been named an inventor on 70+ publications and patents.",
    linkedin: "https://www.linkedin.com/in/wendy-young-ph-d-65a1572",
  },
  {
    id: "alon",
    img: "https://integratedbio.com/wp-content/uploads/2025/09/weizmann.elsevierpure.jpg",
    name: "Uri Alon, PhD",
    role: "Professor at the Weizmann Institute of Science",
    bio: "Uri is a Professor at the Weizmann Institute of Science, widely recognized as a pioneer in systems biology, particularly in the biology of aging. His research combines computational modeling with experimental biology to uncover the design principles of gene regulation, network motifs, and the architecture of complex biological systems. He has received honors including the IBM Faculty Award, Overton Prize, and Teva Founders Prize. Uri holds degrees from Hebrew University and from Weizmann.",
    linkedin: "https://il.linkedin.com/in/urialonw",
  },
  {
    id: "tony",
    img: "https://integratedbio.com/wp-content/uploads/2025/10/tonywu-e1759440058542.jpg",
    name: "Yuhuai (Tony) Wu, PhD",
    role: "Co-founder of xAI",
    bio: "Tony co-founded xAI together with a team including Elon Musk, Igor Babuschkin, Jimmy Ba, Greg Yang, and Christian Szegedy. At xAI, Tony led the organization in pre- and post-training Grok and applying Grok for expert reasoning tasks. His research spans all aspects of AI, including reasoning, STaR, Minera, AlphaGeometry, AlphaStar, and memorizing transformers, and has been pivotal to the development of large language models and reasoning models.",
    linkedin: "https://www.linkedin.com/in/yuhuai-tony-wu-02a641b5/",
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

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProfile(null);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <div className="meet-team-root">
      <div className="section">
        <div className="section-label">Meet the Team</div>

        <div className="leadership-layout">
          <div className="leadership-intro">
            <div className="subsection-title">Leadership</div>
            <p className="subsection-desc">
              Our leadership team embodies our mission, combining expertise in
              synthetic biology, chemistry and AI to transform human health and
              aging.
            </p>
          </div>

          <div className="leadership-grid">
            {leadershipIds.map((id) => {
              const profile = getProfile(id);
              if (!profile) return null;
              return (
                <div
                  key={profile.id}
                  className="leader-card leader-card-v2"
                  onClick={() => setActiveProfile(profile)}
                >
                  <div className="leader-photo-wrap">
                    <img
                      src={profile.img}
                      alt={profile.name}
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
                        className="leader-linkedin-badge"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`${profile.name} LinkedIn`}
                      >
                        in
                      </a>
                    ) : null}
                  </div>

                  <div className="leader-card-body">
                    <div className="leader-name">{profile.name}</div>
                    <div className="leader-title">{profile.role}</div>
                  </div>

                  <div className="leader-card-footer">
                    <span className="view-profile">View profile</span>
                    <span className="leader-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="divider" />

        <div className="subsection-title" style={{ marginBottom: "6px" }}>
          Team
        </div>
        <p className="subsection-desc">
          Our team thrives on bold ideas, challenges conventional thinking, and
          shapes how transformative medicines are discovered.
        </p>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-member">
              <div className="team-info">
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
                <a
                  className="team-linkedin"
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>

        <hr className="divider" />

        <div className="subsection-title" style={{ marginBottom: "32px" }}>
          Scientific Advisory Board
        </div>

        <div className="sab-grid">
          {sabIds.map((id) => {
            const profile = getProfile(id);
            if (!profile) return null;
            return (
              <div
                key={profile.id}
                className="sab-card"
                onClick={() => setActiveProfile(profile)}
              >
                <div className="sab-photo-wrap">
                  <img
                    src={profile.img}
                    alt={profile.name}
                    onError={(event) => {
                      const target = event.currentTarget;
                      target.onerror = null;
                      target.src =
                        "https://placehold.co/200x200/e8e4dc/888?text=Photo";
                    }}
                  />
                </div>
                <div className="sab-name">{profile.name}</div>
                <div className="sab-title">{profile.role}</div>
                <span className="view-profile">View profile</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`modal-overlay ${activeProfile ? "open" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setActiveProfile(null);
          }
        }}
      >
        <button
          className="modal-close"
          onClick={() => setActiveProfile(null)}
          aria-label="Close profile modal"
        >
          &#x2715;
        </button>
        <div className="modal">
          <div className="modal-img">
            <img
              src={activeProfile?.img ?? ""}
              alt={activeProfile?.name ?? ""}
              onError={(event) => {
                const target = event.currentTarget;
                target.onerror = null;
                target.src = "https://placehold.co/240x320/e8e4dc/888?text=Photo";
              }}
            />
          </div>
          <div className="modal-body">
            <div className="modal-name">{activeProfile?.name ?? ""}</div>
            <div className="modal-role">{activeProfile?.role ?? ""}</div>
            <p className="modal-bio">{activeProfile?.bio ?? ""}</p>
            {activeProfile?.linkedin ? (
              <a
                className="modal-linkedin"
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
