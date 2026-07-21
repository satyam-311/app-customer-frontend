// src/screens/Profile/PersonalInfoScreen.js
//
// Edit account details form ("personal info.png"): avatar + change-photo
// link, floating-label fields for name/email/phone, a "Password" security
// row that links out to a not-yet-built change-password flow (same
// Alert-placeholder convention used elsewhere in the app), and an
// address field. Local form state + inline validation per field (shown
// once the field has been "touched" so we don't yell at the user before
// they've typed anything).
//
// "Save changes" goes through api.updateProfile() (mock) - swap that
// function's body in mockData.js for a real PATCH call later.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { ScreenHeader, PrimaryButton } from '../../components/UI';
import { api } from '../../data/mockData';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

const initialForm = {
  fullName: 'Aditi Sharma',
  email: 'aditi.sharma@email.com',
  phone: '+91 98765 43210',
  address: '221B Baker Street, Delhi',
};

export default function PersonalInfoScreen({ navigation }) {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

  const errors = {
    fullName: form.fullName.trim().length < 2 ? 'Enter your full name.' : null,
    email: !EMAIL_REGEX.test(form.email) ? 'Enter a valid email address.' : null,
    phone: !PHONE_REGEX.test(form.phone) ? 'Enter a valid phone number.' : null,
    address: form.address.trim().length < 5 ? 'Enter your address.' : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = async () => {
    setTouched({ fullName: true, email: true, phone: true, address: true });
    if (hasErrors) return;
    setSaving(true);
    try {
      await api.updateProfile({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      Alert.alert('Saved', 'Your personal info has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Personal Information" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
            <View style={styles.editBtn}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </View>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Change photo', 'This screen isn’t built yet in this scaffold.')}>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
        <FloatingField
          label="Full name"
          value={form.fullName}
          onChangeText={(v) => setField('fullName', v)}
          onBlur={() => markTouched('fullName')}
          error={touched.fullName && errors.fullName}
        />
        <FloatingField
          label="Email Address"
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          onBlur={() => markTouched('email')}
          error={touched.email && errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FloatingField
          label="Phone Number"
          value={form.phone}
          onChangeText={(v) => setField('phone', v)}
          onBlur={() => markTouched('phone')}
          error={touched.phone && errors.phone}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <TouchableOpacity
          style={styles.securityRow}
          onPress={() => Alert.alert('Change password', 'This screen isn’t built yet in this scaffold.')}
        >
          <Ionicons name="lock-closed" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.securityTitle}>Password</Text>
            <Text style={styles.securitySubtitle}>Last changed 3 months ago</Text>
          </View>
          <Text style={styles.securityChange}>Change</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>RESIDENTIAL ADDRESS</Text>
        <FloatingField
          label="Street Address"
          value={form.address}
          onChangeText={(v) => setField('address', v)}
          onBlur={() => markTouched('address')}
          error={touched.address && errors.address}
        />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Back"
          variant="outline"
          icon="chevron-back"
          style={{ flex: 1 }}
          onPress={() => navigation.goBack()}
        />
        <PrimaryButton
          title={saving ? 'Saving...' : 'Save changes'}
          iconRight={saving ? undefined : 'chevron-forward'}
          loading={saving}
          style={{ flex: 1 }}
          onPress={handleSave}
        />
      </View>
    </View>
  );
}

function FloatingField({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <View style={styles.floatingLabelWrap}>
        <Text style={styles.floatingLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.placeholder}
        {...inputProps}
      />
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  avatarWrap: { width: 128, height: 128, marginBottom: spacing.sm },
  avatar: { width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: colors.orange },
  editBtn: {
    position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  changePhoto: { color: colors.orange, fontWeight: '700', fontSize: 15 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  field: { marginTop: spacing.md, marginBottom: spacing.xs },
  floatingLabelWrap: {
    position: 'absolute', top: -8, left: spacing.lg, backgroundColor: colors.background,
    paddingHorizontal: 6, zIndex: 1,
  },
  floatingLabel: { color: colors.orange, fontSize: 12, fontWeight: '700' },
  input: {
    backgroundColor: colors.cardTintBlue, borderRadius: radius.xl, borderWidth: 1,
    borderColor: 'rgba(13,28,50,0.1)', height: 60, paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm, fontSize: 15, color: colors.textPrimary,
  },
  inputError: { borderColor: colors.danger },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  errorText: { color: colors.danger, fontSize: 12 },
  securityRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardTintBlue,
    borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md,
  },
  securityTitle: { ...typography.bodyBold, fontSize: 16 },
  securitySubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  securityChange: { color: colors.orange, fontWeight: '600', fontSize: 14 },
  footer: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
