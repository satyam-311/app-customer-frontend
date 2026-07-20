// src/screens/Auth/AuthLogo.js
//
// Shared logo mark for Login/Signup - same "MyJob" M-square + wordmark
// used on the Splash screen, so the brand is consistent across every
// screen a signed-out user sees (see SplashScreen.js for the original).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function AuthLogo({ compact }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <Text style={[styles.markLetter, compact && styles.markLetterCompact]}>M</Text>
      </View>
      <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>MyJob</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  mark: {
    width: 64, height: 64, borderRadius: 18, backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  markCompact: { width: 48, height: 48, borderRadius: 14, marginBottom: 8 },
  markLetter: { fontSize: 30, fontWeight: '800', color: colors.white },
  markLetterCompact: { fontSize: 22 },
  wordmark: { color: colors.white, fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
  wordmarkCompact: { fontSize: 17 },
});
