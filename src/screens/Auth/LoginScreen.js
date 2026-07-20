// src/screens/Auth/LoginScreen.js
//
// Matches the "Log in" export in design figma/logo animation 3.png: navy
// top section with the logo, a white rounded-top sheet with an
// email-or-phone field, a password field, and a Login button.
//
// No backend yet - AuthContext.login() calls the mock api.login(), which
// accepts any well-formed identifier + password. Swapping in a real API
// later only means changing api.login()'s body in mockData.js.

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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const errors = {
    identifier:
      identifier.trim().length === 0
        ? 'Enter your email or phone number.'
        : !EMAIL_REGEX.test(identifier) && !PHONE_REGEX.test(identifier)
        ? 'Enter a valid email or phone number.'
        : null,
    password: password.length < 6 ? 'Password must be at least 6 characters.' : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleLogin = async () => {
    setTouched({ identifier: true, password: true });
    if (hasErrors) return;
    setSubmitting(true);
    try {
      await login(identifier.trim(), password);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
    } catch (err) {
      Alert.alert('Login failed', 'Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <AuthLogo />
      </View>

      <ScrollView contentContainerStyle={styles.sheet} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Welcome back</Text>

        <Field
          label="Email or Phone"
          placeholder="john@example.com"
          value={identifier}
          onChangeText={setIdentifier}
          onBlur={() => setTouched((t) => ({ ...t, identifier: true }))}
          error={touched.identifier && errors.identifier}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Field
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={touched.password && errors.password}
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? 'eye-off' : 'eye'}
          onRightIconPress={() => setShowPassword((s) => !s)}
        />

        <PrimaryButton
          title={submitting ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          loading={submitting}
          style={{ marginTop: spacing.md }}
        />

        <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerText}>
            New here? <Text style={styles.footerTextAccent}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, error, rightIcon, onRightIconPress, ...inputProps }) {
  return (
    <View style={styles.field}>
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
  top: { paddingTop: 90, paddingBottom: 40, alignItems: 'center' },
  sheet: {
    flexGrow: 1, backgroundColor: colors.white, borderTopLeftRadius: radius.xl * 1.4,
    borderTopRightRadius: radius.xl * 1.4, padding: spacing.xl, paddingTop: spacing.xxl,
  },
  heading: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xl, textAlign: 'center' },
  field: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, fontSize: 13, marginBottom: spacing.sm, color: colors.textPrimary },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    height: 48, paddingHorizontal: spacing.md, gap: spacing.sm,
  },
  inputWrapError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 14, color: colors.textPrimary },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },
  footerLink: { marginTop: spacing.xl, alignItems: 'center' },
  footerText: { color: colors.textSecondary, fontSize: 13 },
  footerTextAccent: { color: colors.orange, fontWeight: '700' },
});
