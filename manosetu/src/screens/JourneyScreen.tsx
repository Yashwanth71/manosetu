import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

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

const totalXP = 350;
const nextLevelXP = 540;

export function JourneyScreen({ onNavigate }: Props) {
  const [activeChapter, setActiveChapter] = useState(2);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Setupath</Text>
          <Text style={s.headerSub}>Your journey · सेतुपथ</Text>
        </View>
        <LinearGradient
          colors={['rgba(59,130,246,0.15)', 'rgba(124,58,237,0.2)']}
          style={s.xpBadge}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Text style={s.xpNum}>{totalXP}</Text>
          <Text style={s.xpLabel}>XP</Text>
        </LinearGradient>
      </View>

      {/* XP card */}
      <View style={s.xpCard}>
        <View style={s.xpCardRow}>
          <View>
            <Text style={s.xpCardTitle}>Level 2 · Explorer</Text>
            <Text style={s.xpCardSub}>{nextLevelXP - totalXP} XP to Level 3 · Seeker</Text>
          </View>
          <View style={s.streakPill}>
            <Text style={{ fontSize: 13 }}>🔥</Text>
            <Text style={s.streakNum}>7</Text>
          </View>
        </View>
        <View style={s.xpTrack}>
          <LinearGradient
            colors={['#3B82F6', '#7C3AED']}
            style={[s.xpFill, { width: `${(totalXP / nextLevelXP) * 100}%` }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          />
        </View>
        <View style={s.xpMeta}>
          <Text style={s.xpMetaLeft}>{totalXP} XP</Text>
          <Text style={s.xpMetaRight}>{nextLevelXP} XP</Text>
        </View>
      </View>

      <Text style={s.sectionLabel}>JOURNEY CHAPTERS</Text>

      {/* Chapters */}
      <View style={s.chapterList}>
        {chapters.map((ch, idx) => (
          <TouchableOpacity
            key={ch.id}
            style={[s.chapterCard, { opacity: ch.unlocked ? 1 : 0.45 }]}
            onPress={() => ch.unlocked && setActiveChapter(ch.id)}
            activeOpacity={ch.unlocked ? 0.85 : 1}
          >
            {/* Connector line */}
            {idx < chapters.length - 1 && (
              <View style={[s.connector, {
                backgroundColor: ch.completed
                  ? '#7C3AED'
                  : 'rgba(255,255,255,0.06)',
              }]} />
            )}

            {/* Node */}
            <View style={[s.chapterNode, {
              backgroundColor: ch.completed
                ? ch.color
                : ch.unlocked
                  ? ch.color + '26'
                  : Colors.bgCard,
              borderColor: ch.unlocked ? ch.color : 'rgba(255,255,255,0.06)',
            }]}>
              {ch.completed
                ? <Text style={{ fontSize: 14, color: 'white' }}>✓</Text>
                : ch.unlocked
                  ? <Text style={{ fontFamily: 'DMM', fontSize: 11, color: ch.color }}>{ch.id}</Text>
                  : <Text style={{ fontSize: 13, color: Colors.textMuted }}>🔒</Text>
              }
            </View>

            {/* Info */}
            <View style={s.chapterInfo}>
              <View style={s.chapterTitleRow}>
                <Text style={[s.chapterTitle, { color: ch.unlocked ? Colors.textPrimary : Colors.textMuted }]}>
                  {ch.title}
                </Text>
                {ch.completed && (
                  <View style={s.completedBadge}>
                    <Text style={s.completedBadgeText}>Complete</Text>
                  </View>
                )}
                {ch.unlocked && !ch.completed && (
                  <View style={s.activeBadge}>
                    <Text style={s.activeBadgeText}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={s.chapterSub}>{ch.subtitle}</Text>
              <Text style={s.chapterTheme}>{ch.theme}</Text>

              {ch.unlocked && !ch.completed && (
                <View style={{ marginTop: 8 }}>
                  <View style={s.sessTrack}>
                    <View style={[s.sessFill, {
                      width: `${(ch.completedSessions / ch.sessions) * 100}%`,
                      backgroundColor: ch.color,
                    }]} />
                  </View>
                  <View style={s.sessMeta}>
                    <Text style={s.sessMetaLeft}>{ch.completedSessions}/{ch.sessions} sessions</Text>
                    <Text style={[s.sessMetaRight, { color: ch.color }]}>{ch.xpEarned}/{ch.xp} XP</Text>
                  </View>
                </View>
              )}
              {ch.completed && (
                <Text style={s.earnedXP}>+{ch.xp} XP earned</Text>
              )}
              {!ch.unlocked && (
                <Text style={s.lockedHint}>Complete previous chapter to unlock</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={s.continueBtn} onPress={() => onNavigate('breathe')} activeOpacity={0.9}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.continueBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={s.continueBtnText}>Continue Chapter 2 →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  content: { paddingBottom: 32 },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  headerTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Colors.textPrimary },
  headerSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  xpBadge: {
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)',
  },
  xpNum: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Colors.accentViolet },
  xpLabel: { fontFamily: 'DMM', fontSize: 9, color: Colors.textMuted, letterSpacing: 1.5 },

  xpCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.borderDefault,
  },
  xpCardRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
  },
  xpCardTitle: { fontFamily: 'Syne_700Bold', fontSize: 13, color: Colors.textPrimary },
  xpCardSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4,
  },
  streakNum: { fontFamily: 'Syne_700Bold', fontSize: 13, color: '#FCD34D' },
  xpTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3 },
  xpMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  xpMetaLeft: { fontFamily: 'DMM', fontSize: 10, color: Colors.accentViolet },
  xpMetaRight: { fontFamily: 'DMM', fontSize: 10, color: Colors.textMuted },

  sectionLabel: {
    fontFamily: 'DMM', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
    color: Colors.textMuted, paddingHorizontal: 20, paddingBottom: 10,
  },
  chapterList: { paddingHorizontal: 20 },
  chapterCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10, position: 'relative',
  },
  connector: {
    position: 'absolute', left: 19, top: 48, width: 2, bottom: -10, zIndex: 0, borderRadius: 1,
  },
  chapterNode: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, zIndex: 1,
  },
  chapterInfo: { flex: 1, paddingTop: 2 },
  chapterTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  chapterTitle: { fontFamily: 'Syne_700Bold', fontSize: 14 },
  completedBadge: {
    paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999,
    backgroundColor: 'rgba(52,211,153,0.12)',
    borderWidth: 1, borderColor: 'rgba(52,211,153,0.2)',
  },
  completedBadgeText: { fontSize: 9, fontWeight: '500', color: Colors.stateSuccess },
  activeBadge: {
    paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999,
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
  },
  activeBadgeText: { fontSize: 9, fontWeight: '500', color: Colors.textManas },
  chapterSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  chapterTheme: {
    fontFamily: 'DMM', fontSize: 9, color: Colors.textMuted, marginTop: 3, letterSpacing: 0.7,
  },
  sessTrack: { height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  sessFill: { height: '100%', borderRadius: 2 },
  sessMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  sessMetaLeft: { fontFamily: 'DMM', fontSize: 9, color: Colors.textMuted },
  sessMetaRight: { fontFamily: 'DMM', fontSize: 9 },
  earnedXP: { fontFamily: 'DMM', fontSize: 9, color: Colors.stateSuccess, marginTop: 4 },
  lockedHint: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  continueBtn: { marginHorizontal: 20, marginTop: 16 },
  continueBtnGrad: { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  continueBtnText: { color: 'white', fontFamily: 'Syne_700Bold', fontSize: 15 },
});
