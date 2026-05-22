import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Line,
  Ellipse,
  G,
} from 'react-native-svg';
import { Colors, Technique } from '../constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const S = 140;
const CX = 70, CY = 70;
const RING_R = 50;
const OUTER_R = 62;
const MAX_ORB_R = 40 * 0.96;
const MIN_ORB_R = 40 * 0.62;
const TOTAL = 180; // 3 min

interface IndicatorPos { x: number; y: number; angle: number }

interface Props {
  tech: Technique;
  onDone: () => void;
}

export function InlineBreather({ tech, onDone }: Props) {
  const [running, setRunning] = useState(false);
  const [phaseLabel, setPhaseLabel] = useState(tech.labels[0] || 'Breathe in');
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [done, setDone] = useState(false);
  const [indicatorPos, setIndicatorPos] = useState<IndicatorPos>({ x: CX, y: CY - RING_R, angle: -Math.PI / 2 });
  const [sessionFrac, setSessionFrac] = useState(0);

  const orbRadius = useRef(new Animated.Value(MIN_ORB_R)).current;
  const currentAnim = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const st = useRef({ pi: 0, pt: 0, el: 0, lastTick: Date.now() });

  const startOrbAnim = (pi: number, dur: number) => {
    if (currentAnim.current) { currentAnim.current.stop(); currentAnim.current = null; }
    if (pi === 0) {
      orbRadius.setValue(MIN_ORB_R);
      currentAnim.current = Animated.timing(orbRadius, {
        toValue: MAX_ORB_R, duration: dur * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: false,
      });
      currentAnim.current.start();
    } else if (pi === 2) {
      orbRadius.setValue(MAX_ORB_R);
      currentAnim.current = Animated.timing(orbRadius, {
        toValue: MIN_ORB_R, duration: dur * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: false,
      });
      currentAnim.current.start();
    } else if (pi === 1) {
      orbRadius.setValue(MAX_ORB_R);
    } else {
      orbRadius.setValue(MIN_ORB_R);
    }
  };

  const computeIndicator = (pi: number, pp: number) => {
    const phases = tech.phases;
    const cyc = phases.reduce((a, b) => a + b, 0) || 1;
    let ec = 0;
    for (let i = 0; i < pi; i++) ec += phases[i] || 0;
    ec += pp * (phases[pi] || 0.5);
    const ang = (ec / cyc) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + RING_R * Math.cos(ang), y: CY + RING_R * Math.sin(ang), angle: ang };
  };

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (currentAnim.current) { currentAnim.current.stop(); currentAnim.current = null; }
      return;
    }
    const s = st.current;
    s.lastTick = Date.now();
    const phases = tech.phases;
    let pd = phases[s.pi] || 0.5; if (pd === 0) pd = 0.3;
    startOrbAnim(s.pi, pd - s.pt);
    setPhaseLabel(tech.labels[s.pi] || 'breathe');

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const dt = Math.min((now - s.lastTick) / 1000, 0.15);
      s.lastTick = now;
      s.el += dt; s.pt += dt;

      let pDur = phases[s.pi] || 0.5; if (pDur === 0) pDur = 0.3;
      if (s.pt >= pDur) {
        s.pt -= pDur;
        s.pi = (s.pi + 1) % 4;
        setPhaseLabel(tech.labels[s.pi] || 'hold');
        const nextPD = phases[s.pi] === 0 ? 0.3 : (phases[s.pi] || 0.5);
        startOrbAnim(s.pi, nextPD);
      }

      const rem = Math.max(0, TOTAL - s.el);
      setTimeLeft(Math.ceil(rem));

      const pp = s.pt / (phases[s.pi] === 0 ? 0.3 : (phases[s.pi] || 0.5));
      setIndicatorPos(computeIndicator(s.pi, Math.min(1, pp)));
      setSessionFrac(Math.min(1, s.el / TOTAL));

      if (rem <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setRunning(false);
        setDone(true);
        onDone();
      }
    }, 50);

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [running]);

  const handleBtn = () => {
    if (done) return;
    if (!running) {
      if (timeLeft === TOTAL) {
        // first start
        const s = st.current;
        s.pi = 0; s.pt = 0; s.el = 0; s.lastTick = Date.now();
      }
      setRunning(true);
    } else {
      setRunning(false);
    }
  };

  const tStr = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
  const arcCirc = 2 * Math.PI * OUTER_R;
  const arcOff = arcCirc * (1 - sessionFrac);
  const { x: ix, y: iy, angle: ia } = indicatorPos;
  const indicatorRotDeg = (ia * 180 / Math.PI) + 90;

  if (done) {
    return (
      <View style={styles.doneWrap}>
        <Text style={styles.doneCheck}>✓</Text>
        <Text style={styles.doneText}>3 minutes complete</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
        <Defs>
          <RadialGradient id="ibSphereGrad" cx="35%" cy="34%" r="70%">
            <Stop offset="0%" stopColor="#BAE6FD" />
            <Stop offset="25%" stopColor="#7DD3FA" />
            <Stop offset="58%" stopColor={tech.color} />
            <Stop offset="100%" stopColor={tech.glow} />
          </RadialGradient>
          <RadialGradient id="ibSpecGrad" cx="26%" cy="28%" r="52%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
          <RadialGradient id="ibDotGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
        </Defs>

        {/* Outer arc track */}
        <Circle cx={CX} cy={CY} r={OUTER_R} stroke="rgba(255,255,255,0.06)" strokeWidth={2} fill="none" />
        {sessionFrac > 0 && (
          <Circle
            cx={CX} cy={CY} r={OUTER_R}
            stroke={tech.color + '77'} strokeWidth={2.5} fill="none"
            strokeDasharray={arcCirc} strokeDashoffset={arcOff}
            strokeLinecap="round" rotation={-90} origin={`${CX}, ${CY}`}
          />
        )}

        {/* Ring track */}
        <Circle cx={CX} cy={CY} r={RING_R} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} fill="none" />

        {/* Phase ticks */}
        {tech.phases.map((ph, i) => {
          if (ph === 0) return null;
          const cyc = tech.phases.reduce((a, b) => a + b, 0) || 1;
          let acc = 0;
          for (let j = 0; j < i; j++) acc += tech.phases[j] || 0;
          const a = (acc / cyc) * Math.PI * 2 - Math.PI / 2;
          return (
            <Line key={i}
              x1={CX + (RING_R - 4) * Math.cos(a)} y1={CY + (RING_R - 4) * Math.sin(a)}
              x2={CX + (RING_R + 4) * Math.cos(a)} y2={CY + (RING_R + 4) * Math.sin(a)}
              stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} strokeLinecap="round"
            />
          );
        })}

        {/* Orb */}
        <AnimatedCircle cx={CX} cy={CY} r={orbRadius} fill="url(#ibSphereGrad)" />
        <AnimatedCircle cx={CX} cy={CY} r={orbRadius} fill="url(#ibSpecGrad)" />

        {/* Indicator */}
        <Circle cx={ix} cy={iy} r={10} fill="url(#ibDotGlow)" />
        <G transform={`translate(${ix}, ${iy}) rotate(${indicatorRotDeg})`}>
          <Ellipse cx={0} cy={0} rx={3.5} ry={6} fill="rgba(255,255,255,0.92)" />
        </G>
      </Svg>

      <Text style={styles.phaseLabel}>{running || timeLeft < TOTAL ? phaseLabel : 'Ready'}</Text>
      <Text style={styles.timer}>{tStr}</Text>
      <TouchableOpacity
        onPress={handleBtn}
        style={[styles.btn, { backgroundColor: running ? 'rgba(255,255,255,0.08)' : tech.color }]}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>
          {running ? 'Pause' : timeLeft === TOTAL ? 'Begin' : 'Resume'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 5,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  timer: {
    fontFamily: 'DMM',
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
  },
  btn: {
    marginTop: 6,
    paddingHorizontal: 24,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  doneWrap: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  doneCheck: { fontSize: 24, color: Colors.stateSuccess },
  doneText: { fontSize: 11, color: '#6EE7B7' },
});
