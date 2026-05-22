// ManoSetu — MoodLog Component
// 3-layer mood logging: quick check-in → bloom depth → context factors

const MoodLog = ({ onNavigate }) => {
  const [layer, setLayer] = React.useState(1);
  const [selectedMood, setSelectedMood] = React.useState(null);
  const [sliderVal, setSliderVal] = React.useState(40);
  const [activeTags, setActiveTags] = React.useState([]);
  const [factors, setFactors] = React.useState({ work: 'Medium', sleep: '6 hrs', social: 'Okay', physical: 'Low' });
  const [done, setDone] = React.useState(false);

  const moods = [
    { emoji: '😔', label: 'Low', val: 1 },
    { emoji: '😟', label: 'Uneasy', val: 2 },
    { emoji: '😐', label: 'Okay', val: 3 },
    { emoji: '🙂', label: 'Good', val: 4 },
    { emoji: '😊', label: 'Great', val: 5 },
  ];

  const tags = ['Anxious', 'तनाव', 'Distracted', 'Lonely', 'थकान', 'Overwhelmed', 'Hopeful', 'शांत'];
  const toggleTag = (t) => setActiveTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  if (done) {
    return (
      <div style={moodStyles.doneContainer}>
        <div style={moodStyles.doneMark}>✓</div>
        <div style={moodStyles.doneTitle}>Logged</div>
        <div style={moodStyles.doneSub}>Manas is processing your check-in and will follow up shortly.</div>
        <button style={moodStyles.doneBtn} onClick={() => onNavigate('chat')}>Continue with Manas</button>
        <button style={moodStyles.doneBtnGhost} onClick={() => onNavigate('home')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={moodStyles.container}>
      {/* Header */}
      <div style={moodStyles.header}>
        <button style={moodStyles.backBtn} onClick={() => layer > 1 ? setLayer(l => l - 1) : onNavigate('home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B9CB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={moodStyles.title}>How are you?</div>
        <div style={moodStyles.layerPips}>
          {[1,2,3].map(i => <div key={i} style={{...moodStyles.pip, ...(i <= layer ? moodStyles.pipActive : {})}}></div>)}
        </div>
      </div>

      {/* Layer 1: Quick check-in */}
      {layer === 1 && (
        <div style={moodStyles.layerContent}>
          <div style={moodStyles.layerTitle}>Right now, I feel…</div>
          <div style={moodStyles.moodRow}>
            {moods.map(m => (
              <button key={m.val} style={{...moodStyles.moodBtn, ...(selectedMood === m.val ? moodStyles.moodBtnActive : {})}} onClick={() => setSelectedMood(m.val)}>
                <span style={moodStyles.moodEmoji}>{m.emoji}</span>
                <span style={moodStyles.moodLabel}>{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <button style={moodStyles.nextBtn} onClick={() => setLayer(2)}>Continue →</button>
          )}
        </div>
      )}

      {/* Layer 2: Bloom depth */}
      {layer === 2 && (
        <div style={moodStyles.layerContent}>
          <div style={moodStyles.layerTitle}>What's shaping this feeling?</div>
          <div style={moodStyles.sliderWrap}>
            <div style={moodStyles.sliderLabels}>
              <span style={moodStyles.sliderLabel}>Mild</span>
              <span style={moodStyles.sliderLabel}>Intense</span>
            </div>
            <input type="range" min={0} max={100} value={sliderVal} onChange={e => setSliderVal(+e.target.value)} style={moodStyles.slider} />
          </div>
          <div style={moodStyles.tagsWrap}>
            {tags.map(t => (
              <button key={t} style={{...moodStyles.tag, ...(activeTags.includes(t) ? moodStyles.tagActive : {})}} onClick={() => toggleTag(t)}>
                {t}
              </button>
            ))}
          </div>
          <button style={moodStyles.nextBtn} onClick={() => setLayer(3)}>Continue →</button>
        </div>
      )}

      {/* Layer 3: Context factors */}
      {layer === 3 && (
        <div style={moodStyles.layerContent}>
          <div style={moodStyles.layerTitle}>What's been affecting you?</div>
          <div style={moodStyles.factorGrid}>
            {[
              { label: 'Work stress', key: 'work', opts: ['Low','Medium','High'], color: '#F87171' },
              { label: 'Sleep quality', key: 'sleep', opts: ['4 hrs','6 hrs','8 hrs'], color: '#FBBF24' },
              { label: 'Social connection', key: 'social', opts: ['Low','Okay','Good'], color: '#34D399' },
              { label: 'Physical activity', key: 'physical', opts: ['Low','Some','Active'], color: '#60A5FA' },
            ].map(f => (
              <div key={f.key} style={moodStyles.factorCard}>
                <div style={{...moodStyles.factorDot, background: f.color}}></div>
                <div style={moodStyles.factorLabel}>{f.label}</div>
                <div style={moodStyles.factorOpts}>
                  {f.opts.map(o => (
                    <button key={o} style={{...moodStyles.factorOpt, ...(factors[f.key] === o ? moodStyles.factorOptActive : {})}} onClick={() => setFactors(fv => ({...fv, [f.key]: o}))}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button style={moodStyles.nextBtn} onClick={() => setDone(true)}>Save Check-In</button>
        </div>
      )}

      <style>{`
        input[type=range] { -webkit-appearance:none; appearance:none; background:linear-gradient(90deg,#3B82F6,#7C3AED); height:5px; border-radius:3px; width:100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#F0F4FF; border:2px solid #7C3AED; cursor:pointer; }
      `}</style>
    </div>
  );
};

const moodStyles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', background: '#0C1120' },
  header: { display: 'flex', alignItems: 'center', padding: '12px 16px 10px', gap: 8 },
  backBtn: { background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#F0F4FF', flex: 1, textAlign: 'center' },
  layerPips: { display: 'flex', gap: 4, width: 32, justifyContent: 'flex-end' },
  pip: { width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)' },
  pipActive: { background: '#7C3AED', width: 14 },
  layerContent: { flex: 1, padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 },
  layerTitle: { fontSize: 15, fontWeight: 400, color: '#8B9CB8', lineHeight: 1.5 },
  moodRow: { display: 'flex', gap: 6 },
  moodBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '12px 4px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.07)', background: '#111827', cursor: 'pointer' },
  moodBtnActive: { border: '1.5px solid #7C3AED', background: 'rgba(124,58,237,0.12)' },
  moodEmoji: { fontSize: 24, lineHeight: 1 },
  moodLabel: { fontSize: 9, color: '#8B9CB8', fontWeight: 500 },
  sliderWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  sliderLabels: { display: 'flex', justifyContent: 'space-between' },
  sliderLabel: { fontSize: 11, color: '#4B5A72' },
  slider: { width: '100%' },
  tagsWrap: { display: 'flex', flexWrap: 'wrap', gap: 7 },
  tag: { padding: '6px 12px', borderRadius: 999, border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.07)', color: '#8B9CB8', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  tagActive: { background: 'rgba(124,58,237,0.2)', border: '1px solid #7C3AED', color: '#C4B5FD' },
  nextBtn: { background: 'linear-gradient(135deg,#3B82F6,#7C3AED)', border: 'none', borderRadius: 14, padding: '13px', color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 'auto' },
  factorGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  factorCard: { background: '#111827', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' },
  factorDot: { width: 6, height: 6, borderRadius: '50%', display: 'inline-block', marginBottom: 5 },
  factorLabel: { fontSize: 12, color: '#8B9CB8', marginBottom: 7 },
  factorOpts: { display: 'flex', gap: 6 },
  factorOpt: { flex: 1, padding: '6px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: '#1C2333', color: '#8B9CB8', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  factorOptActive: { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#C4B5FD' },
  // Done screen
  doneContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0C1120', padding: 24, gap: 12 },
  doneMark: { width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid #34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#34D399' },
  doneTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#F0F4FF' },
  doneSub: { fontSize: 13, color: '#8B9CB8', textAlign: 'center', lineHeight: 1.6, marginBottom: 8 },
  doneBtn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg,#3B82F6,#7C3AED)', border: 'none', borderRadius: 14, color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  doneBtnGhost: { width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#8B9CB8', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};

Object.assign(window, { MoodLog });
