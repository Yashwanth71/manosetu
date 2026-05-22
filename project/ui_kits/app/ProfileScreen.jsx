// ManoSetu — ProfileScreen
// User profile, stats, settings

const ProfileScreen = ({ onNavigate }) => {
  const stats = [
    { label:'Day Streak', val:'7', unit:'days', color:'#7C3AED' },
    { label:'Sessions',   val:'23', unit:'total', color:'#3B82F6' },
    { label:'XP',         val:'350', unit:'points', color:'#34D399' },
    { label:'Chapter',    val:'2', unit:'of 4', color:'#F59E0B' },
  ];

  const settings = [
    { icon:'🔔', label:'Reminders', val:'9:00 AM daily' },
    { icon:'🌙', label:'Dark mode',  val:'Always on' },
    { icon:'🔒', label:'Data & Privacy', val:'' },
    { icon:'📋', label:'Assessments', val:'PHQ-9 · GAD-7' },
    { icon:'❓', label:'Help & Support', val:'' },
  ];

  return (
    <div style={pf.container}>
      {/* Profile hero */}
      <div style={pf.hero}>
        <div style={pf.heroAvatar}>P</div>
        <div style={pf.heroName}>Priya</div>
        <div style={pf.heroSub}>Member since Jan 2025</div>
        <div style={pf.levelBadge}>Level 2 · Explorer</div>
      </div>

      {/* Stats grid */}
      <div style={pf.statsGrid}>
        {stats.map((s,i) => (
          <div key={i} style={{...pf.statCard, borderColor: s.color + '33' }}>
            <div style={{...pf.statVal, color: s.color}}>{s.val}</div>
            <div style={pf.statUnit}>{s.unit}</div>
            <div style={pf.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Journey progress */}
      <div style={pf.sectionLabel}>Wellness Journey</div>
      <div style={pf.journeyCard}>
        <div style={pf.journeyRow}>
          <div style={pf.journeyInfo}>
            <div style={pf.journeyTitle}>Chapter 2 · Acceptance</div>
            <div style={pf.journeySub}>43% complete · 190 XP to next chapter</div>
          </div>
        </div>
        <div style={pf.jTrack}><div style={pf.jFill}></div></div>
      </div>

      {/* Settings */}
      <div style={pf.sectionLabel}>Settings</div>
      <div style={pf.settingsList}>
        {settings.map((s,i) => (
          <div key={i} style={{...pf.settingRow, ...(i===settings.length-1?{borderBottom:'none'}:{})}}>
            <span style={pf.settingIcon}>{s.icon}</span>
            <div style={pf.settingLabel}>{s.label}</div>
            <div style={pf.settingRight}>
              {s.val && <span style={pf.settingVal}>{s.val}</span>}
              <span style={pf.settingChevron}>›</span>
            </div>
          </div>
        ))}
      </div>

      <button style={pf.signOutBtn}>Sign Out</button>
    </div>
  );
};

const pf = {
  container: { display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', background:'#0C1120', paddingBottom:16 },
  hero: { display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 20px 20px', gap:6 },
  heroAvatar: { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:'white', marginBottom:4 },
  heroName: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'#F0F4FF' },
  heroSub: { fontSize:12, color:'#4B5A72' },
  levelBadge: { marginTop:4, padding:'4px 14px', borderRadius:999, background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', fontSize:12, fontWeight:500, color:'#C4B5FD' },
  statsGrid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, padding:'0 20px 16px' },
  statCard: { background:'#111827', borderRadius:14, padding:'12px 8px', border:'1px solid', display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  statVal: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, lineHeight:1 },
  statUnit: { fontSize:9, color:'#4B5A72' },
  statLabel: { fontSize:9, color:'#8B9CB8', textAlign:'center', lineHeight:1.3 },
  sectionLabel: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5A72', padding:'0 20px 8px' },
  journeyCard: { margin:'0 20px 16px', background:'#111827', borderRadius:14, padding:'14px', border:'1px solid rgba(124,58,237,0.18)' },
  journeyRow: { marginBottom:10 },
  journeyInfo: {},
  journeyTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:'#F0F4FF' },
  journeySub: { fontSize:11, color:'#8B9CB8', marginTop:3 },
  jTrack: { height:4, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' },
  jFill: { height:'100%', width:'43%', background:'linear-gradient(90deg,#3B82F6,#7C3AED)', borderRadius:2 },
  settingsList: { margin:'0 20px 16px', background:'#111827', borderRadius:16, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' },
  settingRow: { display:'flex', alignItems:'center', gap:12, padding:'13px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' },
  settingIcon: { fontSize:16, width:22, textAlign:'center', flexShrink:0 },
  settingLabel: { flex:1, fontSize:13, color:'#F0F4FF', fontWeight:400 },
  settingRight: { display:'flex', alignItems:'center', gap:6 },
  settingVal: { fontSize:11, color:'#4B5A72' },
  settingChevron: { fontSize:18, color:'#4B5A72' },
  signOutBtn: { margin:'0 20px', padding:'12px', background:'transparent', border:'1px solid rgba(248,113,113,0.2)', borderRadius:14, color:'#F87171', fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:'pointer' },
};

Object.assign(window, { ProfileScreen });
