export const Colors = {
  bgApp: '#0C1120',
  bgCard: '#111827',
  bgElevated: '#1C2333',
  bgOverlay: 'rgba(12,17,32,0.88)',

  accentViolet: '#7C3AED',
  accentVioletDim: '#6D28D9',
  accentVioletGlow: 'rgba(124,58,237,0.25)',
  accentVioletTint: 'rgba(124,58,237,0.12)',
  accentBlue: '#3B82F6',
  accentBlueDim: '#2563EB',
  accentBlueTint: 'rgba(59,130,246,0.12)',

  textPrimary: '#F0F4FF',
  textManas: '#C4B5FD',
  textSecondary: '#8B9CB8',
  textMuted: '#4B5A72',

  stateSuccess: '#34D399',
  stateWarning: '#FBBF24',
  stateError: '#F87171',
  stateInfo: '#60A5FA',

  borderDefault: 'rgba(255,255,255,0.06)',
  borderActive: 'rgba(124,58,237,0.35)',
  borderSubtle: 'rgba(255,255,255,0.04)',
};

export const TECHNIQUES = [
  { id:'box',    name:'Box Breathing',   phases:[4,4,4,4], labels:['Breathe in','Hold','Breathe out','Hold'], desc:'Calms anxiety, restores focus',          color:'#3B82F6', glow:'#1D4ED8' },
  { id:'nadi',   name:'Nadi Shodhana',   phases:[4,0,8,0], labels:['Breathe in','','Breathe out',''],        desc:'Balances the nervous system',            color:'#7C3AED', glow:'#5B21B6' },
  { id:'478',    name:'4-7-8 Breathing', phases:[4,7,8,0], labels:['Breathe in','Hold','Breathe out',''],    desc:'Releases anxiety, promotes sleep',       color:'#0891B2', glow:'#0E7490' },
  { id:'ujjayi', name:'Ujjayi',          phases:[4,0,6,0], labels:['Breathe in','','Breathe out',''],        desc:'Ocean breath · releases anger & tension',color:'#4F46E5', glow:'#3730A3' },
  { id:'bhast',  name:'Bhastrika',       phases:[2,0,2,0], labels:['Breathe in','','Breathe out',''],        desc:'Bellows breath · energises mind & body', color:'#F59E0B', glow:'#D97706' },
  { id:'sitali', name:'Sitali',          phases:[4,0,6,0], labels:['Breathe in','','Breathe out',''],        desc:'Cooling breath · reduces irritability',  color:'#06B6D4', glow:'#0891B2' },
  { id:'bhram',  name:'Bhramari',        phases:[4,0,8,0], labels:['Breathe in','','Hum out',''],            desc:'Humming bee · soothes grief & sadness',  color:'#8B5CF6', glow:'#6D28D9' },
  { id:'kapala', name:'Kapalabhati',     phases:[1,0,1,0], labels:['In','','Out',''],                        desc:'Skull-shining · clears mental fog',      color:'#10B981', glow:'#047857' },
  { id:'dirga',  name:'Dirga Pranayama', phases:[5,0,5,0], labels:['Breathe in','','Breathe out',''],        desc:'3-part breath · deep full relaxation',   color:'#059669', glow:'#065F46' },
  { id:'anulom', name:'Anulom Vilom',    phases:[4,0,4,0], labels:['Left nostril in','','Right nostril out',''], desc:'Alternate nostril · clears & balances', color:'#6366F1', glow:'#4338CA' },
  { id:'sama',   name:'Sama Vritti',     phases:[4,0,4,0], labels:['Breathe in','','Breathe out',''],        desc:'Equal breathing · restores balance',     color:'#0284C7', glow:'#0369A1' },
  { id:'viloma', name:'Viloma',          phases:[3,1,3,1], labels:['Breathe in','Pause','Breathe out','Pause'], desc:'Interrupted breath · deep calm',     color:'#A855F7', glow:'#7C3AED' },
];

export type Technique = typeof TECHNIQUES[0];
