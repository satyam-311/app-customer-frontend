// src/screens/Splash/SplashScreen.js
//
// Matches the "logo animation" export: dark navy full-bleed background,
// centered logo mark that scales/fades in, then auto-navigates to the
// main tabs after a short delay. Using `replace` (not `navigate`) so the
// splash screen is removed from history - back button never returns here.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'MainTabs' : 'Login');
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center' }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>M</Text>
        </View>
        <Text style={styles.wordmark}>MyJob</Text>
        <Text style={styles.tagline}>Verified pros. Done right.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  logoCircle: {
    width: 88, height: 88, borderRadius: 24, backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoLetter: { fontSize: 42, fontWeight: '800', color: colors.white },
  wordmark: { color: colors.white, fontSize: 26, fontWeight: '700', letterSpacing: 0.5 },
  tagline: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 },
});
