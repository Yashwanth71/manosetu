import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

const therapists = [
  { initials: 'AS', name: 'Dr. Ananya S.', spec: 'CBT · Anxiety · Academic stress', lang: 'Hindi + English', avail: 'Today, 4 PM', wait: 'Today', conf: 86, color: '#7C3AED' },
  { initials: 'RK', name: 'Rahul K.', spec: 'ACT · Depression · Career', lang: 'English', avail: 'Tomorrow, 10 AM', wait: '1 day', conf: 79, color: '#3B82F6' },
  { initials: 'PM', name: 'Preethi M.', spec: 'CBT · Relationships · Trauma', lang: 'Tamil + English', avail: 'Wed, 6 PM', wait: '2 days', conf: 73, color: '#059669' },
];

const slots = ['Today, 4:00 PM', 'Today, 6:00 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:00 PM'];

export function TherapyScreen({ onNavigate }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const t = therapists[selected];
    return (
      <View style={s.container}>
        <View style={s.bookHeader}>
          <TouchableOpacity style={s.backBtn} onPress={() => setSelected(null)}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.bookTitle}>Book Session</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View style={s.bookCard}>
            <LinearGradient
              colors={[t.color + '99', t.color]}
              style={s.bigAvatar}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={s.avatarText}>{t.initials}</Text>
            </LinearGradient>
            <Text style={s.bookName}>{t.name}</Text>
            <Text style={s.bookSpec}>{t.spec}</Text>
            <Text style={s.bookLang}>{t.lang}</Text>
            <View style={s.confRow}>
              <View style={s.confBar}>
                <LinearGradient
                  colors={['#3B82F6', t.color]}
                  style={[s.confFill, { width: `${t.conf}%` }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={s.confNum}>{t.conf}% match</Text>
            </View>
          </View>

          <Text style={s.slotLabel}>AVAILABLE SLOTS</Text>
          {slots.map((slot, i) => (
            <View key={i} style={[s.slotRow, i === 0 && s.slotActive]}>
              <View style={s.slotDot} />
              <Text style={s.slotText}>{slot}</Text>
              {i === 0 && (
                <View style={s.slotBadge}>
                  <Text style={s.slotBadgeText}>Earliest</Text>
                </View>
              )}
            </View>
          ))}

          <View style={s.bookCTA}>
            <TouchableOpacity style={s.bookBtn} onPress={() => setSelected(null)} activeOpacity={0.9}>
              <LinearGradient
                colors={['#3B82F6', '#7C3AED']} style={s.bookBtnGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={s.bookBtnText}>Confirm Booking</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={s.privacyNote}>🔒 Your data stays private. k-anonymity ≥10.</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>Therapy</Text>
        <Text style={s.subtitle}>Matched to your needs</Text>
      </View>

      <View style={s.matchBanner}>
        <View style={s.matchIcon}>
          <Text style={{ fontSize: 14 }}>✓</Text>
        </View>
        <Text style={s.matchText}>
          Based on your mood logs and Manas conversations, we've found 3 strong matches.
        </Text>
      </View>

      <View style={s.therapistList}>
        {therapists.map((t, i) => (
          <TouchableOpacity key={i} style={s.card} onPress={() => setSelected(i)} activeOpacity={0.85}>
            <LinearGradient
              colors={[t.color + '88', t.color]}
              style={s.avatar}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={s.avatarText}>{t.initials}</Text>
            </LinearGradient>
            <View style={s.info}>
              <Text style={s.name}>{t.name}</Text>
              <Text style={s.spec}>{t.spec}</Text>
              <Text style={s.lang}>{t.lang}</Text>
              <View style={s.confRow}>
                <View style={s.confBar}>
                  <LinearGradient
                    colors={['#3B82F6', t.color]}
                    style={[s.confFill, { width: `${t.conf}%` }]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  />
                </View>
                <Text style={s.confNum}>{t.conf}%</Text>
              </View>
            </View>
            <View style={s.right}>
              <View style={s.availBadge}>
                <Text style={s.availBadgeText}>{t.wait}</Text>
              </View>
              <Text style={s.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  content: { paddingBottom: 16 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  title: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },

  matchBanner: {
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
  },
  matchIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  matchText: { flex: 1, fontSize: 12, color: Colors.textManas, lineHeight: 19, fontWeight: '300' },

  therapistList: { gap: 10, paddingHorizontal: 20 },
  card: {
    backgroundColor: Colors.bgCard, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.borderDefault,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
  },
  avatar: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Syne_800ExtraBold', fontSize: 15, color: 'white' },
  info: { flex: 1 },
  name: { fontFamily: 'Syne_700Bold', fontSize: 14, color: Colors.textPrimary, marginBottom: 2 },
  spec: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },
  lang: { fontSize: 10, color: Colors.textMuted, marginTop: 3 },
  confRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  confBar: {
    flex: 1, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden',
  },
  confFill: { height: '100%', borderRadius: 2 },
  confNum: { fontFamily: 'DMM', fontSize: 10, color: Colors.stateSuccess },
  right: { alignItems: 'flex-end', gap: 6 },
  availBadge: {
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999,
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1, borderColor: 'rgba(52,211,153,0.2)',
  },
  availBadgeText: { fontSize: 9, fontWeight: '500', color: Colors.stateSuccess },
  chevron: { fontSize: 18, color: Colors.textMuted },

  // Booking
  bookHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 8,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: Colors.textSecondary },
  bookTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Syne_700Bold', fontSize: 15, color: Colors.textPrimary,
  },
  bookCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: Colors.borderDefault,
    alignItems: 'center', gap: 6,
  },
  bigAvatar: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  bookName: { fontFamily: 'Syne_700Bold', fontSize: 16, color: Colors.textPrimary },
  bookSpec: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  bookLang: { fontSize: 11, color: Colors.textMuted },
  slotLabel: {
    fontFamily: 'DMM', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
    color: Colors.textMuted, paddingHorizontal: 20, paddingBottom: 8,
  },
  slotRow: {
    marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.bgCard,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.borderDefault,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  slotActive: { borderColor: 'rgba(124,58,237,0.35)', backgroundColor: 'rgba(124,58,237,0.08)' },
  slotDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentViolet },
  slotText: { flex: 1, fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  slotBadge: {
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.12)',
    borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)',
  },
  slotBadgeText: { fontSize: 9, color: '#93C5FD' },
  bookCTA: { paddingHorizontal: 20, paddingTop: 16 },
  bookBtn: {},
  bookBtnGrad: { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  bookBtnText: { color: 'white', fontFamily: 'Syne_700Bold', fontSize: 15 },
  privacyNote: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 16 },
});
