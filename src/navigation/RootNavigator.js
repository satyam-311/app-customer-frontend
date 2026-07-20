// src/navigation/RootNavigator.js
//
// One native-stack navigator sits at the root. Its first screen is the
// tab navigator (MainTabs); every other screen here is something that
// should visually "push" over the tabs with a back button - profile
// settings, personal info, a pro's public profile, the 4-step post-a-job
// flow, and an individual chat thread.
//
// Keeping ONE stack (rather than nesting a stack inside every tab) keeps
// navigation simple: `navigation.navigate('ProProfile', { proId })` works
// the same regardless of which tab you tapped it from.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import MainTabNavigator from './MainTabNavigator';

import PostJobStep1 from '../screens/PostJob/PostJobStep1';
import PostJobStep2 from '../screens/PostJob/PostJobStep2';
import PostJobStep3 from '../screens/PostJob/PostJobStep3';
import PostJobStep4 from '../screens/PostJob/PostJobStep4';

import ProProfileScreen from '../screens/ProProfile/ProProfileScreen';
import ChatThreadScreen from '../screens/Messages/ChatThreadScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PersonalInfoScreen from '../screens/Profile/PersonalInfoScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* Post-a-job flow (4 steps, shares state via JobFormContext) */}
      <Stack.Screen name="PostJobStep1" component={PostJobStep1} />
      <Stack.Screen name="PostJobStep2" component={PostJobStep2} />
      <Stack.Screen name="PostJobStep3" component={PostJobStep3} />
      <Stack.Screen name="PostJobStep4" component={PostJobStep4} />

      {/* Detail / settings screens pushed from various tabs */}
      <Stack.Screen name="ProProfile" component={ProProfileScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
    </Stack.Navigator>
  );
}
