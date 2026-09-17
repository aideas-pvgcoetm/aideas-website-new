export default function AlumniPage() {
  return (
    <main className="page-main relative overflow-hidden">
      <section className="section-pad" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Alumni</div>
            <h2 className="grad-text">Our Alumni Network</h2>
            <p>
              Connecting past and present members of the aiDEAS community.
              Our alumni continue to make an impact in AI, Data Science, and beyond.
            </p>
          </div>

          <div className="about-cards">
            <div className="info-card cyan">
              <h3>Stay Connected</h3>
              <p>
                Whether you graduated last year or a decade ago, you are always
                a part of the aiDEAS family. This page will soon feature alumni
                stories, achievements, and networking opportunities.
              </p>
            </div>
            <div className="info-card purple">
              <h3>Coming Soon</h3>
              <p>
                We are working on building a comprehensive alumni directory and
                mentorship program. Check back soon for updates, or reach out to
                us through the Contact page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
