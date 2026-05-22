import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Line,
  Ellipse,
  G,
} from 'react-native-svg';
import { Technique } from '../constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RING_R = 106;
const OUTER_R = 126;
const MAX_ORB_R = 86 * 0.96;
const MIN_ORB_R = 86 * 0.62;

interface IndicatorPos { x: number; y: number; angle: number }
interface RingState {
  sessionFraction: number;
  indicatorPos: IndicatorPos;
}

interface BreathingRingProps {
  tech: Technique;
  duration: number; // seconds
  running: boolean;
  onPhaseChange: (label: string, key: number) => void;
  onTick: (remaining: number) => void;
  onBreath: (count: number) => void;
  onComplete: () => void;
}

export function BreathingRing({
  tech, duration, running,
  onPhaseChange, onTick, onBreath, onComplete,
}: BreathingRingProps) {
  const orbRadius = useRef(new Animated.Value(MIN_ORB_R)).current;
  const currentAnim = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const st = useRef({ pi: 0, pt: 0, el: 0, bc: 0, lastTick: Date.now(), phaseKey: 0 });

  const [ring, setRing] = useState<RingState>({
    sessionFraction: 0,
    indicatorPos: { x: CX, y: CY - RING_R, angle: -Math.PI / 2 },
  });

  const computeIndicatorPos = useCallback((pi: number, pp: number, phases: number[]) => {
    const cyc = phases.reduce((a, b) => a + b, 0) || 1;
    let ec = 0;
    for (let i = 0; i < pi; i++) ec += phases[i] || 0;
    ec += pp * (phases[pi] || 0.5);
    const ang = (ec / cyc) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + RING_R * Math.cos(ang), y: CY + RING_R * Math.sin(ang), angle: ang };
  }, []);

  const startOrbAnim = useCallback((pi: number, phaseDur: number) => {
    if (currentAnim.current) {
      currentAnim.current.stop();
      currentAnim.current = null;
    }
    if (pi === 0) {
      orbRadius.setValue(MIN_ORB_R);
      currentAnim.current = Animated.timing(orbRadius, {
        toValue: MAX_ORB_R,
        duration: phaseDur * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      });
      currentAnim.current.start();
    } else if (pi === 2) {
      orbRadius.setValue(MAX_ORB_R);
      currentAnim.current = Animated.timing(orbRadius, {
        toValue: MIN_ORB_R,
        duration: phaseDur * 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      });
      currentAnim.current.start();
    } else if (pi === 1) {
      orbRadius.setValue(MAX_ORB_R);
    } else {
      orbRadius.setValue(MIN_ORB_R);
    }
  }, [orbRadius]);

  useEffect(() => {
    // Reset when tech/duration changes
    const s = st.current;
    s.pi = 0; s.pt = 0; s.el = 0; s.bc = 0; s.phaseKey = 0; s.lastTick = Date.now();
    orbRadius.setValue(MIN_ORB_R);
    if (currentAnim.current) { currentAnim.current.stop(); currentAnim.current = null; }
  }, [tech, duration]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (currentAnim.current) { currentAnim.current.stop(); currentAnim.current = null; }
      return;
    }

    const s = st.current;
    s.lastTick = Date.now();

    // Start first phase animation
    const phases = tech.phases;
    let pd = phases[s.pi] || 0.5;
    if (pd === 0) pd = 0.3;
    startOrbAnim(s.pi, pd - s.pt);
    onPhaseChange(tech.labels[s.pi] || 'breathe', s.phaseKey);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const dt = Math.min((now - s.lastTick) / 1000, 0.15);
      s.lastTick = now;

      s.el += dt;
      s.pt += dt;

      let pDur = phases[s.pi] || 0.5;
      if (pDur === 0) pDur = 0.3;

      if (s.pt >= pDur) {
        s.pt -= pDur;
        const prev = s.pi;
        s.pi = (s.pi + 1) % 4;
        if (s.pi === 0 && prev === 3) {
          s.bc++;
          onBreath(s.bc);
        }
        s.phaseKey++;
        onPhaseChange(tech.labels[s.pi] || 'hold', s.phaseKey);
        const nextPDur = phases[s.pi] || 0.5;
        const effectiveDur = nextPDur === 0 ? 0.3 : nextPDur;
        startOrbAnim(s.pi, effectiveDur);
      }

      const rem = Math.max(0, duration - s.el);
      onTick(Math.ceil(rem));

      const pp = s.pt / (phases[s.pi] === 0 ? 0.3 : (phases[s.pi] || 0.5));
      const indicatorPos = computeIndicatorPos(s.pi, Math.min(1, pp), phases);

      setRing({
        sessionFraction: Math.min(1, s.el / duration),
        indicatorPos,
      });

      if (rem <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        onComplete();
      }
    }, 50); // 20fps for state updates; orb runs independently via Animated

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [running, tech, duration]);

  // Compute outer session arc
  const arcCircumference = 2 * Math.PI * OUTER_R;
  const arcOffset = arcCircumference * (1 - ring.sessionFraction);

  // Phase ticks
  const ticks = tech.phases.map((ph, i) => {
    const cyc = tech.phases.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    for (let j = 0; j < i; j++) acc += tech.phases[j] || 0;
    if (ph === 0) return null;
    const a = (acc / cyc) * Math.PI * 2 - Math.PI / 2;
    const x1 = CX + (RING_R - 6) * Math.cos(a);
    const y1 = CY + (RING_R - 6) * Math.sin(a);
    const x2 = CX + (RING_R + 6) * Math.cos(a);
    const y2 = CY + (RING_R + 6) * Math.sin(a);
    return { x1, y1, x2, y2, key: i };
  }).filter(Boolean);

  const { indicatorPos } = ring;
  const { x: ix, y: iy, angle: ia } = indicatorPos;

  // Indicator teardrop rotation (tangential)
  const indicatorRotDeg = (ia * 180 / Math.PI) + 90;

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <RadialGradient id="sphereGrad" cx="35%" cy="34%" r="70%">
            <Stop offset="0%" stopColor="#BAE6FD" />
            <Stop offset="25%" stopColor="#7DD3FA" />
            <Stop offset="58%" stopColor={tech.color} />
            <Stop offset="100%" stopColor={tech.glow} />
          </RadialGradient>
          <RadialGradient id="specGrad" cx="26%" cy="28%" r="52%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
          <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={tech.color + '1E'} />
            <Stop offset="100%" stopColor="transparent" />
          </RadialGradient>
          <RadialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
        </Defs>

        {/* Ambient glow halo */}
        <Circle cx={CX} cy={CY} r={RING_R * 1.5} fill="url(#glowGrad)" />

        {/* Outer session arc track */}
        <Circle
          cx={CX} cy={CY} r={OUTER_R}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={2}
          fill="none"
        />
        {/* Session arc progress */}
        {ring.sessionFraction > 0 && (
          <Circle
            cx={CX} cy={CY} r={OUTER_R}
            stroke={tech.color + '55'}
            strokeWidth={2.5}
            fill="none"
            strokeDasharray={arcCircumference}
            strokeDashoffset={arcOffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${CX}, ${CY}`}
          />
        )}

        {/* Ring track */}
        <Circle cx={CX} cy={CY} r={RING_R} stroke="rgba(255,255,255,0.09)" strokeWidth={1.5} fill="none" />

        {/* Phase ticks */}
        {ticks.map(t => t && (
          <Line
            key={t.key}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}

        {/* Animated orb — gradient sphere */}
        <AnimatedCircle cx={CX} cy={CY} r={orbRadius} fill="url(#sphereGrad)" />

        {/* Specular highlight */}
        <AnimatedCircle cx={CX} cy={CY} r={orbRadius} fill="url(#specGrad)" />

        {/* Indicator glow */}
        <Circle cx={ix} cy={iy} r={15} fill="url(#dotGlow)" />

        {/* Indicator teardrop */}
        <G
          transform={`translate(${ix}, ${iy}) rotate(${indicatorRotDeg})`}
        >
          <Ellipse cx={0} cy={0} rx={5} ry={8.5} fill="rgba(255,255,255,0.92)" />
        </G>
      </Svg>
    </View>
  );
}
