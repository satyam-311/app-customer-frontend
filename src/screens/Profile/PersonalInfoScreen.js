// src/screens/Profile/PersonalInfoScreen.js
//
// Edit account details form ("personal info.png"): name, email, phone,
// password (change), address. Local form state + inline validation per
// field (shown once the field has been "touched" so we don't yell at the
// user before they've typed anything).
//
// "Save changes" goes through api.updateProfile() (mock) - swap that
// function's body in mockData.js for a real PATCH call later.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert,
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
  currentPassword: '',
  newPassword: '',
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
    newPassword:
      form.newPassword.length > 0 && form.newPassword.length < 8
        ? 'New password must be at least 8 characters.'
        : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = async () => {
    setTouched({ fullName: true, email: true, phone: true, address: true, newPassword: true });
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
      <ScreenHeader title="Personal Info" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Field
          label="Full name"
          value={form.fullName}
          onChangeText={(v) => setField('fullName', v)}
          onBlur={() => markTouched('fullName')}
          error={touched.fullName && errors.fullName}
        />
        <Field
          label="Email"
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          onBlur={() => markTouched('email')}
          error={touched.email && errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Phone"
          value={form.phone}
          onChangeText={(v) => setField('phone', v)}
          onBlur={() => markTouched('phone')}
          error={touched.phone && errors.phone}
          keyboardType="phone-pad"
        />
        <Field
          label="Address"
          value={form.address}
          onChangeText={(v) => setField('address', v)}
          onBlur={() => markTouched('address')}
          error={touched.address && errors.address}
        />

        <Text style={styles.sectionTitle}>Change password</Text>
        <Field
          label="Current password"
          value={form.currentPassword}
          onChangeText={(v) => setField('currentPassword', v)}
          secureTextEntry
          placeholder="Leave blank to keep current password"
        />
        <Field
          label="New password"
          value={form.newPassword}
          onChangeText={(v) => setField('newPassword', v)}
          onBlur={() => markTouched('newPassword')}
          error={touched.newPassword && errors.newPassword}
          secureTextEntry
          placeholder="At least 8 characters"
        />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title={saving ? 'Saving...' : 'Save changes'} loading={saving} onPress={handleSave} />
      </View>
    </View>
  );
}

function Field({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
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
  field: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, fontSize: 13, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    height: 48, paddingHorizontal: spacing.md, fontSize: 14, color: colors.textPrimary,
  },
  inputError: { borderColor: colors.danger },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  errorText: { color: colors.danger, fontSize: 12 },
  sectionTitle: { ...typography.h3, marginTop: spacing.md, marginBottom: spacing.md },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
