// ManoSetu — Therapy screen
// Therapist discovery, matching confidence, booking flow

const SanghaTherapy = ({ onNavigate }) => {
  const [selected, setSelected] = React.useState(null);

  const therapists = [
    { initials:'AS', name:'Dr. Ananya S.', spec:'CBT · Anxiety · Academic stress', lang:'Hindi + English', avail:'Today, 4 PM', wait:'Today', conf:86, color:'#7C3AED' },
    { initials:'RK', name:'Rahul K.',       spec:'ACT · Depression · Career',       lang:'English',        avail:'Tomorrow, 10 AM', wait:'1 day', conf:79, color:'#3B82F6' },
    { initials:'PM', name:'Preethi M.',     spec:'CBT · Relationships · Trauma',   lang:'Tamil + English', avail:'Wed, 6 PM',      wait:'2 days', conf:73, color:'#059669' },
  ];

  if (selected !== null) {
    const t = therapists[selected];
    return (
      <div style={th.container}>
        <div style={th.bookHeader}>
          <button style={th.back} onClick={() => setSelected(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B9CB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div style={th.bookTitle}>Book Session</div>
          <div style={{width:32}}></div>
        </div>
        <div style={th.bookCard}>
          <div style={{...th.bigAvatar, background:`linear-gradient(135deg,${t.color}99,${t.color})`}}>{t.initials}</div>
          <div style={th.bookName}>{t.name}</div>
          <div style={th.bookSpec}>{t.spec}</div>
          <div style={th.bookLang}>{t.lang}</div>
          <div style={th.confRow}>
            <div style={th.confBar}>
              <div style={{...th.confFill, width:`${t.conf}%`, background:`linear-gradient(90deg,#3B82F6,${t.color})`}}></div>
            </div>
            <span style={th.confNum}>{t.conf}% match</span>
          </div>
        </div>
        <div style={th.slotLabel}>Available Slots</div>
        {['Today, 4:00 PM','Today, 6:00 PM','Tomorrow, 10:00 AM','Tomorrow, 2:00 PM'].map((slot, i) => (
          <div key={i} style={{...th.slotRow, ...(i===0?th.slotActive:{})}}>
            <div style={th.slotDot}></div>
            <div style={th.slotText}>{slot}</div>
            {i===0 && <span style={th.slotBadge}>Earliest</span>}
          </div>
        ))}
        <div style={th.bookCTA}>
          <button style={th.bookBtn} onClick={() => setSelected(null)}>Confirm Booking</button>
          <div style={th.privacyNote}>🔒 Your data stays private. k-anonymity ≥10.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={th.container}>
      <div style={th.header}>
        <div style={th.title}>Therapy</div>
        <div style={th.subtitle}>Matched to your needs</div>
      </div>

      <div style={th.matchBanner}>
        <div style={th.matchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div style={th.matchText}>Based on your mood logs and Manas conversations, we've found 3 strong matches.</div>
      </div>

      <div style={th.therapistList}>
        {therapists.map((t, i) => (
          <div key={i} style={th.card} onClick={() => setSelected(i)}>
            <div style={{...th.avatar, background:`linear-gradient(135deg,${t.color}88,${t.color})`}}>{t.initials}</div>
            <div style={th.info}>
              <div style={th.name}>{t.name}</div>
              <div style={th.spec}>{t.spec}</div>
              <div style={th.lang}>{t.lang}</div>
              <div style={th.confRow}>
                <div style={th.confBar}>
                  <div style={{...th.confFill, width:`${t.conf}%`, background:`linear-gradient(90deg,#3B82F6,${t.color})`}}></div>
                </div>
                <span style={th.confNum}>{t.conf}%</span>
              </div>
            </div>
            <div style={th.right}>
              <span style={th.availBadge}>{t.wait}</span>
              <div style={th.chevron}>›</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const th = {
  container: { display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', background:'#0C1120', paddingBottom:16 },
  header: { padding:'16px 20px 10px' },
  title: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#F0F4FF' },
  subtitle: { fontSize:12, color:'#8B9CB8', marginTop:3 },
  matchBanner: { margin:'0 20px 14px', background:'rgba(124,58,237,0.08)', borderRadius:14, padding:'12px 14px', border:'1px solid rgba(124,58,237,0.2)', display:'flex', gap:10, alignItems:'flex-start' },
  matchIcon: { width:28, height:28, borderRadius:8, background:'rgba(124,58,237,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  matchText: { fontSize:12, color:'#C4B5FD', lineHeight:1.55, fontWeight:300 },
  therapistList: { display:'flex', flexDirection:'column', gap:10, padding:'0 20px' },
  card: { background:'#111827', borderRadius:16, padding:'14px', border:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer' },
  avatar: { width:44, height:44, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:'white' },
  info: { flex:1 },
  name: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:'#F0F4FF', marginBottom:2 },
  spec: { fontSize:11, color:'#8B9CB8', lineHeight:1.4 },
  lang: { fontSize:10, color:'#4B5A72', marginTop:3 },
  confRow: { display:'flex', alignItems:'center', gap:6, marginTop:8 },
  confBar: { flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' },
  confFill: { height:'100%', borderRadius:2 },
  confNum: { fontFamily:"'DM Mono',monospace", fontSize:10, color:'#34D399', whiteSpace:'nowrap' },
  right: { display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 },
  availBadge: { padding:'2px 7px', borderRadius:999, fontSize:9, fontWeight:500, background:'rgba(52,211,153,0.1)', color:'#34D399', border:'1px solid rgba(52,211,153,0.2)', whiteSpace:'nowrap' },
  chevron: { fontSize:18, color:'#4B5A72' },
  // Booking detail
  back: { background:'none', border:'none', cursor:'pointer', display:'flex', padding:4, width:32, height:32, alignItems:'center', justifyContent:'center' },
  bookHeader: { display:'flex', alignItems:'center', padding:'12px 16px 10px', gap:8 },
  bookTitle: { flex:1, textAlign:'center', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'#F0F4FF' },
  bookCard: { margin:'0 20px 16px', background:'#111827', borderRadius:16, padding:'20px 16px', border:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', alignItems:'center', gap:6 },
  bigAvatar: { width:64, height:64, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'white', marginBottom:4 },
  bookName: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:'#F0F4FF' },
  bookSpec: { fontSize:12, color:'#8B9CB8', textAlign:'center' },
  bookLang: { fontSize:11, color:'#4B5A72' },
  slotLabel: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5A72', padding:'0 20px 8px' },
  slotRow: { margin:'0 20px 8px', background:'#111827', borderRadius:12, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 },
  slotActive: { border:'1px solid rgba(124,58,237,0.35)', background:'rgba(124,58,237,0.08)' },
  slotDot: { width:8, height:8, borderRadius:'50%', background:'#7C3AED', flexShrink:0 },
  slotText: { flex:1, fontSize:13, color:'#F0F4FF', fontWeight:500 },
  slotBadge: { padding:'2px 7px', borderRadius:999, fontSize:9, background:'rgba(59,130,246,0.12)', color:'#93C5FD', border:'1px solid rgba(59,130,246,0.2)' },
  bookCTA: { padding:'16px 20px 0' },
  bookBtn: { width:'100%', padding:14, background:'linear-gradient(135deg,#3B82F6,#7C3AED)', border:'none', borderRadius:14, color:'white', fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer' },
  privacyNote: { fontSize:10, color:'#4B5A72', textAlign:'center', marginTop:10, lineHeight:1.4 },
};

Object.assign(window, { SanghaTherapy });
