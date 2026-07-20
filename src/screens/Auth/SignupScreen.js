// src/screens/Auth/SignupScreen.js
//
// Matches the "Create Account" export in design figma/logo animation 3.png:
// navy top section with the logo, a white rounded-top sheet with
// Full Name/Username, Email/Phone, Full Address, Password/Confirm Password,
// a Create Account button, and links back to Login or (placeholder) Google.
//
// No backend yet - AuthContext.signup() calls the mock api.signup(), which
// just echoes the form back as a "created" user. Swapping in a real API
// later only means changing api.signup()'s body in mockData.js.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { PrimaryButton } from '../../components/UI';
import AuthLogo from './AuthLogo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

const initialForm = {
  fullName: '', username: '', email: '', phone: '', address: '', password: '', confirmPassword: '',
};

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

  const errors = {
    fullName: form.fullName.trim().length < 2 ? 'Enter your full name.' : null,
    username: form.username.trim().length < 3 ? 'Min 3 characters.' : null,
    email: !EMAIL_REGEX.test(form.email) ? 'Enter a valid email address.' : null,
    phone: !PHONE_REGEX.test(form.phone) ? 'Enter a valid phone number.' : null,
    address: form.address.trim().length < 5 ? 'Enter your address.' : null,
    password: form.password.length < 8 ? 'At least 8 characters.' : null,
    confirmPassword: form.confirmPassword !== form.password ? 'Passwords do not match.' : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSignup = async () => {
    setTouched({
      fullName: true, username: true, email: true, phone: true,
      address: true, password: true, confirmPassword: true,
    });
    if (hasErrors) return;
    setSubmitting(true);
    try {
      await signup({
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
    } catch (err) {
      Alert.alert('Sign up failed', 'Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    Alert.alert('Continue with Google', 'This sign-in method isn’t built yet in this scaffold.');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <AuthLogo compact />
      </View>

      <ScrollView contentContainerStyle={styles.sheet} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create your account</Text>

        <View style={styles.row}>
          <Field
            style={{ flex: 1 }}
            label="Full Name"
            placeholder="John Doe"
            value={form.fullName}
            onChangeText={(v) => setField('fullName', v)}
            onBlur={() => markTouched('fullName')}
            error={touched.fullName && errors.fullName}
          />
          <Field
            style={{ flex: 1 }}
            label="Username"
            placeholder="johndoe98"
            value={form.username}
            onChangeText={(v) => setField('username', v)}
            onBlur={() => markTouched('username')}
            error={touched.username && errors.username}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.row}>
          <Field
            style={{ flex: 1 }}
            label="Email Address"
            placeholder="john@example.com"
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            onBlur={() => markTouched('email')}
            error={touched.email && errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Field
            style={{ flex: 1 }}
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChangeText={(v) => setField('phone', v)}
            onBlur={() => markTouched('phone')}
            error={touched.phone && errors.phone}
            keyboardType="phone-pad"
          />
        </View>

        <Field
          label="Full Address"
          placeholder="Enter your site or home address"
          value={form.address}
          onChangeText={(v) => setField('address', v)}
          onBlur={() => markTouched('address')}
          error={touched.address && errors.address}
          multiline
          numberOfLines={2}
        />

        <View style={styles.row}>
          <Field
            style={{ flex: 1 }}
            label="Password"
            placeholder="At least 8 characters"
            value={form.password}
            onChangeText={(v) => setField('password', v)}
            onBlur={() => markTouched('password')}
            error={touched.password && errors.password}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowPassword((s) => !s)}
          />
          <Field
            style={{ flex: 1 }}
            label="Confirm Password"
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChangeText={(v) => setField('confirmPassword', v)}
            onBlur={() => markTouched('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword}
            secureTextEntry={!showConfirm}
            rightIcon={showConfirm ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowConfirm((s) => !s)}
          />
        </View>

        <PrimaryButton
          title={submitting ? 'Creating account...' : 'Create Account'}
          onPress={handleSignup}
          loading={submitting}
          style={{ marginTop: spacing.md }}
        />

        <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerTextAccent}>Login</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerLink} onPress={handleGoogle}>
          <Text style={styles.footerText}>or continue with <Text style={styles.footerTextAccent}>Google</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, error, rightIcon, onRightIconPress, style, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputWrapError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          {...inputProps}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name={rightIcon} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy },
  top: { paddingTop: 60, paddingBottom: 24, alignItems: 'center' },
  sheet: {
    flexGrow: 1, backgroundColor: colors.white, borderTopLeftRadius: radius.xl * 1.4,
    borderTopRightRadius: radius.xl * 1.4, padding: spacing.xl, paddingBottom: spacing.xxxl,
  },
  heading: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.lg, textAlign: 'center' },
  row: { flexDirection: 'row', gap: spacing.md },
  field: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, fontSize: 12, marginBottom: spacing.sm, color: colors.textPrimary },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    minHeight: 46, paddingHorizontal: spacing.md, gap: spacing.sm,
  },
  inputWrapError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 14, color: colors.textPrimary, paddingVertical: 10 },
  errorText: { color: colors.danger, fontSize: 11, marginTop: 5 },
  footerLink: { marginTop: spacing.sm, alignItems: 'center' },
  footerText: { color: colors.textSecondary, fontSize: 13 },
  footerTextAccent: { color: colors.orange, fontWeight: '700' },
});
