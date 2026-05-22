import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { ManasChatScreen } from '../screens/ManasChatScreen';
import { BreathingScreen } from '../screens/BreathingScreen';
import { MoodLogScreen } from '../screens/MoodLogScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { TherapyScreen } from '../screens/TherapyScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors } from '../constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeStackScreens} />
    </Stack.Navigator>
  );
}

function HomeStackScreens({ navigation }: any) {
  return <HomeScreen onNavigate={(s: string) => navigation.navigate(s === 'manas' ? 'ManasTab' : s === 'breathe' ? 'BreathTab' : s === 'mood' ? 'Mood' : s === 'journey' ? 'Journey' : 'HomeMain')} />;
}

function HomeTabStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" children={(p: any) => (
        <HomeScreen onNavigate={(s: string) => {
          if (s === 'mood') p.navigation.navigate('Mood');
          else if (s === 'journey') p.navigation.navigate('Journey');
          else if (s === 'breathe') p.navigation.navigate('Breathe');
          else if (s === 'manas') p.navigation.getParent()?.navigate('Manas');
          else if (s === 'therapy') p.navigation.getParent()?.navigate('Therapy');
        }} />
      )} />
      <Stack.Screen name="Mood" children={(p: any) => (
        <MoodLogScreen onNavigate={(s: string) => {
          if (s === 'home') p.navigation.goBack();
          else if (s === 'manas') p.navigation.getParent()?.navigate('Manas');
        }} />
      )} />
      <Stack.Screen name="Journey" children={(p: any) => (
        <JourneyScreen onNavigate={(s: string) => {
          if (s === 'breathe') p.navigation.navigate('Breathe');
          else if (s === 'home') p.navigation.goBack();
        }} />
      )} />
      <Stack.Screen name="Breathe" children={(p: any) => (
        <BreathingScreen onNavigate={(s: string) => {
          if (s === 'home') p.navigation.goBack();
        }} />
      )} />
    </Stack.Navigator>
  );
}

function ManasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManasMain" children={(p: any) => (
        <ManasChatScreen onNavigate={(s: string) => {
          if (s === 'breathe') p.navigation.getParent()?.navigate('Home');
        }} />
      )} />
    </Stack.Navigator>
  );
}

function TherapyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TherapyMain" children={(p: any) => (
        <TherapyScreen onNavigate={(s: string) => {}} />
      )} />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityMain" children={(p: any) => (
        <CommunityScreen onNavigate={(s: string) => {}} />
      )} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" children={(p: any) => (
        <ProfileScreen onNavigate={(s: string) => {}} />
      )} />
    </Stack.Navigator>
  );
}

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂',
    Manas: '💬',
    Therapy: '👥',
    Community: '🌐',
    Profile: '◯',
  };
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={[tabStyles.icon, { color: focused ? Colors.accentViolet : Colors.textMuted }]}>
        {icons[name] || '●'}
      </Text>
      {focused && <View style={tabStyles.dot} />}
    </View>
  );
}

export function AppNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(17,24,39,0.96)',
            borderTopColor: 'rgba(255,255,255,0.05)',
            borderTopWidth: 1,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom - 4, 2),
            height: 56 + Math.max(insets.bottom - 4, 2),
          },
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarLabel: ({ focused, children }) => (
            <Text style={[tabStyles.label, { color: focused ? Colors.textManas : Colors.textMuted }]}>
              {children}
            </Text>
          ),
          tabBarActiveTintColor: Colors.textManas,
          tabBarInactiveTintColor: Colors.textMuted,
        })}
      >
        <Tab.Screen name="Home" component={HomeTabStack} options={{ title: 'Home' }} />
        <Tab.Screen name="Manas" component={ManasStack} options={{ title: 'Manas' }} />
        <Tab.Screen name="Therapy" component={TherapyStack} options={{ title: 'Therapy' }} />
        <Tab.Screen name="Community" component={CommunityStack} options={{ title: 'Community' }} />
        <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center', justifyContent: 'center',
    paddingTop: 2,
  },
  iconWrapActive: {},
  icon: { fontSize: 20, lineHeight: 24 },
  dot: {
    position: 'absolute', bottom: -5, left: '50%', marginLeft: -2,
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.accentViolet,
  },
  label: { fontSize: 9, fontWeight: '500', marginTop: 1 },
});
