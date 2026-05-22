import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: Props) {
  const [quickMood, setQuickMood] = useState<number | null>(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const moods = [
    { v: 1, emoji: '😞' }, { v: 2, emoji: '😟' }, { v: 3, emoji: '😐' },
    { v: 4, emoji: '🙂' }, { v: 5, emoji: '😊' },
  ];

  const breatheTechs = [
    { name: 'Box Breathing', sub: '3 min · Calm focus', color: '#3B82F6', glow: 'rgba(59,130,246,0.18)' },
    { name: 'Nadi Shodhana', sub: '7 min · Balance', color: '#7C3AED', glow: 'rgba(124,58,237,0.15)' },
    { name: 'Bhastrika', sub: '5 min · Energise', color: '#A855F7', glow: 'rgba(168,85,247,0.15)' },
  ];

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <View>
            <Text style={s.greeting}>{greeting}, Priya</Text>
            <Text style={s.date}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={s.bellBtn}>
          <BellIcon />
        </TouchableOpacity>
      </View>

      {/* Streak */}
      <LinearGradient
        colors={['rgba(59,130,246,0.09)', 'rgba(124,58,237,0.14)']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={s.streakCard}
      >
        <View style={s.streakLeft}>
          <Text style={s.streakNum}>7</Text>
          <View>
            <Text style={s.streakTitle}>Day Streak</Text>
            <Text style={s.streakSub}>Keep going — you're building something real.</Text>
          </View>
        </View>
        <View style={s.xpRight}>
          <Text style={s.xpVal}>+50 XP</Text>
          <Text style={s.xpSub}>today</Text>
        </View>
      </LinearGradient>

      {/* Mood check-in */}
      <Text style={s.sectionLabel}>How are you feeling?</Text>
      <View style={s.moodCard}>
        <View style={s.moodRow}>
          {moods.map(m => (
            <TouchableOpacity
              key={m.v}
              style={[s.moodBtn, quickMood === m.v && s.moodBtnActive]}
              onPress={() => {
                setQuickMood(m.v);
                setTimeout(() => onNavigate('mood'), 350);
              }}
              activeOpacity={0.8}
            >
              <Text style={s.moodEmoji}>{m.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {quickMood !== null && <Text style={s.moodContinue}>Continue check-in →</Text>}
      </View>

      {/* Breathe section */}
      <View style={s.sectionRow}>
        <Text style={s.sectionLabel}>Breathe</Text>
        <TouchableOpacity onPress={() => onNavigate('breathe')}>
          <Text style={s.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.breatheRow}
        style={s.breatheScroll}
      >
        {breatheTechs.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[s.breatheCard, { backgroundColor: t.glow, borderColor: t.color + '44' }]}
            onPress={() => onNavigate('breathe')}
            activeOpacity={0.85}
          >
            <View style={[s.breatheIcon, { borderColor: t.color + '66' }]}>
              <WindIcon color={t.color} />
            </View>
            <Text style={s.breatheName}>{t.name}</Text>
            <Text style={s.breatheSub}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Journey section */}
      <View style={s.sectionRow}>
        <Text style={s.sectionLabel}>Your Journey</Text>
        <TouchableOpacity onPress={() => onNavigate('journey')}>
          <Text style={s.seeAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={s.journeyCard} onPress={() => onNavigate('journey')} activeOpacity={0.9}>
        <View style={s.journeyLeft}>
          <View style={s.chapterBadge}><Text style={s.chapterBadgeText}>Chapter 2</Text></View>
          <Text style={s.journeyTitle}>Acceptance</Text>
          <Text style={s.journeySub}>Making room for what is · ACT</Text>
          <View style={s.journeyProgress}>
            <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.journeyBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </View>
          <Text style={s.journeyMeta}>3 of 7 sessions · 150/340 XP</Text>
        </View>
        <Text style={s.journeyChevron}>›</Text>
      </TouchableOpacity>

      {/* Manas nudge */}
      <TouchableOpacity style={s.manasNudge} onPress={() => onNavigate('manas')} activeOpacity={0.85}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.manasAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <Text style={s.manasText}>Manas is ready — what's on your mind today?</Text>
        <Text style={s.manasArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function BellIcon() {
  return (
    <Text style={{ fontSize: 20, color: '#8B9CB8' }}>🔔</Text>
  );
}

function WindIcon({ color }: { color: string }) {
  return <Text style={{ color, fontSize: 16 }}>〰</Text>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgApp },
  content: { paddingBottom: 12 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  greeting: {
    fontFamily: 'Syne_700Bold', fontSize: 14, color: Colors.textPrimary, lineHeight: 17,
  },
  date: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  bellBtn: { padding: 4 },

  streakCard: {
    marginHorizontal: 20, marginBottom: 14, borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.22)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakNum: {
    fontFamily: 'Syne_800ExtraBold', fontSize: 34, lineHeight: 34,
    color: '#7C3AED',
  },
  streakTitle: { fontFamily: 'Syne_700Bold', fontSize: 13, color: Colors.textPrimary },
  streakSub: { fontSize: 10, color: Colors.textSecondary, marginTop: 2, maxWidth: 160, lineHeight: 14 },
  xpRight: { alignItems: 'flex-end' },
  xpVal: { fontFamily: 'DMM', fontSize: 12, color: Colors.stateSuccess, fontWeight: '500' },
  xpSub: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },

  sectionLabel: {
    fontFamily: 'DMM', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
    color: Colors.textMuted, paddingHorizontal: 20, paddingBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  seeAll: { fontSize: 11, color: Colors.accentViolet },

  moodCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.borderDefault,
  },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  moodBtn: {
    flex: 1, height: 54, borderRadius: 14,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center', justifyContent: 'center',
  },
  moodBtnActive: { borderColor: Colors.accentViolet, backgroundColor: Colors.accentVioletTint },
  moodEmoji: { fontSize: 22 },
  moodContinue: { fontSize: 11, color: Colors.accentViolet, textAlign: 'right', marginTop: 8, fontWeight: '500' },

  breatheScroll: { marginBottom: 14 },
  breatheRow: { paddingHorizontal: 20, gap: 8 },
  breatheCard: {
    width: 120, borderRadius: 16, padding: 12,
    borderWidth: 1, gap: 6,
  },
  breatheIcon: {
    width: 34, height: 34, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  breatheName: {
    fontFamily: 'Syne_700Bold', fontSize: 12, color: Colors.textPrimary, lineHeight: 15,
  },
  breatheSub: { fontSize: 10, color: Colors.textSecondary },

  journeyCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  journeyLeft: { flex: 1 },
  chapterBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999, backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)', marginBottom: 6,
  },
  chapterBadgeText: { fontSize: 9, fontWeight: '500', color: Colors.textManas },
  journeyTitle: { fontFamily: 'Syne_700Bold', fontSize: 15, color: Colors.textPrimary },
  journeySub: { fontFamily: 'DMM', fontSize: 9, color: Colors.textMuted, marginTop: 2, letterSpacing: 0.6 },
  journeyProgress: {
    height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: 10, overflow: 'hidden',
  },
  journeyBar: { height: '100%', width: '43%', borderRadius: 2 },
  journeyMeta: { fontFamily: 'DMM', fontSize: 9, color: Colors.textMuted, marginTop: 4 },
  journeyChevron: { fontSize: 20, color: Colors.textMuted },

  manasNudge: {
    marginHorizontal: 20, marginBottom: 4,
    backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  manasAvatar: { width: 30, height: 30, borderRadius: 15 },
  manasText: { flex: 1, fontSize: 12, fontWeight: '300', color: Colors.textManas, lineHeight: 18 },
  manasArrow: { fontSize: 16, color: Colors.accentViolet },
});
