// ManoSetu — Community Screen
// Peer support, group sessions, anonymous sharing

const CommunityScreen = ({ onNavigate }) => {
  const posts = [
    { id:1, anon:'Sparrow #4821', time:'2h ago', text:"First week of consistent breathing done. Didn't think I'd make it past day 3 honestly.", likes:14, replies:3, tag:'Milestone' },
    { id:2, anon:'River #2209',   time:'4h ago', text:"Does anyone else feel like anxiety spikes on Sunday evenings? I've been tracking mine and it's a consistent pattern.", likes:22, replies:8, tag:'Discussion' },
    { id:3, anon:'Birch #7734',   time:'6h ago', text:"Manas suggested I try Bhastrika before my presentation. Actually helped — shared this for anyone with performance anxiety.", likes:31, replies:5, tag:'Tip' },
  ];

  const groups = [
    { name:'Academic Stress', members:'1.2k', color:'#3B82F6' },
    { name:'Working Adults',  members:'890',  color:'#7C3AED' },
    { name:'Grief & Loss',    members:'340',  color:'#059669' },
  ];

  return (
    <div style={cm.container}>
      <div style={cm.header}>
        <div style={cm.title}>Community</div>
        <div style={cm.subtitle}>Anonymous peer support</div>
      </div>

      <div style={cm.privacyBanner}>
        <span style={cm.privacyIcon}>🔒</span>
        <span style={cm.privacyText}>All posts are anonymous. No names, no profiles — only shared experiences.</span>
      </div>

      <div style={cm.sectionRow}>
        <div style={cm.sectionLabel}>Support Groups</div>
      </div>
      <div style={cm.groupsRow}>
        {groups.map((g,i) => (
          <div key={i} style={{...cm.groupChip, borderColor: g.color + '55', background: g.color + '14'}}>
            <div style={{...cm.groupDot, background: g.color}}></div>
            <div>
              <div style={cm.groupName}>{g.name}</div>
              <div style={cm.groupMembers}>{g.members} members</div>
            </div>
          </div>
        ))}
      </div>

      <div style={cm.sectionRow}>
        <div style={cm.sectionLabel}>Recent Shares</div>
        <button style={cm.writeBtn}>+ Share</button>
      </div>

      <div style={cm.postList}>
        {posts.map(p => (
          <div key={p.id} style={cm.postCard}>
            <div style={cm.postTop}>
              <div style={cm.anonRow}>
                <div style={cm.anonAvatar}></div>
                <div style={cm.anonName}>{p.anon}</div>
                <span style={cm.tagBadge}>{p.tag}</span>
              </div>
              <div style={cm.postTime}>{p.time}</div>
            </div>
            <div style={cm.postText}>{p.text}</div>
            <div style={cm.postActions}>
              <button style={cm.actionBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {p.likes}
              </button>
              <button style={cm.actionBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {p.replies}
              </button>
              <button style={cm.actionBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const cm = {
  container: { display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', background:'#0C1120', paddingBottom:16 },
  header: { padding:'16px 20px 10px' },
  title: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#F0F4FF' },
  subtitle: { fontSize:12, color:'#8B9CB8', marginTop:3 },
  privacyBanner: { margin:'0 20px 14px', background:'rgba(52,211,153,0.07)', borderRadius:12, padding:'10px 12px', border:'1px solid rgba(52,211,153,0.15)', display:'flex', alignItems:'flex-start', gap:8 },
  privacyIcon: { fontSize:13, flexShrink:0 },
  privacyText: { fontSize:11, color:'#6EE7B7', lineHeight:1.5 },
  sectionRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 8px' },
  sectionLabel: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5A72' },
  writeBtn: { background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:8, padding:'4px 10px', fontSize:11, color:'#C4B5FD', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:500 },
  groupsRow: { display:'flex', flexDirection:'column', gap:6, padding:'0 20px 14px' },
  groupChip: { borderRadius:12, padding:'10px 12px', border:'1px solid', display:'flex', alignItems:'center', gap:10 },
  groupDot: { width:8, height:8, borderRadius:'50%', flexShrink:0 },
  groupName: { fontSize:12, fontWeight:500, color:'#F0F4FF' },
  groupMembers: { fontSize:10, color:'#4B5A72', marginTop:1 },
  postList: { display:'flex', flexDirection:'column', gap:8, padding:'0 20px' },
  postCard: { background:'#111827', borderRadius:14, padding:'13px', border:'1px solid rgba(255,255,255,0.06)' },
  postTop: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  anonRow: { display:'flex', alignItems:'center', gap:7 },
  anonAvatar: { width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,rgba(59,130,246,0.4),rgba(124,58,237,0.4))', flexShrink:0 },
  anonName: { fontSize:11, fontWeight:500, color:'#8B9CB8' },
  tagBadge: { padding:'1px 6px', borderRadius:999, fontSize:9, fontWeight:500, background:'rgba(124,58,237,0.12)', color:'#C4B5FD', border:'1px solid rgba(124,58,237,0.2)' },
  postTime: { fontSize:10, color:'#4B5A72' },
  postText: { fontSize:13, color:'#F0F4FF', lineHeight:1.6, fontWeight:300, marginBottom:10 },
  postActions: { display:'flex', gap:14 },
  actionBtn: { display:'flex', alignItems:'center', gap:5, background:'none', border:'none', fontSize:11, color:'#4B5A72', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0 },
};

Object.assign(window, { CommunityScreen });
