import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

const posts = [
  { id: 1, anon: 'Sparrow #4821', time: '2h ago', text: "First week of consistent breathing done. Didn't think I'd make it past day 3 honestly.", likes: 14, replies: 3, tag: 'Milestone' },
  { id: 2, anon: 'River #2209', time: '4h ago', text: "Does anyone else feel like anxiety spikes on Sunday evenings? I've been tracking mine and it's a consistent pattern.", likes: 22, replies: 8, tag: 'Discussion' },
  { id: 3, anon: 'Birch #7734', time: '6h ago', text: "Manas suggested I try Bhastrika before my presentation. Actually helped — sharing this for anyone with performance anxiety.", likes: 31, replies: 5, tag: 'Tip' },
];

const groups = [
  { name: 'Academic Stress', members: '1.2k', color: '#3B82F6' },
  { name: 'Working Adults', members: '890', color: '#7C3AED' },
  { name: 'Grief & Loss', members: '340', color: '#059669' },
];

export function CommunityScreen({ onNavigate }: Props) {
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>Community</Text>
        <Text style={s.subtitle}>Anonymous peer support</Text>
      </View>

      <View style={s.privacyBanner}>
        <Text style={{ fontSize: 13 }}>🔒</Text>
        <Text style={s.privacyText}>
          All posts are anonymous. No names, no profiles — only shared experiences.
        </Text>
      </View>

      <View style={s.sectionRow}>
        <Text style={s.sectionLabel}>SUPPORT GROUPS</Text>
      </View>
      <View style={s.groupsList}>
        {groups.map((g, i) => (
          <TouchableOpacity
            key={i}
            style={[s.groupChip, { borderColor: g.color + '55', backgroundColor: g.color + '14' }]}
            activeOpacity={0.85}
          >
            <View style={[s.groupDot, { backgroundColor: g.color }]} />
            <View>
              <Text style={s.groupName}>{g.name}</Text>
              <Text style={s.groupMembers}>{g.members} members</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.sectionRow}>
        <Text style={s.sectionLabel}>RECENT SHARES</Text>
        <TouchableOpacity style={s.writeBtn} activeOpacity={0.8}>
          <Text style={s.writeBtnText}>+ Share</Text>
        </TouchableOpacity>
      </View>

      <View style={s.postList}>
        {posts.map(p => (
          <View key={p.id} style={s.postCard}>
            <View style={s.postTop}>
              <View style={s.anonRow}>
                <LinearGradient
                  colors={['rgba(59,130,246,0.4)', 'rgba(124,58,237,0.4)']}
                  style={s.anonAvatar}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                />
                <Text style={s.anonName}>{p.anon}</Text>
                <View style={s.tagBadge}>
                  <Text style={s.tagBadgeText}>{p.tag}</Text>
                </View>
              </View>
              <Text style={s.postTime}>{p.time}</Text>
            </View>
            <Text style={s.postText}>{p.text}</Text>
            <View style={s.postActions}>
              <TouchableOpacity style={s.actionBtn} activeOpacity={0.7}>
                <Text style={s.actionIcon}>♥</Text>
                <Text style={s.actionCount}>{p.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn} activeOpacity={0.7}>
                <Text style={s.actionIcon}>💬</Text>
                <Text style={s.actionCount}>{p.replies}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn} activeOpacity={0.7}>
                <Text style={s.actionIcon}>↗</Text>
              </TouchableOpacity>
            </View>
          </View>
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

  privacyBanner: {
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: 'rgba(52,211,153,0.07)', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(52,211,153,0.15)',
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
  },
  privacyText: { flex: 1, fontSize: 11, color: '#6EE7B7', lineHeight: 17 },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  sectionLabel: {
    fontFamily: 'DMM', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  writeBtn: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  writeBtnText: { fontSize: 11, color: Colors.textManas, fontWeight: '500' },

  groupsList: { paddingHorizontal: 20, gap: 6, marginBottom: 14 },
  groupChip: {
    borderRadius: 12, padding: 12, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  groupDot: { width: 8, height: 8, borderRadius: 4 },
  groupName: { fontSize: 12, fontWeight: '500', color: Colors.textPrimary },
  groupMembers: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },

  postList: { paddingHorizontal: 20, gap: 8 },
  postCard: {
    backgroundColor: Colors.bgCard, borderRadius: 14, padding: 13,
    borderWidth: 1, borderColor: Colors.borderDefault,
  },
  postTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
  },
  anonRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  anonAvatar: { width: 24, height: 24, borderRadius: 12 },
  anonName: { fontSize: 11, fontWeight: '500', color: Colors.textSecondary },
  tagBadge: {
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: 999,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  tagBadgeText: { fontSize: 9, fontWeight: '500', color: Colors.textManas },
  postTime: { fontSize: 10, color: Colors.textMuted },
  postText: { fontSize: 13, color: Colors.textPrimary, lineHeight: 21, fontWeight: '300', marginBottom: 10 },
  postActions: { flexDirection: 'row', gap: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionIcon: { fontSize: 14, color: Colors.textMuted },
  actionCount: { fontSize: 11, color: Colors.textMuted },
});
