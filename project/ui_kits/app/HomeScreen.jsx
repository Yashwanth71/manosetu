// ManoSetu — HomeScreen (Revised)
// Dashboard with inline Breathe, Mood Log, and Journey sections

const HomeScreen = ({ onNavigate }) => {
  const [quickMood, setQuickMood] = React.useState(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const moods = [
    { v: 1, emoji: '😞' }, { v: 2, emoji: '😟' }, { v: 3, emoji: '😐' },
    { v: 4, emoji: '🙂' }, { v: 5, emoji: '😊' },
  ];

  return (
    <div style={hs.root}>

      {/* ── Header ── */}
      <div style={hs.header}>
        <div style={hs.headerLeft}>
          <div style={hs.avatar}></div>
          <div>
            <div style={hs.greeting}>{greeting}, Priya</div>
            <div style={hs.date}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}</div>
          </div>
        </div>
        <button style={hs.bellBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B9CB8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
      </div>

      {/* ── Streak ── */}
      <div style={hs.streakCard}>
        <div style={hs.streakLeft}>
          <div style={hs.streakNum}>7</div>
          <div>
            <div style={hs.streakTitle}>Day Streak</div>
            <div style={hs.streakSub}>Keep going — you're building something real.</div>
          </div>
        </div>
        <div style={hs.xpRight}>
          <div style={hs.xpVal}>+50 XP</div>
          <div style={hs.xpSub}>today</div>
        </div>
      </div>

      {/* ── Mood check-in ── */}
      <div style={hs.sectionLabel}>How are you feeling?</div>
      <div style={hs.moodCard}>
        <div style={hs.moodRow}>
          {moods.map(m => (
            <button key={m.v}
              style={{...hs.moodBtn, ...(quickMood === m.v ? hs.moodBtnActive : {})}}
              onClick={() => { setQuickMood(m.v); setTimeout(() => onNavigate('mood'), 350); }}>
              <span style={hs.moodEmoji}>{m.emoji}</span>
            </button>
          ))}
        </div>
        {quickMood && <div style={hs.moodContinue}>Continue check-in →</div>}
      </div>

      {/* ── Breathe section ── */}
      <div style={hs.sectionRow}>
        <div style={hs.sectionLabel}>Breathe</div>
        <button style={hs.seeAll} onClick={() => onNavigate('breathe')}>See all</button>
      </div>
      <div style={hs.breatheRow}>
        {[
          { name: 'Box Breathing', sub: '3 min · Calm focus', color: '#3B82F6', glow: 'rgba(59,130,246,0.18)' },
          { name: 'Nadi Shodhana', sub: '7 min · Balance', color: '#7C3AED', glow: 'rgba(124,58,237,0.15)' },
          { name: 'Bhastrika',     sub: '5 min · Energise',  color: '#A855F7', glow: 'rgba(168,85,247,0.15)' },
        ].map((t, i) => (
          <button key={i} style={{...hs.breatheCard, background: t.glow, borderColor: t.color + '44'}}
            onClick={() => onNavigate('breathe')}>
            <div style={{...hs.breatheIcon, borderColor: t.color + '66'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="1.8" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.94"/><path d="M14 13C8 14 6 20.42 4 22"/><path d="M20 8c-.4 4-1.5 6.5-4 9"/></svg>
            </div>
            <div style={hs.breatheName}>{t.name}</div>
            <div style={hs.breatheSub}>{t.sub}</div>
          </button>
        ))}
      </div>

      {/* ── Journey section ── */}
      <div style={hs.sectionRow}>
        <div style={hs.sectionLabel}>Your Journey</div>
        <button style={hs.seeAll} onClick={() => onNavigate('journey')}>View all</button>
      </div>
      <div style={hs.journeyCard} onClick={() => onNavigate('journey')}>
        <div style={hs.journeyLeft}>
          <div style={hs.chapterBadge}>Chapter 2</div>
          <div style={hs.journeyTitle}>Acceptance</div>
          <div style={hs.journeySub}>Making room for what is · ACT</div>
          <div style={hs.journeyProgress}>
            <div style={hs.journeyBar}></div>
          </div>
          <div style={hs.journeyMeta}>3 of 7 sessions · 150/340 XP</div>
        </div>
        <div style={hs.journeyRight}>
          <div style={hs.journeyChevron}>›</div>
        </div>
      </div>

      {/* ── Manas nudge ── */}
      <div style={hs.manasNudge} onClick={() => onNavigate('manas')}>
        <div style={hs.manasAvatar}></div>
        <div style={hs.manasText}>Manas is ready — what's on your mind today?</div>
        <div style={hs.manasArrow}>→</div>
      </div>

    </div>
  );
};

const hs = {
  root: { display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', paddingBottom:12, background:'#0C1120' },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px 10px' },
  headerLeft: { display:'flex', alignItems:'center', gap:10 },
  avatar: { width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#7C3AED)' },
  greeting: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:'#F0F4FF', lineHeight:1.2 },
  date: { fontSize:11, color:'#8B9CB8', marginTop:2 },
  bellBtn: { background:'none', border:'none', padding:4, cursor:'pointer', display:'flex' },

  streakCard: { margin:'2px 20px 14px', background:'linear-gradient(135deg,rgba(59,130,246,0.09),rgba(124,58,237,0.14))', borderRadius:16, padding:'12px 14px', border:'1px solid rgba(124,58,237,0.22)', display:'flex', alignItems:'center', justifyContent:'space-between' },
  streakLeft: { display:'flex', alignItems:'center', gap:12 },
  streakNum: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:34, lineHeight:1, background:'linear-gradient(135deg,#3B82F6,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  streakTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#F0F4FF' },
  streakSub: { fontSize:10, color:'#8B9CB8', marginTop:2, maxWidth:160, lineHeight:1.4 },
  xpRight: { textAlign:'right' },
  xpVal: { fontFamily:"'DM Mono',monospace", fontSize:12, color:'#34D399', fontWeight:500 },
  xpSub: { fontSize:9, color:'#4B5A72', marginTop:2 },

  sectionLabel: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5A72', padding:'0 20px 8px' },
  sectionRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 8px' },
  seeAll: { background:'none', border:'none', fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#7C3AED', cursor:'pointer', padding:0 },

  moodCard: { margin:'0 20px 14px', background:'#111827', borderRadius:16, padding:'14px', border:'1px solid rgba(255,255,255,0.06)' },
  moodRow: { display:'flex', justifyContent:'space-between', gap:6 },
  moodBtn: { flex:1, height:54, borderRadius:14, border:'1.5px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color 150ms,background 150ms' },
  moodBtnActive: { border:'1.5px solid #7C3AED', background:'rgba(124,58,237,0.12)' },
  moodEmoji: { fontSize:22 },
  moodContinue: { fontSize:11, color:'#7C3AED', textAlign:'right', marginTop:8, fontWeight:500 },

  breatheRow: { display:'flex', gap:8, padding:'0 20px 14px', overflowX:'auto' },
  breatheCard: { flexShrink:0, width:120, borderRadius:16, padding:'12px 10px', border:'1px solid', cursor:'pointer', display:'flex', flexDirection:'column', gap:6 },
  breatheIcon: { width:34, height:34, borderRadius:10, border:'1px solid', display:'flex', alignItems:'center', justifyContent:'center' },
  breatheName: { fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:'#F0F4FF', lineHeight:1.2 },
  breatheSub: { fontSize:10, color:'#8B9CB8' },

  journeyCard: { margin:'0 20px 14px', background:'#111827', borderRadius:16, padding:'14px', border:'1px solid rgba(124,58,237,0.18)', cursor:'pointer', display:'flex', alignItems:'center', gap:12 },
  journeyLeft: { flex:1 },
  chapterBadge: { display:'inline-block', padding:'2px 8px', borderRadius:999, fontSize:9, fontWeight:500, background:'rgba(124,58,237,0.15)', color:'#C4B5FD', border:'1px solid rgba(124,58,237,0.25)', marginBottom:6 },
  journeyTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'#F0F4FF' },
  journeySub: { fontFamily:"'DM Mono',monospace", fontSize:9, color:'#4B5A72', marginTop:2, letterSpacing:'0.04em' },
  journeyProgress: { height:3, borderRadius:2, background:'rgba(255,255,255,0.07)', marginTop:10, overflow:'hidden' },
  journeyBar: { height:'100%', width:'43%', background:'linear-gradient(90deg,#3B82F6,#7C3AED)', borderRadius:2 },
  journeyMeta: { fontFamily:"'DM Mono',monospace", fontSize:9, color:'#4B5A72', marginTop:4 },
  journeyRight: {},
  journeyChevron: { fontSize:20, color:'#4B5A72' },

  manasNudge: { margin:'0 20px 4px', background:'rgba(124,58,237,0.08)', borderRadius:14, padding:'12px 14px', border:'1px solid rgba(124,58,237,0.2)', display:'flex', alignItems:'center', gap:10, cursor:'pointer' },
  manasAvatar: { width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#7C3AED)', flexShrink:0 },
  manasText: { flex:1, fontSize:12, fontWeight:300, color:'#C4B5FD', lineHeight:1.5 },
  manasArrow: { fontSize:16, color:'#7C3AED' },
};

Object.assign(window, { HomeScreen });
