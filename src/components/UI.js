// src/components/UI.js
//
// Small, dumb, reusable presentational components used across many screens.
// Keeping them together in one file is fine at this app's size; split into
// separate files if this grows past ~10 components.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadow } from '../constants/theme';

// ---- StarRating -----------------------------------------------------------
export function StarRating({ rating, size = 14, showValue = true, reviewCount }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => {
        let name = 'star-outline';
        if (i <= full) name = 'star';
        else if (i === full + 1 && hasHalf) name = 'star-half';
        return <Ionicons key={i} name={name} size={size} color={colors.star} style={{ marginRight: 1 }} />;
      })}
      {showValue && <Text style={[styles.ratingText, { fontSize: size - 1 }]}>{rating.toFixed(1)}</Text>}
      {reviewCount != null && <Text style={styles.reviewCount}>({reviewCount})</Text>}
    </View>
  );
}

// ---- Badge (small pill label, e.g. "Verified", "Opened") ------------------
export function Badge({ label, tone = 'orange', icon }) {
  const tones = {
    orange: { bg: colors.orangeLight, fg: colors.orange },
    success: { bg: colors.successBg, fg: colors.success },
    info: { bg: colors.infoBg, fg: colors.info },
    danger: { bg: colors.dangerBg, fg: colors.danger },
    neutral: { bg: colors.border, fg: colors.textSecondary },
    navy: { bg: colors.navy, fg: colors.white },
    successSolid: { bg: colors.success, fg: colors.white },
  };
  const t = tones[tone] || tones.orange;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      {icon && <Ionicons name={icon} size={11} color={t.fg} style={{ marginRight: 4 }} />}
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

// ---- PrimaryButton ---------------------------------------------------------
export function PrimaryButton({ title, onPress, loading, disabled, variant = 'solid', style, icon, iconRight, color }) {
  const isOutline = variant === 'outline';
  const isLight = variant === 'light';
  const accent = color || colors.orange;
  const fgColor = isLight ? colors.textPrimary : isOutline ? accent : colors.white;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.btn,
        isOutline ? [styles.btnOutline, { borderColor: accent }] : isLight ? styles.btnLight : [styles.btnSolid, { backgroundColor: accent }],
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fgColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={fgColor} style={{ marginRight: 8 }} />}
          <Text style={[styles.btnText, { color: fgColor }]}>{title}</Text>
          {iconRight && <Ionicons name={iconRight} size={18} color={fgColor} style={{ marginLeft: 8 }} />}
        </>
      )}
    </TouchableOpacity>
  );
}

// ---- Avatar -----------------------------------------------------------------
export function Avatar({ uri, size = 44, verified }) {
  return (
    <View style={{ width: size, height: size }}>
      <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.border }} />
      {verified && (
        <View style={[styles.verifiedDot, { width: size * 0.32, height: size * 0.32, borderRadius: size * 0.16 }]}>
          <Ionicons name="checkmark" size={size * 0.2} color={colors.white} />
        </View>
      )}
    </View>
  );
}

// ---- ScreenHeader (dark navy header used on most stack screens) -----------
export function ScreenHeader({ title, onBack, right }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={26} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 26 }} />
      )}
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <View style={{ width: 26, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ---- ServiceIcon (category grid icon bubble) ------------------------------
export function ServiceIcon({ name, size = 26, color = colors.orange, bg = colors.orangeLight, containerSize = 56 }) {
  return (
    <View style={{
      width: containerSize, height: containerSize, borderRadius: containerSize / 2,
      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
    }}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}

// ---- Card wrapper with consistent shadow/radius ---------------------------
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 4, color: colors.textPrimary, fontWeight: '600' },
  reviewCount: { marginLeft: 4, color: colors.textMuted, fontSize: 12 },
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill,
  },
  badgeText: { ...typography.tiny },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 52, borderRadius: radius.md, paddingHorizontal: spacing.lg,
  },
  btnSolid: { backgroundColor: colors.orange },
  btnOutline: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.orange },
  btnLight: { backgroundColor: colors.orangeLight },
  btnText: { ...typography.bodyBold },
  verifiedDot: {
    position: 'absolute', bottom: -2, right: -2, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white,
  },
  header: {
    backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl, paddingBottom: spacing.lg,
  },
  headerTitle: { ...typography.h3, color: colors.white, flex: 1, textAlign: 'center' },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg,
    ...shadow.card,
  },
});
