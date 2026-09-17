export default function StatsSection() {
  const stats = [
    { num: '50+', label: 'Active Members' },
    { num: '12+', label: 'Workshops a Year' },
    { num: '3', label: 'Flagship Events' },
    { num: '100%', label: 'Student Run' },
  ];

  return (
    <section className="section-pad ambient-panel soft stats-section">
      <div className="wrap">
        <div className="stats-row">
          {stats.map((stat, i) => (
            <div key={i} className="stat-block">
              <div className="stat-num">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
