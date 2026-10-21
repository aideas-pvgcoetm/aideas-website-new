import CrowdCanvas from '@/components/ui/CrowdCanvas';

export default function StatsSection() {
  const stats = [
    { num: '240+', label: 'Active Members' },
    { num: '12+', label: 'Workshops a Year' },
    { num: '3', label: 'Flagship Events' },
    { num: '100%', label: 'Student Run' },
  ];

  return (
    <section className="section-pad ambient-panel soft stats-section relative overflow-hidden">
      {/* Animated crowd walking behind the statistic cards, strictly constrained to this section */}
      <CrowdCanvas opacity={0.38} />

      {/* Smooth, feathered gradient mask fading lower crowd into pure black (#000000) at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.05) 15%, rgba(0, 0, 0, 0.18) 30%, rgba(0, 0, 0, 0.42) 50%, rgba(0, 0, 0, 0.72) 72%, rgba(0, 0, 0, 0.94) 90%, #000000 100%)',
        }}
        aria-hidden="true"
      />

      <div className="wrap relative z-10">
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
