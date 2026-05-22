import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BreathingRing } from '../components/BreathingRing';
import { Colors, TECHNIQUES } from '../constants';

type Stage = 'select' | 'session' | 'done';

interface Props {
  onNavigate: (screen: string) => void;
}

export function BreathingScreen({ onNavigate }: Props) {
  const [stage, setStage] = useState<Stage>('select');
  const [tech, setTech] = useState(TECHNIQUES[0]);
  const [duration, setDuration] = useState(7);
  const [search, setSearch] = useState('');

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phaseLabel, setPhaseLabel] = useState('Breathe in');
  const [phaseKey, setPhaseKey] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(420);
  const [breathCount, setBreathCount] = useState(0);

  const filtered = TECHNIQUES.filter(t =>
    search === '' ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  const startSession = (t: typeof TECHNIQUES[0]) => {
    setTech(t);
    setDuration(duration);
    setPhaseLabel(t.labels[0]);
    setPhaseKey(0);
    setTimeRemaining(duration * 60);
    setBreathCount(0);
    setPaused(false);
    setRunning(false);
    setStage('session');
    // start after mount
    setTimeout(() => setRunning(true), 100);
  };

  const togglePause = () => {
    if (paused) {
      setPaused(false);
      setRunning(true);
    } else {
      setPaused(true);
      setRunning(false);
    }
  };

  const stopSession = () => {
    setRunning(false);
    setStage('select');
  };

  const timeStr = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`;

  // ── SELECT SCREEN ──
  if (stage === 'select') {
    return (
      <View style={s.sel}>
        <View style={s.selHeader}>
          <TouchableOpacity style={s.backBtn} onPress={() => onNavigate('home')}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.selTitle}>Breathe</Text>
          <View style={{ width: 32 }} />
        </View>

        <Text style={s.durationHint}>CHOOSE SESSION LENGTH</Text>
        <View style={s.durRow}>
          {[7, 11].map(d => (
            <TouchableOpacity
              key={d}
              style={[s.durBtn, duration === d && s.durBtnActive]}
              onPress={() => setDuration(d)}
              activeOpacity={0.85}
            >
              <Text style={[s.durNum, duration === d && s.durNumActive]}>{d}</Text>
              <Text style={[s.durUnit, duration === d && { color: '#93C5FD' }]}>min</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.searchWrap}>
          <Text style={{ fontSize: 13, color: Colors.textMuted }}>🔍</Text>
          <TextInput
            style={s.searchIn}
            placeholder="Search by name or effect…"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {filtered.map(t => (
            <TouchableOpacity
              key={t.id}
              style={s.techCard}
              onPress={() => startSession(t)}
              activeOpacity={0.85}
            >
              <View style={[s.techDot, { backgroundColor: t.color, shadowColor: t.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.techName}>{t.name}</Text>
                <Text style={s.techDesc}>{t.phases.filter(p => p > 0).join('-')} · {t.desc}</Text>
              </View>
              <Text style={s.techArr}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ── SESSION SCREEN ──
  if (stage === 'session') {
    return (
      <View style={[s.sess, { backgroundColor: Colors.bgApp }]}>
        <LinearGradient
          colors={[tech.glow + '2A', Colors.bgApp]}
          style={s.sessGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
        />

        <TouchableOpacity style={s.sessBack} onPress={stopSession}>
          <Text style={s.sessBackIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.sessTitle}>{tech.name}</Text>

        <View style={s.ringWrap}>
          <BreathingRing
            tech={tech}
            duration={duration * 60}
            running={running}
            onPhaseChange={(label, key) => { setPhaseLabel(label); setPhaseKey(key); }}
            onTick={setTimeRemaining}
            onBreath={setBreathCount}
            onComplete={() => { setRunning(false); setStage('done'); }}
          />
        </View>

        <Text style={[s.breathCountRow, { opacity: breathCount > 0 ? 1 : 0 }]}>
          {breathCount} breath{breathCount !== 1 ? 's' : ''}
        </Text>

        <Text key={phaseKey} style={s.phaseLabel}>{phaseLabel || 'hold'}</Text>

        <View style={s.ctrlRow}>
          <TouchableOpacity style={s.stopBtn} onPress={stopSession}>
            <View style={s.stopSquare} />
          </TouchableOpacity>
          <TouchableOpacity style={s.playBtn} onPress={togglePause} activeOpacity={0.85}>
            {paused
              ? <Text style={s.playIcon}>▶</Text>
              : <Text style={s.playIcon}>⏸</Text>
            }
          </TouchableOpacity>
          <View style={{ width: 39 }} />
        </View>

        <Text style={s.timer}>{timeStr}</Text>
      </View>
    );
  }

  // ── DONE SCREEN ──
  return (
    <View style={[s.sess, { justifyContent: 'center', paddingHorizontal: 32 }]}>
      <Text style={{ fontSize: 40, color: Colors.stateSuccess, textAlign: 'center', marginBottom: 4 }}>✓</Text>
      <Text style={s.doneTitle}>Session Complete</Text>
      <Text style={s.doneSub}>
        {breathCount} breath{breathCount !== 1 ? 's' : ''} · {duration} min of {tech.name}.{'\n'}
        Manas will log this in your wellness timeline.
      </Text>
      <TouchableOpacity
        style={s.doneBtn}
        onPress={() => { setStage('select'); setRunning(false); onNavigate('home'); }}
        activeOpacity={0.9}
      >
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.doneBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={s.doneBtnText}>Back to Home</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  // Select
  sel: { flex: 1, backgroundColor: Colors.bgApp },
  selHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: Colors.textSecondary },
  selTitle: { fontFamily: 'Syne_700Bold', fontSize: 16, color: Colors.textPrimary },
  durationHint: {
    fontFamily: 'DMM', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
    color: Colors.textMuted, paddingHorizontal: 20, paddingBottom: 8,
  },
  durRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 14 },
  durBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: Colors.bgCard,
    alignItems: 'center', gap: 2,
  },
  durBtnActive: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderColor: 'rgba(59,130,246,0.3)',
  },
  durNum: { fontFamily: 'Syne_700Bold', fontSize: 20, color: Colors.textSecondary, lineHeight: 24 },
  durNumActive: { color: '#93C5FD' },
  durUnit: { fontSize: 10, color: Colors.textMuted },
  searchWrap: {
    marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.bgCard,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1, borderColor: Colors.borderDefault,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  searchIn: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  list: { paddingHorizontal: 20, gap: 7, paddingBottom: 16 },
  techCard: {
    backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.borderDefault,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  techDot: {
    width: 10, height: 10, borderRadius: 5,
    shadowOpacity: 0.6, shadowRadius: 5, elevation: 3,
  },
  techName: { fontFamily: 'Syne_700Bold', fontSize: 13, color: Colors.textPrimary, marginBottom: 2 },
  techDesc: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },
  techArr: { fontSize: 20, color: Colors.textMuted },

  // Session
  sess: {
    flex: 1, backgroundColor: Colors.bgApp,
    alignItems: 'center', position: 'relative', paddingBottom: 16,
  },
  sessGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
  },
  sessBack: {
    position: 'absolute', top: 12, left: 14,
    padding: 4, zIndex: 10,
  },
  sessBackIcon: { fontSize: 20, color: 'rgba(255,255,255,0.32)' },
  sessTitle: {
    fontFamily: 'Syne_700Bold', fontSize: 13,
    color: 'rgba(255,255,255,0.38)', marginTop: 16,
    letterSpacing: 1.2, textTransform: 'uppercase',
  },
  ringWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  breathCountRow: {
    fontFamily: 'DMM', fontSize: 10, color: 'rgba(255,255,255,0.26)',
    letterSpacing: 1, marginBottom: 4, height: 14,
  },
  phaseLabel: {
    fontFamily: 'DMS', fontSize: 22, fontWeight: '300',
    color: 'rgba(255,255,255,0.82)', letterSpacing: 0.2, marginBottom: 22,
  },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', gap: 28, marginBottom: 12 },
  stopBtn: { padding: 8 },
  stopSquare: {
    width: 15, height: 15, borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  playBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { fontSize: 19, color: 'white' },
  timer: {
    fontFamily: 'DMM', fontSize: 14,
    color: 'rgba(255,255,255,0.28)', letterSpacing: 1.2,
  },

  // Done
  doneTitle: {
    fontFamily: 'Syne_800ExtraBold', fontSize: 22,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: 8,
  },
  doneSub: {
    fontSize: 13, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, maxWidth: 260, marginBottom: 24,
  },
  doneBtn: { width: '80%', marginTop: 12 },
  doneBtnGrad: { borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  doneBtnText: { color: 'white', fontFamily: 'Syne_700Bold', fontSize: 15 },
});
