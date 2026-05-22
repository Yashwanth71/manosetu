// ManoSetu — ManasChat (v3)
// Emotion-aware chat + inline 3-min micro breathing widget
// Psychology: attentional narrowing addressed — breathing stays IN context, no navigation disruption

const EMOTION_MAP = [
  { keywords:['anxious','anxiety','nervous','worry','worried','panic'],           techId:'box',    why:'Box breathing resets your nervous system in under 3 minutes.' },
  { keywords:['stress','stressed','overwhelmed','pressure','too much'],           techId:'nadi',   why:'Nadi Shodhana can restore balance when life feels like too much.' },
  { keywords:['angry','anger','frustrated','irritated','rage'],                   techId:'ujjayi', why:'Ujjayi breath releases anger stored in the body.' },
  { keywords:['sad','sadness','hopeless','lonely','cry','grief','lost'],          techId:'bhram',  why:'Bhramari\'s gentle hum has been shown to soothe deep sadness.' },
  { keywords:['tired','exhausted','drained','fatigue','no energy','low energy'],  techId:'bhast',  why:'Bhastrika will energise you — even just 3 minutes helps.' },
  { keywords:['can\'t focus','distracted','blank','unfocused','foggy','mind'],    techId:'kapala', why:'Kapalabhati clears mental fog in just a few rounds.' },
  { keywords:['can\'t sleep','insomnia','restless','awake','sleep'],             techId:'478',    why:'The 4-7-8 pattern activates your parasympathetic nervous system.' },
  { keywords:['irritable','heated','agitated','reactive'],                        techId:'sitali', why:'Sitali\'s cooling breath is ideal for irritability and heat.' },
];

function detectEmotion(text) {
  const lower = text.toLowerCase();
  for (const e of EMOTION_MAP) {
    if (e.keywords.some(k => lower.includes(k))) return e;
  }
  return null;
}

function getManasReply(userText, emotion) {
  const base = [
    "That sounds really heavy. Can you tell me more about what's been building up?",
    "I hear you. What's been weighing on you the most today?",
    "Thank you for sharing that with me. You don't have to carry this alone.",
    "That makes sense given what you're going through. What would feel most helpful right now?",
  ];
  if (!emotion) return base[Math.floor(Math.random() * base.length)];
  const contextual = {
    box:    "That feeling is your nervous system in overdrive. Let's try something together — right here, right now.",
    nadi:   "When life piles up like this, the nervous system needs recalibration. There's a technique that can help.",
    ujjayi: "Anger that isn't released stays in the body. There's a breath practice designed specifically for this.",
    bhram:  "Sadness deserves space. A gentle physical anchor can help you stay present with it.",
    bhast:  "When you're this drained, the body needs oxygen before the mind can process anything. Let's start there.",
    kapala: "A foggy mind is often a signal of shallow breathing. Let's reset in under 3 minutes.",
    '478':  "Your nervous system is telling you something. The 4-7-8 pattern is one of the fastest ways to respond.",
    sitali: "Cooling the nervous system physically shifts the emotional state too. I know something that can help.",
  };
  return contextual[emotion.techId] || base[0];
}

// ── Ease in-out for smooth orb breathing ────────────────────────────────────
const eioMC = t => t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;

// ── InlineBreather ───────────────────────────────────────────────────────────
// 3-min micro session that lives inside the chat — no navigation, no context switch
const InlineBreather = ({ tech, onDone }) => {
  const TOTAL = 180; // 3 min
  const [running,    setRunning]    = React.useState(false);
  const [phaseLabel, setPhaseLabel] = React.useState(tech.labels[0] || 'breathe in');
  const [phaseKey,   setPhaseKey]   = React.useState(0);
  const [timeLeft,   setTimeLeft]   = React.useState(TOTAL);
  const [done,       setDone]       = React.useState(false);

  const cvRef  = React.useRef(null);
  const rafRef = React.useRef(null);
  const st     = React.useRef({ idx:0, pt:0, el:0, active:false, lastTs:null });

  // tickRef pattern avoids stale closure in rAF loop
  const tickRef = React.useRef(null);
  tickRef.current = (ts) => {
    const s = st.current;
    if (!s.active) return;
    if (!s.lastTs) s.lastTs = ts;
    const dt = Math.min((ts - s.lastTs) / 1000, 0.1);
    s.lastTs = ts; s.el += dt; s.pt += dt;

    const phases = tech.phases;
    let pDur = phases[s.idx] || 0.5; if (pDur === 0) pDur = 0.3;
    if (s.pt >= pDur) {
      s.pt -= pDur;
      s.idx = (s.idx + 1) % 4;
      setPhaseLabel(tech.labels[s.idx] || 'hold');
      setPhaseKey(k => k + 1);
    }

    const rem = Math.max(0, TOTAL - s.el);
    setTimeLeft(Math.ceil(rem));
    drawMini(s.idx, s.pt / (phases[s.idx] || 0.5));

    if (rem > 0) rafRef.current = requestAnimationFrame(tickRef.current);
    else { s.active = false; setRunning(false); setDone(true); if (onDone) onDone(); }
  };

  const drawMini = (idx, pp) => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const cx = 70, cy = 70, ringR = 50, outerR = 62;
    ctx.clearRect(0, 0, 140, 140);

    // Session arc (elapsed fills) — visual heartbeat of the 3-min window
    const elFrac = Math.min(1, st.current.el / TOTAL);
    ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2; ctx.stroke();
    if (elFrac > 0) {
      ctx.beginPath(); ctx.arc(cx, cy, outerR, -Math.PI / 2, -Math.PI / 2 + elFrac * Math.PI * 2);
      ctx.strokeStyle = tech.color + '77'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
    }

    // Orb scale — eased
    const p  = Math.max(0, Math.min(1, pp));
    const mn = 0.62, mx = 0.96;
    const sc = idx === 0 ? mn + eioMC(p) * (mx - mn)
             : idx === 1 ? mx
             : idx === 2 ? mx - eioMC(p) * (mx - mn)
             : mn;
    const sR = 40 * sc;

    // Ambient glow
    const gl = ctx.createRadialGradient(cx, cy, sR * 0.4, cx, cy, ringR * 1.45);
    gl.addColorStop(0, tech.color + '1A'); gl.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, ringR * 1.45, 0, Math.PI * 2);
    ctx.fillStyle = gl; ctx.fill();

    // Ring track
    ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1.5; ctx.stroke();

    // Phase ticks
    const phases = tech.phases, cyc = phases.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    phases.forEach(ph => {
      if (ph > 0) {
        const a = (acc / cyc) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx + (ringR - 4) * Math.cos(a), cy + (ringR - 4) * Math.sin(a));
        ctx.lineTo(cx + (ringR + 4) * Math.cos(a), cy + (ringR + 4) * Math.sin(a));
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
        acc += ph;
      }
    });

    // Sphere gradient — sky → teal → brand → deep
    const sg = ctx.createRadialGradient(cx - sR*0.3, cy - sR*0.26, sR*0.04, cx + sR*0.08, cy + sR*0.08, sR);
    sg.addColorStop(0, '#BAE6FD'); sg.addColorStop(0.25, '#7DD3FA');
    sg.addColorStop(0.6, tech.color); sg.addColorStop(1, tech.glow);
    ctx.beginPath(); ctx.arc(cx, cy, sR, 0, Math.PI * 2);
    ctx.fillStyle = sg; ctx.fill();

    // Specular highlight
    const hi = ctx.createRadialGradient(cx - sR*0.26, cy - sR*0.28, 0, cx - sR*0.1, cy - sR*0.1, sR*0.5);
    hi.addColorStop(0, 'rgba(255,255,255,0.22)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(cx, cy, sR, 0, Math.PI * 2);
    ctx.fillStyle = hi; ctx.fill();

    // Indicator
    let ec = 0; for (let i = 0; i < idx; i++) ec += phases[i] || 0;
    ec += pp * (phases[idx] || 0.5);
    const ang = (ec / cyc) * Math.PI * 2 - Math.PI / 2;
    const ix = cx + ringR * Math.cos(ang), iy = cy + ringR * Math.sin(ang);
    const dg = ctx.createRadialGradient(ix, iy, 0, ix, iy, 10);
    dg.addColorStop(0, 'rgba(255,255,255,0.55)'); dg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(ix, iy, 10, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill();
    ctx.save(); ctx.translate(ix, iy); ctx.rotate(ang + Math.PI / 2);
    ctx.beginPath(); ctx.ellipse(0, 0, 3.5, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill(); ctx.restore();
  };

  const start  = () => { st.current.active = true; st.current.lastTs = null; setRunning(true); rafRef.current = requestAnimationFrame(tickRef.current); };
  const pause  = () => { st.current.active = false; st.current.lastTs = null; setRunning(false); cancelAnimationFrame(rafRef.current); };
  const resume = () => { st.current.active = true; st.current.lastTs = null; setRunning(true); rafRef.current = requestAnimationFrame(tickRef.current); };

  React.useEffect(() => { drawMini(0, 0); return () => cancelAnimationFrame(rafRef.current); }, []);

  const tStr = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;

  if (done) return (
    <div style={mc.miniDone}>
      <div style={mc.miniDoneCheck}>✓</div>
      <div style={mc.miniDoneText}>3 minutes complete</div>
    </div>
  );

  return (
    <div style={mc.miniWrap}>
      <style>{`@keyframes mcPhIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <canvas ref={cvRef} width={140} height={140} style={{width:140, height:140, display:'block'}}></canvas>
      <div key={phaseKey} style={{...mc.miniPhase, animation:'mcPhIn 0.3s ease-out'}}>
        {running || timeLeft < TOTAL ? (phaseLabel || 'hold') : 'ready'}
      </div>
      <div style={mc.miniTimer}>{tStr}</div>
      <button
        style={{...mc.miniBtn, background: running ? 'rgba(255,255,255,0.08)' : tech.color}}
        onClick={running ? pause : (timeLeft === TOTAL ? start : resume)}
      >
        {running ? 'Pause' : timeLeft === TOTAL ? 'Begin' : 'Resume'}
      </button>
    </div>
  );
};

// ── ManasChat ────────────────────────────────────────────────────────────────
const ManasChat = ({ onNavigate }) => {
  const TECHS = window.TECHNIQUES || [];

  const [messages,      setMessages]      = React.useState([
    { id:1, from:'manas', text:"I'm here. What's been on your mind today?", time:'9:41 AM' },
  ]);
  const [input,         setInput]         = React.useState('');
  const [isTyping,      setIsTyping]      = React.useState(false);
  const [expandedTools, setExpandedTools] = React.useState(new Set());
  const scrollRef = React.useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const now = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    setMessages(m => [...m, { id: Date.now(), from:'user', text, time:now }]);
    setInput('');
    setIsTyping(true);
    const emotion = detectEmotion(text);
    setTimeout(() => {
      setIsTyping(false);
      const reply = getManasReply(text, emotion);
      const tech  = emotion ? TECHS.find(t => t.id === emotion.techId) : null;
      setMessages(m => [...m, {
        id: Date.now() + 1, from:'manas', text:reply, time:now,
        breatheTool: tech ? { tech, why: emotion.why } : null,
      }]);
    }, 1200 + Math.random() * 600);
  };

  const handleBreathDone = () => {
    const now = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    setTimeout(() => {
      setMessages(m => [...m, {
        id: Date.now(), from:'manas', time:now,
        text:"Take a moment. Do you notice any shift — even a small one?",
      }]);
    }, 1000);
  };

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div style={mc.container}>

      {/* Header */}
      <div style={mc.header}>
        <div style={mc.headerAvatar}></div>
        <div style={{flex:1}}>
          <div style={mc.headerName}>Manas</div>
          <div style={mc.headerStatus}><span style={mc.statusDot}></span>Active now</div>
        </div>
        <button style={mc.headerBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B9CB8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </button>
      </div>

      {/* Thread */}
      <div style={mc.thread} ref={scrollRef}>
        <div style={mc.datePill}>Today</div>

        {messages.map(msg => (
          <div key={msg.id} style={msg.from === 'user' ? mc.userRow : mc.manasRow}>
            {msg.from === 'manas' && <div style={mc.manasAvatar}></div>}
            <div style={msg.from === 'user' ? mc.userBubble : mc.manasBubble}>
              <div style={msg.from === 'user' ? mc.userText : mc.manasText}>{msg.text}</div>

              {/* Inline breathing tool card */}
              {msg.breatheTool && (
                <div style={mc.toolCard}>
                  <div style={mc.toolHeader}>
                    <div style={{...mc.toolColorDot, background: msg.breatheTool.tech.color}}></div>
                    <span style={mc.toolEyebrow}>Breathing · suggested for you</span>
                  </div>
                  <div style={mc.toolName}>{msg.breatheTool.tech.name}</div>
                  <div style={mc.toolPhases}>
                    {msg.breatheTool.tech.phases.filter(p => p > 0).join('-')} pattern · {msg.breatheTool.tech.desc}
                  </div>
                  <div style={mc.toolWhy}>{msg.breatheTool.why}</div>

                  {expandedTools.has(msg.id) ? (
                    <InlineBreather
                      tech={msg.breatheTool.tech}
                      onDone={handleBreathDone}
                    />
                  ) : (
                    <div style={mc.toolBtnRow}>
                      <button
                        style={{...mc.toolBtnPrimary, background: msg.breatheTool.tech.color}}
                        onClick={() => setExpandedTools(s => new Set([...s, msg.id]))}
                      >
                        Quick 3-min ↓
                      </button>
                      <button
                        style={mc.toolBtnSec}
                        onClick={() => onNavigate('breathe')}
                      >
                        Full session →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div style={msg.from === 'user' ? mc.userTime : mc.manasTime}>{msg.time}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={mc.manasRow}>
            <div style={mc.manasAvatar}></div>
            <div style={mc.typingBubble}>
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} style={{...mc.typingDot, animationDelay:`${d}s`}}></span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts — only shown at start */}
      {messages.length <= 2 && (
        <div style={mc.quickRow}>
          {["I'm feeling anxious", "Work stress is overwhelming", "I can't sleep", "I feel really drained"].map((p, i) => (
            <button key={i} style={mc.quickChip} onClick={() => setInput(p)}>{p}</button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={mc.composer}>
        <input
          style={mc.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Tell Manas what's on your mind…"
        />
        <button style={mc.sendBtn} onClick={send}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>

      <style>{`@keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}`}</style>
    </div>
  );
};

const mc = {
  container: { display:'flex', flexDirection:'column', height:'100%', background:'#0C1120' },
  header: { display:'flex', alignItems:'center', gap:10, padding:'11px 16px', background:'#111827', borderBottom:'1px solid rgba(255,255,255,0.06)' },
  headerAvatar: { width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#7C3AED)', flexShrink:0 },
  headerName: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:'#F0F4FF' },
  headerStatus: { fontSize:10, color:'#34D399', display:'flex', alignItems:'center', gap:3, marginTop:1 },
  statusDot: { width:5, height:5, borderRadius:'50%', background:'#34D399', display:'inline-block' },
  headerBtn: { marginLeft:'auto', background:'none', border:'none', padding:4, cursor:'pointer', display:'flex' },
  thread: { flex:1, overflowY:'auto', padding:'12px 16px', display:'flex', flexDirection:'column', gap:10 },
  datePill: { alignSelf:'center', background:'rgba(255,255,255,0.05)', borderRadius:999, padding:'3px 10px', fontSize:10, color:'#4B5A72', marginBottom:2 },
  userRow: { display:'flex', justifyContent:'flex-end' },
  manasRow: { display:'flex', alignItems:'flex-end', gap:6 },
  userBubble: { maxWidth:'78%', background:'#7C3AED', borderRadius:'18px 18px 4px 18px', padding:'10px 13px' },
  manasBubble: { maxWidth:'86%', background:'#1C2333', borderRadius:'4px 18px 18px 18px', padding:'10px 13px', border:'1px solid rgba(124,58,237,0.15)' },
  userText: { fontSize:14, color:'#F0F4FF', lineHeight:1.55 },
  manasText: { fontSize:14, fontWeight:300, color:'#C4B5FD', lineHeight:1.7 },
  userTime: { fontSize:9, color:'rgba(255,255,255,0.38)', marginTop:4, textAlign:'right' },
  manasTime: { fontSize:9, color:'#4B5A72', marginTop:4 },
  manasAvatar: { width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#7C3AED)', flexShrink:0 },
  typingBubble: { background:'#1C2333', borderRadius:'4px 18px 18px 18px', padding:'12px 14px', border:'1px solid rgba(124,58,237,0.1)', display:'flex', gap:4, alignItems:'center' },
  typingDot: { width:6, height:6, borderRadius:'50%', background:'#C4B5FD', display:'inline-block', animation:'typingBounce 1.2s ease-in-out infinite' },
  // Tool card
  toolCard: { background:'rgba(12,17,32,0.85)', borderRadius:14, padding:'12px 13px', marginTop:10, border:'1px solid rgba(124,58,237,0.22)' },
  toolHeader: { display:'flex', alignItems:'center', gap:6, marginBottom:6 },
  toolColorDot: { width:7, height:7, borderRadius:'50%', flexShrink:0 },
  toolEyebrow: { fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'#7C3AED' },
  toolName: { fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:'#F0F4FF', marginBottom:2 },
  toolPhases: { fontFamily:"'DM Mono',monospace", fontSize:9, color:'#4B5A72', marginBottom:6, letterSpacing:'0.04em' },
  toolWhy: { fontSize:11, fontWeight:300, color:'#8B9CB8', lineHeight:1.6, marginBottom:10 },
  toolBtnRow: { display:'flex', gap:7 },
  toolBtnPrimary: { flex:2, padding:'9px 0', border:'none', borderRadius:10, color:'white', fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, cursor:'pointer' },
  toolBtnSec: { flex:1, padding:'9px 0', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.45)', fontFamily:"'DM Sans',sans-serif", fontSize:11, cursor:'pointer' },
  // Inline mini breather
  miniWrap: { display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'10px 0 6px' },
  miniPhase: { fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.72)', letterSpacing:'0.02em' },
  miniTimer: { fontFamily:"'DM Mono',monospace", fontSize:13, color:'rgba(255,255,255,0.35)', letterSpacing:'0.06em' },
  miniBtn: { marginTop:4, padding:'8px 22px', borderRadius:10, border:'none', color:'white', fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, cursor:'pointer', transition:'background 0.2s' },
  miniDone: { display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'14px 0 6px' },
  miniDoneCheck: { fontSize:24, color:'#34D399' },
  miniDoneText: { fontSize:11, color:'#6EE7B7', fontFamily:"'DM Sans',sans-serif" },
  // Quick prompts
  quickRow: { display:'flex', gap:6, padding:'0 14px 10px', overflowX:'auto', flexShrink:0 },
  quickChip: { flexShrink:0, padding:'6px 12px', borderRadius:999, border:'1px solid rgba(124,58,237,0.2)', background:'rgba(124,58,237,0.06)', color:'#C4B5FD', fontSize:11, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' },
  // Composer
  composer: { display:'flex', gap:8, padding:'9px 14px', background:'#111827', borderTop:'1px solid rgba(255,255,255,0.06)', alignItems:'center', flexShrink:0 },
  input: { flex:1, background:'#1C2333', border:'1px solid rgba(255,255,255,0.07)', borderRadius:22, padding:'9px 14px', fontSize:13, color:'#F0F4FF', outline:'none', fontFamily:"'DM Sans',sans-serif" },
  sendBtn: { width:38, height:38, borderRadius:'50%', background:'#7C3AED', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
};

Object.assign(window, { ManasChat });
