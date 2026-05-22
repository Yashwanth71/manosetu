// ManoSetu — SetupathJourney Component
// XP/narrative gamification journey screen with chapter progression

const SetupathJourney = ({ onNavigate }) => {
  const [activeChapter, setActiveChapter] = React.useState(1);

  const chapters = [
    {
      id: 1, unlocked: true, completed: true,
      xp: 200, title: 'Awareness', subtitle: 'Noticing the present',
      theme: 'Mindfulness · ACT Foundation',
      color: '#3B82F6', sessions: 5, completedSessions: 5,
    },
    {
      id: 2, unlocked: true, completed: false,
      xp: 340, xpEarned: 150, title: 'Acceptance', subtitle: 'Making room for what is',
      theme: 'Defusion · ACT Chapter II',
      color: '#7C3AED', sessions: 7, completedSessions: 3,
    },
    {
      id: 3, unlocked: false, completed: false,
      xp: 500, xpEarned: 0, title: 'Values', subtitle: 'What matters most to you',
      theme: 'Values Clarification · ACT',
      color: '#6D28D9', sessions: 8, completedSessions: 0,
    },
    {
      id: 4, unlocked: false, completed: false,
      xp: 650, xpEarned: 0, title: 'Action', subtitle: 'Committed steps forward',
      theme: 'Committed Action · ACT',
      color: '#4F46E5', sessions: 10, completedSessions: 0,
    },
  ];

  const totalXP = 150 + 200; // earned so far
  const nextLevelXP = 540;

  return (
    <div style={journeyStyles.container}>
      {/* Header */}
      <div style={journeyStyles.header}>
        <div>
          <div style={journeyStyles.headerTitle}>Setupath</div>
          <div style={journeyStyles.headerSub}>Your journey · सेतुपथ</div>
        </div>
        <div style={journeyStyles.xpBadge}>
          <div style={journeyStyles.xpNum}>{totalXP}</div>
          <div style={journeyStyles.xpLabel}>XP</div>
        </div>
      </div>

      {/* XP Progress */}
      <div style={journeyStyles.xpCard}>
        <div style={journeyStyles.xpCardRow}>
          <div style={journeyStyles.xpCardLeft}>
            <div style={journeyStyles.xpCardTitle}>Level 2 · Explorer</div>
            <div style={journeyStyles.xpCardSub}>
              {nextLevelXP - totalXP} XP to Level 3 · Seeker
            </div>
          </div>
          <div style={journeyStyles.streakPill}>
            <span style={journeyStyles.streakFire}>🔥</span>
            <span style={journeyStyles.streakNum}>7</span>
          </div>
        </div>
        <div style={journeyStyles.xpTrack}>
          <div style={{...journeyStyles.xpFill, width: `${(totalXP / nextLevelXP) * 100}%`}}></div>
        </div>
        <div style={journeyStyles.xpMeta}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#7C3AED'}}>{totalXP} XP</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#4B5A72'}}>{nextLevelXP} XP</span>
        </div>
      </div>

      {/* Chapters */}
      <div style={journeyStyles.sectionLabel}>Journey Chapters</div>
      <div style={journeyStyles.chapterList}>
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            style={{
              ...journeyStyles.chapterCard,
              ...(ch.id === activeChapter ? journeyStyles.chapterCardActive : {}),
              opacity: ch.unlocked ? 1 : 0.45,
            }}
            onClick={() => ch.unlocked && setActiveChapter(ch.id)}
          >
            {/* Connector line */}
            {idx < chapters.length - 1 && (
              <div style={{
                ...journeyStyles.connector,
                background: ch.completed ? 'linear-gradient(180deg,#3B82F6,#7C3AED)' : 'rgba(255,255,255,0.06)',
              }}></div>
            )}

            {/* Chapter node */}
            <div style={{
              ...journeyStyles.chapterNode,
              background: ch.completed
                ? `linear-gradient(135deg, ${ch.color}, ${ch.color}99)`
                : ch.unlocked
                ? `rgba(${ch.color.replace('#','').match(/../g).map(h=>parseInt(h,16)).join(',')},0.15)`
                : '#111827',
              border: `2px solid ${ch.unlocked ? ch.color : 'rgba(255,255,255,0.06)'}`,
            }}>
              {ch.completed
                ? <span style={{fontSize:14,color:'white'}}>✓</span>
                : ch.unlocked
                ? <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:ch.color,fontWeight:500}}>{ch.id}</span>
                : <span style={{fontSize:13,color:'#4B5A72'}}>🔒</span>
              }
            </div>

            {/* Chapter info */}
            <div style={journeyStyles.chapterInfo}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                <div style={{...journeyStyles.chapterTitle,color: ch.unlocked ? '#F0F4FF' : '#4B5A72'}}>
                  {ch.title}
                </div>
                {ch.completed && (
                  <span style={{...journeyStyles.completedBadge}}>Complete</span>
                )}
                {ch.unlocked && !ch.completed && (
                  <span style={{...journeyStyles.activeBadge}}>Active</span>
                )}
              </div>
              <div style={journeyStyles.chapterSub}>{ch.subtitle}</div>
              <div style={journeyStyles.chapterTheme}>{ch.theme}</div>

              {ch.unlocked && !ch.completed && (
                <div style={{marginTop:8}}>
                  <div style={journeyStyles.sessTrack}>
                    <div style={{...journeyStyles.sessFill, width: `${(ch.completedSessions/ch.sessions)*100}%`, background: ch.color}}></div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:3}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#4B5A72'}}>{ch.completedSessions}/{ch.sessions} sessions</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:ch.color}}>{ch.xpEarned}/{ch.xp} XP</span>
                  </div>
                </div>
              )}
              {ch.completed && (
                <div style={{marginTop:4}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#34D399'}}>+{ch.xp} XP earned</span>
                </div>
              )}
              {!ch.unlocked && (
                <div style={{marginTop:4,fontSize:10,color:'#4B5A72'}}>Complete previous chapter to unlock</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{padding:'16px 20px 0'}}>
        <button style={journeyStyles.continueBtn} onClick={() => onNavigate('breathe')}>
          Continue Chapter 2 →
        </button>
      </div>
    </div>
  );
};

const journeyStyles = {
  container: { display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', paddingBottom:88 },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'16px 20px 12px' },
  headerTitle: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#F0F4FF' },
  headerSub: { fontSize:11, color:'#8B9CB8', marginTop:2, fontFamily:"'Noto Sans Devanagari',sans-serif" },
  xpBadge: { background:'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.2))', borderRadius:12, padding:'6px 12px', textAlign:'center', border:'1px solid rgba(124,58,237,0.25)' },
  xpNum: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:'linear-gradient(135deg,#3B82F6,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  xpLabel: { fontFamily:"'DM Mono',monospace", fontSize:9, color:'#4B5A72', letterSpacing:'0.1em' },
  xpCard: { margin:'0 20px 16px', background:'#111827', borderRadius:14, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)' },
  xpCardRow: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  xpCardLeft: {},
  xpCardTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#F0F4FF' },
  xpCardSub: { fontSize:11, color:'#8B9CB8', marginTop:2 },
  streakPill: { display:'flex', alignItems:'center', gap:4, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:999, padding:'4px 10px' },
  streakFire: { fontSize:13 },
  streakNum: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#FCD34D' },
  xpTrack: { height:5, borderRadius:3, background:'rgba(255,255,255,0.07)', overflow:'hidden' },
  xpFill: { height:'100%', borderRadius:3, background:'linear-gradient(90deg,#3B82F6,#7C3AED)', transition:'width 1s ease' },
  xpMeta: { display:'flex', justifyContent:'space-between', marginTop:5 },
  sectionLabel: { fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'#4B5A72', padding:'0 20px 10px' },
  chapterList: { display:'flex', flexDirection:'column', padding:'0 20px', gap:0 },
  chapterCard: { display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0', position:'relative', cursor:'pointer' },
  chapterCardActive: {},
  connector: { position:'absolute', left:19, top:48, width:2, height:'calc(100% - 12px)', zIndex:0, borderRadius:1 },
  chapterNode: { width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, zIndex:1 },
  chapterInfo: { flex:1, paddingTop:2 },
  chapterTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 },
  chapterSub: { fontSize:12, color:'#8B9CB8', marginTop:1 },
  chapterTheme: { fontFamily:"'DM Mono',monospace", fontSize:9, color:'#4B5A72', marginTop:3, letterSpacing:'0.05em' },
  completedBadge: { padding:'1px 7px', borderRadius:999, fontSize:9, fontWeight:500, background:'rgba(52,211,153,0.12)', color:'#34D399', border:'1px solid rgba(52,211,153,0.2)' },
  activeBadge: { padding:'1px 7px', borderRadius:999, fontSize:9, fontWeight:500, background:'rgba(124,58,237,0.15)', color:'#C4B5FD', border:'1px solid rgba(124,58,237,0.3)' },
  sessTrack: { height:3, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden' },
  sessFill: { height:'100%', borderRadius:2 },
  continueBtn: { width:'100%', padding:14, background:'linear-gradient(135deg,#3B82F6,#7C3AED)', border:'none', borderRadius:14, color:'white', fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer' },
};

Object.assign(window, { SetupathJourney });
