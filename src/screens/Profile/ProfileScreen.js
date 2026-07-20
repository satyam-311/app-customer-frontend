// src/screens/Profile/ProfileScreen.js
//
// Customer's own account settings ("profile.png"): avatar/name card, then
// a menu of rows (Personal info, Login & security, Address, Notifications,
// Payment methods) and a Logout row at the bottom. Only "Personal info"
// has a real destination screen built out (per the requested screen list);
// the others are wired up to placeholders with a TODO alert so it's
// obvious in code where to plug in real screens later.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { colors, spacing, radius, typography, shadow } from '../../constants/theme';
import { ScreenHeader } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const MENU_ITEMS = [
  { key: 'personalInfo', icon: 'person-outline', label: 'Personal info', route: 'PersonalInfo' },
  { key: 'security', icon: 'lock-closed-outline', label: 'Login & security' },
  { key: 'address', icon: 'location-outline', label: 'Address & Location' },
  { key: 'notifications', icon: 'notifications-outline', label: 'Notifications' },
  { key: 'payment', icon: 'card-outline', label: 'Payment methods' },
];

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth();

  const goTo = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
    } else {
      // Placeholder for screens not in this build's scope - swap this
      // Alert for a real navigation.navigate(...) once that screen exists.
      Alert.alert(item.label, 'This screen isn\u2019t built yet in this scaffold.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={styles.name}>Aditi Sharma</Text>
            <Text style={styles.email}>aditi.sharma@email.com</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
              onPress={() => goTo(item)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={18} color={colors.navy} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.card,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  name: { ...typography.h3 },
  email: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  menuCard: { backgroundColor: colors.white, borderRadius: radius.lg, ...shadow.card, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, ...typography.body, color: colors.textPrimary },
  logoutRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginTop: spacing.xl, padding: spacing.lg,
  },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
});
