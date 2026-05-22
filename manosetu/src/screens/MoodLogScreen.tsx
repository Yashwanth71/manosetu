import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  PanResponder, GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

const moods = [
  { emoji: '😔', label: 'Low', val: 1 },
  { emoji: '😟', label: 'Uneasy', val: 2 },
  { emoji: '😐', label: 'Okay', val: 3 },
  { emoji: '🙂', label: 'Good', val: 4 },
  { emoji: '😊', label: 'Great', val: 5 },
];

const tags = ['Anxious', 'तनाव', 'Distracted', 'Lonely', 'थकान', 'Overwhelmed', 'Hopeful', 'शांत'];

const factors = [
  { label: 'Work stress', key: 'work', opts: ['Low', 'Medium', 'High'], color: Colors.stateError },
  { label: 'Sleep quality', key: 'sleep', opts: ['4 hrs', '6 hrs', '8 hrs'], color: Colors.stateWarning },
  { label: 'Social connection', key: 'social', opts: ['Low', 'Okay', 'Good'], color: Colors.stateSuccess },
  { label: 'Physical activity', key: 'physical', opts: ['Low', 'Some', 'Active'], color: Colors.stateInfo },
];

function SliderInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(0);

  const handleTouch = (e: GestureResponderEvent) => {
    if (trackWidth.current > 0) {
      const x = e.nativeEvent.locationX;
      const v = Math.max(0, Math.min(1, x / trackWidth.current));
      onChange(v);
    }
  };

  return (
    <View
      ref={trackRef}
      onLayout={e => { trackWidth.current = e.nativeEvent.layout.width; }}
      style={s.sliderTrack}
      onStartShouldSetResponder={() => true}
      onResponderMove={handleTouch}
      onResponderGrant={handleTouch}
    >
      <View style={[s.sliderFill, { width: `${value * 100}%` as any }]} />
      <View style={[s.sliderThumb, { position: 'absolute', left: `${value * 100}%` as any, marginLeft: -10, top: -7.5 }]} />
    </View>
  );
}

export function MoodLogScreen({ onNavigate }: Props) {
  const [layer, setLayer] = useState(1);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sliderVal, setSliderVal] = useState(0.4);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [factorVals, setFactorVals] = useState<Record<string, string>>({
    work: 'Medium', sleep: '6 hrs', social: 'Okay', physical: 'Low',
  });
  const [done, setDone] = useState(false);

  const toggleTag = (t: string) =>
    setActiveTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  if (done) {
    return (
      <View style={s.doneContainer}>
        <View style={s.doneMark}>
          <Text style={s.doneMarkText}>✓</Text>
        </View>
        <Text style={s.doneTitle}>Logged</Text>
        <Text style={s.doneSub}>Manas is processing your check-in and will follow up shortly.</Text>
        <TouchableOpacity style={s.doneBtn} onPress={() => onNavigate('manas')} activeOpacity={0.9}>
          <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.doneBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={s.doneBtnText}>Continue with Manas</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={s.doneBtnGhost} onPress={() => onNavigate('home')} activeOpacity={0.8}>
          <Text style={s.doneBtnGhostText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => layer > 1 ? setLayer(l => l - 1) : onNavigate('home')}
        >
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>How are you?</Text>
        <View style={s.pips}>
          {[1, 2, 3].map(i => (
            <View key={i} style={[s.pip, i <= layer && s.pipActive]} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.layerContent} showsVerticalScrollIndicator={false}>
        {/* Layer 1 */}
        {layer === 1 && (
          <>
            <Text style={s.layerTitle}>Right now, I feel…</Text>
            <View style={s.moodRow}>
              {moods.map(m => (
                <TouchableOpacity
                  key={m.val}
                  style={[s.moodBtn, selectedMood === m.val && s.moodBtnActive]}
                  onPress={() => setSelectedMood(m.val)}
                  activeOpacity={0.85}
                >
                  <Text style={s.moodEmoji}>{m.emoji}</Text>
                  <Text style={s.moodLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedMood !== null && (
              <TouchableOpacity style={s.nextBtn} onPress={() => setLayer(2)} activeOpacity={0.9}>
                <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.nextBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={s.nextBtnText}>Continue →</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Layer 2 */}
        {layer === 2 && (
          <>
            <Text style={s.layerTitle}>What's shaping this feeling?</Text>
            <View style={s.sliderWrap}>
              <View style={s.sliderLabels}>
                <Text style={s.sliderLabel}>Mild</Text>
                <Text style={s.sliderLabel}>Intense</Text>
              </View>
              <SliderInput value={sliderVal} onChange={setSliderVal} />
            </View>
            <View style={s.tagsWrap}>
              {tags.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.tag, activeTags.includes(t) && s.tagActive]}
                  onPress={() => toggleTag(t)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.tagText, activeTags.includes(t) && s.tagTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.nextBtn} onPress={() => setLayer(3)} activeOpacity={0.9}>
              <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.nextBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={s.nextBtnText}>Continue →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Layer 3 */}
        {layer === 3 && (
          <>
            <Text style={s.layerTitle}>What's been affecting you?</Text>
            <View style={s.factorGrid}>
              {factors.map(f => (
                <View key={f.key} style={s.factorCard}>
                  <View style={[s.factorDot, { backgroundColor: f.color }]} />
                  <Text style={s.factorLabel}>{f.label}</Text>
                  <View style={s.factorOpts}>
                    {f.opts.map(o => (
                      <TouchableOpacity
                        key={o}
                        style={[s.factorOpt, factorVals[f.key] === o && s.factorOptActive]}
                        onPress={() => setFactorVals(fv => ({ ...fv, [f.key]: o }))}
                        activeOpacity={0.8}
                      >
                        <Text style={[s.factorOptText, factorVals[f.key] === o && s.factorOptTextActive]}>{o}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity style={s.nextBtn} onPress={() => setDone(true)} activeOpacity={0.9}>
              <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.nextBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={s.nextBtnText}>Save Check-In</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 8,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: Colors.textSecondary },
  title: { fontFamily: 'Syne_700Bold', fontSize: 16, color: Colors.textPrimary, flex: 1, textAlign: 'center' },
  pips: { flexDirection: 'row', gap: 4, width: 32, justifyContent: 'flex-end' },
  pip: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)' },
  pipActive: { backgroundColor: Colors.accentViolet, width: 14 },

  layerContent: { padding: 20, paddingTop: 16, gap: 16, paddingBottom: 32 },
  layerTitle: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },

  moodRow: { flexDirection: 'row', gap: 6 },
  moodBtn: {
    flex: 1, alignItems: 'center', gap: 5, paddingVertical: 12,
    borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: Colors.bgCard,
  },
  moodBtnActive: { borderColor: Colors.accentViolet, backgroundColor: Colors.accentVioletTint },
  moodEmoji: { fontSize: 24, lineHeight: 28 },
  moodLabel: { fontSize: 9, color: Colors.textSecondary, fontWeight: '500' },

  sliderWrap: { gap: 8 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { fontSize: 11, color: Colors.textMuted },
  sliderTrack: {
    height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)',
    position: 'relative', overflow: 'visible',
  },
  sliderFill: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: Colors.accentViolet, borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute', top: -7.5, width: 20, height: 20,
    borderRadius: 10, backgroundColor: Colors.textPrimary,
    borderWidth: 2, borderColor: Colors.accentViolet,
  },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
    backgroundColor: 'rgba(124,58,237,0.07)',
  },
  tagActive: { backgroundColor: 'rgba(124,58,237,0.2)', borderColor: Colors.accentViolet },
  tagText: { fontSize: 12, color: Colors.textSecondary },
  tagTextActive: { color: Colors.textManas },

  nextBtn: { marginTop: 'auto' },
  nextBtnGrad: { borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  nextBtnText: { color: 'white', fontFamily: 'Syne_700Bold', fontSize: 14 },

  factorGrid: { gap: 8 },
  factorCard: {
    backgroundColor: Colors.bgCard, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: Colors.borderDefault,
  },
  factorDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 5 },
  factorLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 7 },
  factorOpts: { flexDirection: 'row', gap: 6 },
  factorOpt: {
    flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: Colors.bgElevated,
  },
  factorOptActive: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderColor: 'rgba(124,58,237,0.4)',
  },
  factorOptText: { fontSize: 11, color: Colors.textSecondary },
  factorOptTextActive: { color: Colors.textManas },

  // Done
  doneContainer: {
    flex: 1, backgroundColor: Colors.bgApp,
    alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12,
  },
  doneMark: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(52,211,153,0.15)',
    borderWidth: 2, borderColor: Colors.stateSuccess,
    alignItems: 'center', justifyContent: 'center',
  },
  doneMarkText: { fontSize: 28, color: Colors.stateSuccess },
  doneTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 22, color: Colors.textPrimary },
  doneSub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21, marginBottom: 8 },
  doneBtn: { width: '100%' },
  doneBtnGrad: { borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  doneBtnText: { color: 'white', fontFamily: 'Syne_700Bold', fontSize: 14 },
  doneBtnGhost: {
    width: '100%', paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, alignItems: 'center',
  },
  doneBtnGhostText: { color: Colors.textSecondary, fontFamily: 'Syne_700Bold', fontSize: 14 },
});
