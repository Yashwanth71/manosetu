// ManoSetu — BreathingSession (v3)
// Psychology-informed: cognitive load reduced, eased orb, session arc, phase fade
// Timer: 7 min default / 11 min — full therapeutic sessions

const TECHNIQUES = [
  { id:'box',    name:'Box Breathing',   phases:[4,4,4,4], labels:['breathe in','hold','breathe out','hold'], desc:'Calms anxiety, restores focus',          color:'#3B82F6', glow:'#1D4ED8' },
  { id:'nadi',   name:'Nadi Shodhana',   phases:[4,0,8,0], labels:['breathe in','','breathe out',''],        desc:'Balances the nervous system',            color:'#7C3AED', glow:'#5B21B6' },
  { id:'478',    name:'4-7-8 Breathing', phases:[4,7,8,0], labels:['breathe in','hold','breathe out',''],    desc:'Releases anxiety, promotes sleep',       color:'#0891B2', glow:'#0E7490' },
  { id:'ujjayi', name:'Ujjayi',          phases:[4,0,6,0], labels:['breathe in','','breathe out',''],        desc:'Ocean breath · releases anger & tension',color:'#4F46E5', glow:'#3730A3' },
  { id:'bhast',  name:'Bhastrika',       phases:[2,0,2,0], labels:['breathe in','','breathe out',''],        desc:'Bellows breath · energises mind & body', color:'#F59E0B', glow:'#D97706' },
  { id:'sitali', name:'Sitali',          phases:[4,0,6,0], labels:['breathe in','','breathe out',''],        desc:'Cooling breath · reduces irritability',  color:'#06B6D4', glow:'#0891B2' },
  { id:'bhram',  name:'Bhramari',        phases:[4,0,8,0], labels:['breathe in','','hum out',''],            desc:'Humming bee · soothes grief & sadness',  color:'#8B5CF6', glow:'#6D28D9' },
  { id:'kapala', name:'Kapalabhati',     phases:[1,0,1,0], labels:['in','','out',''],                        desc:'Skull-shining · clears mental fog',      color:'#10B981', glow:'#047857' },
  { id:'dirga',  name:'Dirga Pranayama', phases:[5,0,5,0], labels:['breathe in','','breathe out',''],        desc:'3-part breath · deep full relaxation',   color:'#059669', glow:'#065F46' },
  { id:'anulom', name:'Anulom Vilom',    phases:[4,0,4,0], labels:['left nostril in','','right nostril out',''], desc:'Alternate nostril · clears & balances',color:'#6366F1', glow:'#4338CA' },
  { id:'sama',   name:'Sama Vritti',     phases:[4,0,4,0], labels:['breathe in','','breathe out',''],        desc:'Equal breathing · restores balance',     color:'#0284C7', glow:'#0369A1' },
  { id:'viloma', name:'Viloma',          phases:[3,1,3,1], labels:['breathe in','pause','breathe out','pause'], desc:'Interrupted breath · deep calm',     color:'#A855F7', glow:'#7C3AED' },
];

const DURATIONS = [7, 11];

// Smooth ease-in-out: feels organic, like a natural breath
const eioBreath = t => t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;

const BreathingSession = ({ onNavigate, initialTech }) => {
  const [stage, setStage]             = React.useState(initialTech ? 'session' : 'select');
  const [tech, setTech]               = React.useState(initialTech ? (TECHNIQUES.find(t => t.id === initialTech) || TECHNIQUES[0]) : null);
  const [duration, setDuration]       = React.useState(7);
  const [phaseLabel, setPhaseLabel]   = React.useState('breathe in');
  const [phaseKey, setPhaseKey]       = React.useState(0);
  const [paused, setPaused]           = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(420);
  const [breathCount, setBreathCount] = React.useState(0);
  const [searchTerm, setSearchTerm]   = React.useState('');

  const canvasRef = React.useRef(null);
  const rafRef    = React.useRef(null);
  const st        = React.useRef({ pi:0, pt:0, el:0, paused:false, lastTs:null, tech:null, dur:0, bc:0 });

  // ── Draw ──────────────────────────────────────────────────────────────────
  const drawRing = (t, pi, pp, rem, dur) => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const cx = 140, cy = 140, ringR = 106, outerR = 126;
    ctx.clearRect(0, 0, 280, 280);

    // Outer session progress arc (elapsed fills clockwise — motivating, shows achievement)
    const elFrac = dur > 0 ? Math.min(1, (dur - rem) / dur) : 0;
    ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2; ctx.stroke();
    if (elFrac > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, -Math.PI / 2, -Math.PI / 2 + elFrac * Math.PI * 2);
      ctx.strokeStyle = t.color + '55'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
    }

    // Sphere scale — ease-in-out for inhale/exhale, flat hold
    const p = Math.max(0, Math.min(1, pp));
    const mn = 0.62, mx = 0.96;
    const sc = pi === 0 ? mn + eioBreath(p) * (mx - mn)
             : pi === 1 ? mx
             : pi === 2 ? mx - eioBreath(p) * (mx - mn)
             : mn;
    const sR = 86 * sc;

    // Ambient glow halo
    const gl = ctx.createRadialGradient(cx, cy, sR * 0.4, cx, cy, ringR * 1.5);
    gl.addColorStop(0, t.color + '1E'); gl.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, ringR * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = gl; ctx.fill();

    // Ring track
    ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 1.5; ctx.stroke();

    // Phase boundary ticks
    const phases = t.phases, cyc = phases.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    phases.forEach(ph => {
      if (ph > 0) {
        const a = (acc / cyc) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx + (ringR - 6) * Math.cos(a), cy + (ringR - 6) * Math.sin(a));
        ctx.lineTo(cx + (ringR + 6) * Math.cos(a), cy + (ringR + 6) * Math.sin(a));
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
        acc += ph;
      }
    });

    // Sphere gradient — sky blue → teal → brand → deep (matches reference)
    const sg = ctx.createRadialGradient(cx - sR*0.30, cy - sR*0.26, sR*0.04, cx + sR*0.08, cy + sR*0.08, sR);
    sg.addColorStop(0,    '#BAE6FD');
    sg.addColorStop(0.25, '#7DD3FA');
    sg.addColorStop(0.58, t.color);
    sg.addColorStop(1,    t.glow);
    ctx.beginPath(); ctx.arc(cx, cy, sR, 0, Math.PI * 2);
    ctx.fillStyle = sg; ctx.fill();

    // Inner specular highlight
    const hi = ctx.createRadialGradient(cx - sR*0.26, cy - sR*0.28, 0, cx - sR*0.1, cy - sR*0.1, sR * 0.52);
    hi.addColorStop(0, 'rgba(255,255,255,0.22)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(cx, cy, sR, 0, Math.PI * 2);
    ctx.fillStyle = hi; ctx.fill();

    // Indicator dot position on ring
    let ec = 0;
    for (let i = 0; i < pi; i++) ec += phases[i] || 0;
    ec += pp * (phases[pi] || 0.5);
    const ang = (ec / cyc) * Math.PI * 2 - Math.PI / 2;
    const ix = cx + ringR * Math.cos(ang), iy = cy + ringR * Math.sin(ang);

    // Indicator glow halo
    const dg = ctx.createRadialGradient(ix, iy, 0, ix, iy, 15);
    dg.addColorStop(0, 'rgba(255,255,255,0.55)'); dg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(ix, iy, 15, 0, Math.PI * 2);
    ctx.fillStyle = dg; ctx.fill();

    // Teardrop indicator — oriented tangentially
    ctx.save();
    ctx.translate(ix, iy); ctx.rotate(ang + Math.PI / 2);
    ctx.beginPath(); ctx.ellipse(0, 0, 5, 8.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
    ctx.restore();
  };

  // ── Start session ─────────────────────────────────────────────────────────
  const startSession = (t) => {
    setTech(t); setStage('session'); setPhaseLabel(t.labels[0]);
    setPhaseKey(0); setTimeRemaining(duration * 60); setBreathCount(0); setPaused(false);
    const s = st.current;
    s.pi = 0; s.pt = 0; s.el = 0; s.paused = false; s.lastTs = null;
    s.tech = t; s.dur = duration * 60; s.bc = 0;
  };

  // ── rAF loop ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (stage !== 'session' || !tech) return;
    const s = st.current;
    s.tech = tech; s.dur = duration * 60;

    const tick = (ts) => {
      if (s.paused) { rafRef.current = requestAnimationFrame(tick); return; }
      if (!s.lastTs) s.lastTs = ts;
      const dt = Math.min((ts - s.lastTs) / 1000, 0.1);
      s.lastTs = ts; s.el += dt; s.pt += dt;

      const phases = s.tech.phases;
      let pDur = phases[s.pi] || 0.5; if (pDur === 0) pDur = 0.3;

      if (s.pt >= pDur) {
        s.pt -= pDur;
        const prev = s.pi;
        s.pi = (s.pi + 1) % 4;
        // Full cycle completed → increment breath count
        if (s.pi === 0 && prev === 3) { s.bc++; setBreathCount(s.bc); }
        setPhaseLabel(s.tech.labels[s.pi]);
        setPhaseKey(k => k + 1);
      }

      const rem = Math.max(0, s.dur - s.el);
      setTimeRemaining(Math.ceil(rem));
      drawRing(s.tech, s.pi, s.pt / (phases[s.pi] || 0.5), rem, s.dur);

      if (rem > 0) rafRef.current = requestAnimationFrame(tick);
      else setStage('done');
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage, tech]);

  const togglePause = () => {
    const n = !paused; setPaused(n);
    st.current.paused = n; st.current.lastTs = null;
  };
  const stopSession = () => { cancelAnimationFrame(rafRef.current); setStage('select'); };
  const timeStr = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`;
  const filteredTechs = TECHNIQUES.filter(t =>
    searchTerm === '' || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── SELECT SCREEN ─────────────────────────────────────────────────────────
  if (stage === 'select') return (
    <div style={bs.sel}>
      <div style={bs.selH}>
        <button style={bs.back} onClick={() => onNavigate('home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B9CB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={bs.selT}>Breathe</div>
        <div style={{width:32}}></div>
      </div>

      <div style={bs.durationHint}>Choose session length</div>
      <div style={bs.durRow}>
        {DURATIONS.map(d => (
          <button key={d} style={{...bs.durBtn, ...(duration === d ? bs.durA : {})}} onClick={() => setDuration(d)}>
            <span style={bs.durNum}>{d}</span>
            <span style={bs.durUnit}>min</span>
          </button>
        ))}
      </div>

      <div style={bs.srchWrap}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4B5A72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input style={bs.srchIn} placeholder="Search by name or effect…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div style={bs.list}>
        {filteredTechs.map(t => (
          <div key={t.id} style={bs.techCard} onClick={() => startSession(t)}>
            <div style={{...bs.dot, background: t.color, boxShadow: `0 0 10px ${t.color}55`}}></div>
            <div style={{flex:1}}>
              <div style={bs.tN}>{t.name}</div>
              <div style={bs.tD}>{t.phases.filter(p => p > 0).join('-')} · {t.desc}</div>
            </div>
            <div style={bs.arr}>›</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SESSION SCREEN ────────────────────────────────────────────────────────
  if (stage === 'session') return (
    <div style={{...bs.sess, background:`radial-gradient(ellipse at 50% 42%, ${tech.glow}2A 0%, #0C1120 68%)`}}>
      <style>{`
        @keyframes bsPhIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <button style={bs.sBack} onClick={stopSession}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div style={bs.sTitle}>{tech.name}</div>

      {/* Canvas — the single visual focus */}
      <div style={bs.cvWrap}>
        <canvas ref={canvasRef} width={280} height={280} style={{width:280, height:280}}></canvas>
      </div>

      {/* Breath counter — small, ambient, non-intrusive */}
      <div style={{...bs.bcRow, visibility: breathCount > 0 ? 'visible' : 'hidden'}}>
        {breathCount} breath{breathCount !== 1 ? 's' : ''}
      </div>

      {/* Phase label — fades in on each change */}
      <div key={phaseKey} style={{...bs.phLbl, animation:'bsPhIn 0.38s ease-out'}}>
        {phaseLabel || 'hold'}
      </div>

      {/* Minimal controls — no cognitive noise during session */}
      <div style={bs.ctrlRow}>
        <button style={bs.cBtn} onClick={stopSession} title="End session">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><rect x="3" y="3" width="18" height="18" rx="2.5"/></svg>
        </button>
        <button style={bs.playBtn} onClick={togglePause}>
          {paused
            ? <svg width="19" height="19" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            : <svg width="19" height="19" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          }
        </button>
        <div style={{width:39}}></div>
      </div>

      <div style={bs.timer}>{timeStr}</div>
    </div>
  );

  // ── DONE ──────────────────────────────────────────────────────────────────
  return (
    <div style={{...bs.sess, justifyContent:'center', gap:14, padding:'0 32px'}}>
      <div style={{fontSize:40, marginBottom:4, color:'#34D399'}}>✓</div>
      <div style={{fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'#F0F4FF', textAlign:'center'}}>
        Session Complete
      </div>
      <div style={{fontSize:13, color:'#8B9CB8', textAlign:'center', lineHeight:1.75, maxWidth:260}}>
        {breathCount} breath{breathCount !== 1 ? 's' : ''} · {duration} min of {tech.name}.
        <br/>Manas will log this in your wellness timeline.
      </div>
      <button
        style={{background:'linear-gradient(135deg,#3B82F6,#7C3AED)', borderRadius:14, padding:'13px 0', color:'white', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, border:'none', width:'80%', marginTop:12, cursor:'pointer'}}
        onClick={() => onNavigate('home')}
      >
        Back to Home
      </button>
    </div>
  );
};

const bs = {
  // Select
  sel:  { display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', background:'#0C1120', paddingBottom:16 },
  selH: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px 10px' },
  back: { background:'none', border:'none', padding:4, cursor:'pointer', display:'flex', width:32, height:32, alignItems:'center', justifyContent:'center' },
  selT: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:'#F0F4FF' },
  durationHint: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4B5A72', padding:'0 20px 8px' },
  durRow: { display:'flex', gap:10, padding:'0 20px 14px' },
  durBtn: { flex:1, padding:'12px 0', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', background:'#111827', color:'#8B9CB8', fontFamily:"'DM Sans',sans-serif", cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:1 },
  durA:  { background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', color:'#93C5FD' },
  durNum:{ fontSize:20, fontFamily:"'Syne',sans-serif", fontWeight:700, lineHeight:1 },
  durUnit:{ fontSize:10, opacity:0.6 },
  srchWrap: { margin:'0 20px 12px', background:'#111827', borderRadius:12, padding:'9px 12px', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:8 },
  srchIn:   { background:'none', border:'none', outline:'none', flex:1, fontSize:13, color:'#F0F4FF', fontFamily:"'DM Sans',sans-serif" },
  list: { display:'flex', flexDirection:'column', gap:7, padding:'0 20px' },
  techCard: { background:'#111827', borderRadius:14, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12, cursor:'pointer' },
  dot:  { width:10, height:10, borderRadius:'50%', flexShrink:0 },
  tN:   { fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:'#F0F4FF', marginBottom:2 },
  tD:   { fontSize:11, color:'#8B9CB8', lineHeight:1.4 },
  arr:  { fontSize:20, color:'#4B5A72' },
  // Session
  sess:   { display:'flex', flexDirection:'column', alignItems:'center', height:'100%', background:'#0C1120', position:'relative', paddingBottom:16 },
  sBack:  { position:'absolute', top:12, left:14, background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 },
  sTitle: { fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13, color:'rgba(255,255,255,0.38)', marginTop:16, letterSpacing:'0.08em', textTransform:'uppercase' },
  cvWrap: { flex:1, display:'flex', alignItems:'center', justifyContent:'center' },
  bcRow:  { fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.26)', letterSpacing:'0.06em', marginBottom:4, height:14 },
  phLbl:  { fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:22, color:'rgba(255,255,255,0.82)', letterSpacing:'0.01em', marginBottom:22 },
  ctrlRow:{ display:'flex', alignItems:'center', gap:28, marginBottom:12 },
  cBtn:   { background:'none', border:'none', cursor:'pointer', display:'flex', padding:8 },
  playBtn:{ width:52, height:52, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.14)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', backdropFilter:'blur(8px)' },
  timer:  { fontFamily:"'DM Mono',monospace", fontSize:14, color:'rgba(255,255,255,0.28)', letterSpacing:'0.08em' },
};

Object.assign(window, { BreathingSession, TECHNIQUES });
