import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

const stats = [
  { label: 'Day Streak', val: '7', unit: 'days', color: Colors.accentViolet },
  { label: 'Sessions', val: '23', unit: 'total', color: Colors.accentBlue },
  { label: 'XP', val: '350', unit: 'points', color: Colors.stateSuccess },
  { label: 'Chapter', val: '2', unit: 'of 4', color: Colors.stateWarning },
];

const settings = [
  { icon: '🔔', label: 'Reminders', val: '9:00 AM daily' },
  { icon: '🌙', label: 'Dark mode', val: 'Always on' },
  { icon: '🔒', label: 'Data & Privacy', val: '' },
  { icon: '📋', label: 'Assessments', val: 'PHQ-9 · GAD-7' },
  { icon: '❓', label: 'Help & Support', val: '' },
];

export function ProfileScreen({ onNavigate }: Props) {
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={s.hero}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.heroAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={s.heroAvatarText}>P</Text>
        </LinearGradient>
        <Text style={s.heroName}>Priya</Text>
        <Text style={s.heroSub}>Member since Jan 2025</Text>
        <View style={s.levelBadge}>
          <Text style={s.levelBadgeText}>Level 2 · Explorer</Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={s.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={[s.statCard, { borderColor: stat.color + '33' }]}>
            <Text style={[s.statVal, { color: stat.color }]}>{stat.val}</Text>
            <Text style={s.statUnit}>{stat.unit}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Journey progress */}
      <Text style={s.sectionLabel}>WELLNESS JOURNEY</Text>
      <View style={s.journeyCard}>
        <Text style={s.journeyTitle}>Chapter 2 · Acceptance</Text>
        <Text style={s.journeySub}>43% complete · 190 XP to next chapter</Text>
        <View style={s.jTrack}>
          <LinearGradient
            colors={['#3B82F6', '#7C3AED']}
            style={s.jFill}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          />
        </View>
      </View>

      {/* Settings */}
      <Text style={s.sectionLabel}>SETTINGS</Text>
      <View style={s.settingsList}>
        {settings.map((setting, i) => (
          <TouchableOpacity
            key={i}
            style={[s.settingRow, i === settings.length - 1 && { borderBottomWidth: 0 }]}
            activeOpacity={0.75}
          >
            <Text style={s.settingIcon}>{setting.icon}</Text>
            <Text style={s.settingLabel}>{setting.label}</Text>
            <View style={s.settingRight}>
              {setting.val ? <Text style={s.settingVal}>{setting.val}</Text> : null}
              <Text style={s.settingChevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.signOutBtn} activeOpacity={0.8}>
        <Text style={s.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  content: { paddingBottom: 16 },
  hero: {
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 24,
    paddingBottom: 20, gap: 6,
  },
  heroAvatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  heroAvatarText: { fontFamily: 'Syne_800ExtraBold', fontSize: 28, color: 'white' },
  heroName: { fontFamily: 'Syne_800ExtraBold', fontSize: 22, color: Colors.textPrimary },
  heroSub: { fontSize: 12, color: Colors.textMuted },
  levelBadge: {
    marginTop: 4, paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: 999, backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
  },
  levelBadgeText: { fontSize: 12, fontWeight: '500', color: Colors.textManas },

  statsGrid: {
    flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 16, gap: 8,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: 14, padding: 12,
    borderWidth: 1, alignItems: 'center', gap: 2,
  },
  statVal: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, lineHeight: 24 },
  statUnit: { fontSize: 9, color: Colors.textMuted },
  statLabel: { fontSize: 9, color: Colors.textSecondary, textAlign: 'center', lineHeight: 13 },

  sectionLabel: {
    fontFamily: 'DMM', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
    color: Colors.textMuted, paddingHorizontal: 20, paddingBottom: 8,
  },
  journeyCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
  },
  journeyTitle: { fontFamily: 'Syne_700Bold', fontSize: 13, color: Colors.textPrimary },
  journeySub: { fontSize: 11, color: Colors.textSecondary, marginTop: 3, marginBottom: 10 },
  jTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  jFill: { height: '100%', width: '43%', borderRadius: 2 },

  settingsList: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.bgCard,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.borderDefault, overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
  },
  settingIcon: { fontSize: 16, width: 22, textAlign: 'center' },
  settingLabel: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingVal: { fontSize: 11, color: Colors.textMuted },
  settingChevron: { fontSize: 18, color: Colors.textMuted },

  signOutBtn: {
    marginHorizontal: 20, paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: 'rgba(248,113,113,0.2)',
    borderRadius: 14, alignItems: 'center',
  },
  signOutText: { fontSize: 14, color: Colors.stateError },
});
