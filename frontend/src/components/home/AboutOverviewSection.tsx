import TextBlockAnimation from "@/components/ui/text-block-animation";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutOverviewSection() {
  const cards = [
    {
      title: 'Who We Are',
      text: "aiDEAS is a passionate student-led association at PVG's College of Engineering, Technology and Management (PVGCOET), Pune, bringing together enthusiasts of Artificial Intelligence and Data Science. We aim to bridge the gap between theoretical learning and practical implementation.",
      color: "purple",
    },
    {
      title: "What We Do",
      text: "We organize technical workshops, guest lectures, hackathons, and project showcases to nurture real-world skills and collaborative innovation in AI and DS.",
      color: "cyan",
    },
    {
      title: "Vision & Mission",
      text: "Our mission is to create an ecosystem where students not only learn but build. We envision a future where every student is AI-aware, AI-capable, and AI-empowered.",
      color: "purple",
    },
    {
      title: "Our Values",
      text: "We believe in innovation, inclusivity, curiosity, and teamwork. At aiDEAS, every idea matters — and every mind can help shape the future.",
      color: "cyan",
    },
  ];

  const valueChips = [
    "Curiosity-driven",
    "Peer-taught",
    "Project-first",
    "Open to all years",
    "Cross-branch",
  ];

  return (
    <section className="section-pad ambient-panel soft">
      <div className="wrap">
        <SectionHeading
          eyebrow="A closer look"
          wordmarkText="What is aiDEAS?"
        />

        <div className="about-cards">
          {cards.map((card, i) => (
            <div key={i} className={`info-card ${card.color}`}>
              <TextBlockAnimation
                deferUntilSectionInView
                blockColor="#35C7F3"
                animateOnScroll={true}
                duration={0.65}
                stagger={0.05}
              >
                <h3>{card.title}</h3>
              </TextBlockAnimation>
              <TextBlockAnimation
                deferUntilSectionInView
                blockColor="#242832"
                animateOnScroll={true}
                duration={0.55}
                stagger={0.03}
              >
                <p>{card.text}</p>
              </TextBlockAnimation>
            </div>
          ))}
        </div>

        <div className="value-strip">
          {valueChips.map((chip, i) => (
            <span key={i} className="value-chip">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
