import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InlineBreather } from '../components/InlineBreather';
import { Colors, TECHNIQUES, Technique } from '../constants';

interface Props {
  onNavigate: (screen: string) => void;
}

const EMOTION_MAP = [
  { keywords: ['anxious','anxiety','nervous','worry','worried','panic'], techId: 'box', why: 'Box breathing resets your nervous system in under 3 minutes.' },
  { keywords: ['stress','stressed','overwhelmed','pressure','too much'], techId: 'nadi', why: 'Nadi Shodhana can restore balance when life feels like too much.' },
  { keywords: ['angry','anger','frustrated','irritated','rage'], techId: 'ujjayi', why: 'Ujjayi breath releases anger stored in the body.' },
  { keywords: ['sad','sadness','hopeless','lonely','cry','grief','lost'], techId: 'bhram', why: "Bhramari's gentle hum has been shown to soothe deep sadness." },
  { keywords: ['tired','exhausted','drained','fatigue','no energy','low energy'], techId: 'bhast', why: 'Bhastrika will energise you — even just 3 minutes helps.' },
  { keywords: ["can't focus",'distracted','blank','unfocused','foggy','mind'], techId: 'kapala', why: 'Kapalabhati clears mental fog in just a few rounds.' },
  { keywords: ["can't sleep",'insomnia','restless','awake','sleep'], techId: '478', why: 'The 4-7-8 pattern activates your parasympathetic nervous system.' },
  { keywords: ['irritable','heated','agitated','reactive'], techId: 'sitali', why: "Sitali's cooling breath is ideal for irritability and heat." },
];

function detectEmotion(text: string) {
  const lower = text.toLowerCase();
  for (const e of EMOTION_MAP) {
    if (e.keywords.some(k => lower.includes(k))) return e;
  }
  return null;
}

function getReply(userText: string, emotion: typeof EMOTION_MAP[0] | null) {
  const base = [
    "That sounds really heavy. Can you tell me more about what's been building up?",
    "I hear you. What's been weighing on you the most today?",
    "Thank you for sharing that with me. You don't have to carry this alone.",
    "That makes sense given what you're going through. What would feel most helpful right now?",
  ];
  if (!emotion) return base[Math.floor(Math.random() * base.length)];
  const contextual: Record<string, string> = {
    box: "That feeling is your nervous system in overdrive. Let's try something together — right here, right now.",
    nadi: "When life piles up like this, the nervous system needs recalibration. There's a technique that can help.",
    ujjayi: "Anger that isn't released stays in the body. There's a breath practice designed specifically for this.",
    bhram: "Sadness deserves space. A gentle physical anchor can help you stay present with it.",
    bhast: "When you're this drained, the body needs oxygen before the mind can process anything. Let's start there.",
    kapala: "A foggy mind is often a signal of shallow breathing. Let's reset in under 3 minutes.",
    '478': "Your nervous system is telling you something. The 4-7-8 pattern is one of the fastest ways to respond.",
    sitali: "Cooling the nervous system physically shifts the emotional state too. I know something that can help.",
  };
  return contextual[emotion.techId] || base[0];
}

interface Message {
  id: number;
  from: 'user' | 'manas';
  text: string;
  time: string;
  breatheTool?: { tech: Technique; why: string } | null;
}

export function ManasChatScreen({ onNavigate }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'manas', text: "I'm here. What's been on your mind today?", time: '9:41 AM' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set());
  const scrollRef = useRef<ScrollView>(null);
  const typingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(typingOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingOpacity.setValue(0);
    }
  }, [isTyping]);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { id: Date.now(), from: 'user', text, time: now }]);
    setInput('');
    setIsTyping(true);
    const emotion = detectEmotion(text);
    setTimeout(() => {
      setIsTyping(false);
      const reply = getReply(text, emotion);
      const tech = emotion ? TECHNIQUES.find(t => t.id === emotion.techId) ?? null : null;
      setMessages(m => [...m, {
        id: Date.now() + 1, from: 'manas', text: reply, time: now,
        breatheTool: tech ? { tech, why: emotion!.why } : null,
      }]);
    }, 1200 + Math.random() * 600);
  };

  const handleBreathDone = () => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setTimeout(() => {
      setMessages(m => [...m, {
        id: Date.now(), from: 'manas', time: now,
        text: "Take a moment. Do you notice any shift — even a small one?",
      }]);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const showQuickPrompts = messages.length <= 2;
  const quickPrompts = ["I'm feeling anxious", "Work stress is overwhelming", "I can't sleep", "I feel really drained"];

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={s.header}>
        <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.headerAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <View style={{ flex: 1 }}>
          <Text style={s.headerName}>Manas</Text>
          <View style={s.headerStatus}>
            <View style={s.statusDot} />
            <Text style={s.statusText}>Active now</Text>
          </View>
        </View>
        <TouchableOpacity style={s.headerBtn}>
          <Text style={{ fontSize: 18, color: '#8B9CB8' }}>ℹ</Text>
        </TouchableOpacity>
      </View>

      {/* Thread */}
      <ScrollView
        ref={scrollRef}
        style={s.thread}
        contentContainerStyle={s.threadContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.datePill}><Text style={s.datePillText}>Today</Text></View>

        {messages.map(msg => (
          <View key={msg.id} style={msg.from === 'user' ? s.userRow : s.manasRow}>
            {msg.from === 'manas' && (
              <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.manasAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            )}
            <View style={msg.from === 'user' ? s.userBubble : s.manasBubble}>
              <Text style={msg.from === 'user' ? s.userText : s.manasText}>{msg.text}</Text>

              {msg.breatheTool && (
                <View style={s.toolCard}>
                  <View style={s.toolHeader}>
                    <View style={[s.toolDot, { backgroundColor: msg.breatheTool.tech.color }]} />
                    <Text style={s.toolEyebrow}>BREATHING · SUGGESTED FOR YOU</Text>
                  </View>
                  <Text style={s.toolName}>{msg.breatheTool.tech.name}</Text>
                  <Text style={s.toolPhases}>
                    {msg.breatheTool.tech.phases.filter(p => p > 0).join('-')} pattern · {msg.breatheTool.tech.desc}
                  </Text>
                  <Text style={s.toolWhy}>{msg.breatheTool.why}</Text>

                  {expandedTools.has(msg.id) ? (
                    <InlineBreather
                      tech={msg.breatheTool.tech}
                      onDone={handleBreathDone}
                    />
                  ) : (
                    <View style={s.toolBtnRow}>
                      <TouchableOpacity
                        style={[s.toolBtnPrimary, { backgroundColor: msg.breatheTool.tech.color }]}
                        onPress={() => setExpandedTools(s => new Set([...s, msg.id]))}
                        activeOpacity={0.85}
                      >
                        <Text style={s.toolBtnPrimaryText}>Quick 3-min ↓</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={s.toolBtnSec}
                        onPress={() => onNavigate('breathe')}
                        activeOpacity={0.8}
                      >
                        <Text style={s.toolBtnSecText}>Full session →</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              <Text style={msg.from === 'user' ? s.userTime : s.manasTime}>{msg.time}</Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={s.manasRow}>
            <LinearGradient colors={['#3B82F6', '#7C3AED']} style={s.manasAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <View style={s.typingBubble}>
              {[0, 200, 400].map((delay, i) => (
                <TypingDot key={i} delay={delay} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick prompts */}
      {showQuickPrompts && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.quickRow}
          style={s.quickScroll}
        >
          {quickPrompts.map((p, i) => (
            <TouchableOpacity key={i} style={s.quickChip} onPress={() => setInput(p)} activeOpacity={0.8}>
              <Text style={s.quickChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Composer */}
      <View style={s.composer}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          placeholder="Tell Manas what's on your mind…"
          placeholderTextColor={Colors.textMuted}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity style={s.sendBtn} onPress={send} activeOpacity={0.85}>
          <Text style={{ color: 'white', fontSize: 16 }}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: -4, duration: 300, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(600 - delay),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[s.typingDot, { transform: [{ translateY: anim }] }]} />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11,
    paddingHorizontal: 16, backgroundColor: Colors.bgCard,
    borderBottomWidth: 1, borderBottomColor: Colors.borderDefault,
  },
  headerAvatar: { width: 34, height: 34, borderRadius: 17 },
  headerName: { fontFamily: 'Syne_700Bold', fontSize: 14, color: Colors.textPrimary },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  statusDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.stateSuccess },
  statusText: { fontSize: 10, color: Colors.stateSuccess },
  headerBtn: { marginLeft: 'auto', padding: 4 },

  thread: { flex: 1 },
  threadContent: { padding: 16, gap: 10, paddingBottom: 8 },
  datePill: {
    alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 2,
  },
  datePillText: { fontSize: 10, color: Colors.textMuted },

  userRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  manasRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  manasAvatar: { width: 24, height: 24, borderRadius: 12 },

  userBubble: {
    maxWidth: '78%', backgroundColor: Colors.accentViolet,
    borderRadius: 18, borderBottomRightRadius: 4, padding: 10, paddingHorizontal: 13,
  },
  manasBubble: {
    maxWidth: '86%', backgroundColor: Colors.bgElevated,
    borderRadius: 18, borderBottomLeftRadius: 4, padding: 10, paddingHorizontal: 13,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)',
  },
  userText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 21 },
  manasText: { fontSize: 14, fontWeight: '300', color: Colors.textManas, lineHeight: 24 },
  userTime: { fontSize: 9, color: 'rgba(255,255,255,0.38)', marginTop: 4, textAlign: 'right' },
  manasTime: { fontSize: 9, color: Colors.textMuted, marginTop: 4 },

  typingBubble: {
    backgroundColor: Colors.bgElevated, borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
    flexDirection: 'row', gap: 4, alignItems: 'center',
  },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textManas },

  // Tool card
  toolCard: {
    backgroundColor: 'rgba(12,17,32,0.85)', borderRadius: 14, padding: 13,
    marginTop: 10, borderWidth: 1, borderColor: 'rgba(124,58,237,0.22)',
  },
  toolHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  toolDot: { width: 7, height: 7, borderRadius: 3.5 },
  toolEyebrow: { fontFamily: 'DMM', fontSize: 9, letterSpacing: 1, color: Colors.accentViolet },
  toolName: { fontFamily: 'Syne_700Bold', fontSize: 14, color: Colors.textPrimary, marginBottom: 2 },
  toolPhases: { fontFamily: 'DMM', fontSize: 9, color: Colors.textMuted, marginBottom: 6, letterSpacing: 0.6 },
  toolWhy: { fontSize: 11, fontWeight: '300', color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  toolBtnRow: { flexDirection: 'row', gap: 7 },
  toolBtnPrimary: {
    flex: 2, paddingVertical: 9, borderRadius: 10, alignItems: 'center',
  },
  toolBtnPrimaryText: { color: 'white', fontFamily: 'Syne_700Bold', fontSize: 12 },
  toolBtnSec: {
    flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  toolBtnSecText: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },

  quickScroll: { flexShrink: 0 },
  quickRow: { paddingHorizontal: 14, paddingBottom: 10, gap: 6 },
  quickChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  quickChipText: { color: Colors.textManas, fontSize: 11 },

  composer: {
    flexDirection: 'row', gap: 8, padding: 9, paddingHorizontal: 14,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1, borderTopColor: Colors.borderDefault,
    alignItems: 'center',
  },
  input: {
    flex: 1, backgroundColor: Colors.bgElevated,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9,
    fontSize: 13, color: Colors.textPrimary,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.accentViolet,
    alignItems: 'center', justifyContent: 'center',
  },
});
