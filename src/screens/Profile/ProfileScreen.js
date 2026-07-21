// src/screens/Profile/ProfileScreen.js
//
// Customer's own account settings ("profile.png"): hero avatar (ring +
// edit button + Verified badge), two labeled menu-card groups ("Account
// Details" / "Preferences"), and a Logout button. Only "Personal info"
// has a real destination screen built out (per the requested screen
// list); the others are wired up to placeholders with a TODO alert so
// it's obvious in code where to plug in real screens later.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { ScreenHeader, PrimaryButton } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const SECTIONS = [
  {
    label: 'Account Details',
    items: [
      { key: 'personalInfo', icon: 'person', label: 'Personal Information', route: 'PersonalInfo' },
      { key: 'security', icon: 'shield-checkmark', label: 'Login & Security' },
      { key: 'address', icon: 'location', label: 'Address & Location' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { key: 'notifications', icon: 'notifications', label: 'Notifications' },
      { key: 'payment', icon: 'cash', label: 'Payment Methods' },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const goTo = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
    } else {
      // Placeholder for screens not in this build's scope - swap this
      // Alert for a real navigation.navigate(...) once that screen exists.
      Alert.alert(item.label, 'This screen isn’t built yet in this scaffold.');
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
      <ScreenHeader title="Account settings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => Alert.alert('Change photo', 'This screen isn’t built yet in this scaffold.')}
            >
              <Ionicons name="pencil" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || 'Your name'}</Text>
          <View style={styles.verifiedRow}>
            <Ionicons name="checkmark-circle" size={15} color={colors.orange} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.label} style={{ marginBottom: spacing.lg }}>
            <Text style={styles.sectionLabel}>{section.label.toUpperCase()}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.menuRow, i < section.items.length - 1 && styles.menuRowBorder]}
                  onPress={() => goTo(item)}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={18} color={colors.white} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <PrimaryButton
          title="Logout"
          variant="outline"
          icon="log-out-outline"
          onPress={handleLogout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  avatarWrap: { width: 128, height: 128, marginBottom: spacing.md },
  avatar: { width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: colors.orange },
  editBtn: {
    position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  name: { ...typography.h1, color: colors.textPrimary },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  verifiedText: { color: colors.orange, fontWeight: '700', fontSize: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: colors.textMuted, marginBottom: spacing.sm },
  menuCard: { backgroundColor: colors.cardTintBlue, borderRadius: radius.lg, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(13,28,50,0.08)' },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.navy,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, ...typography.body, color: colors.textPrimary },
});
