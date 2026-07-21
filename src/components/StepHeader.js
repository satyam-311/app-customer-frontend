// src/components/StepHeader.js
//
// The 4-step "Post a Job" flow all share the same chrome: a navy bar with
// a back button and the static "Post a Job" title, one continuous
// progress bar (no gaps/segments - fill width is step/totalSteps), and a
// two-tone heading + paragraph introducing that step. Pulled out into one
// component so the 4 step screens stay focused on their own form logic
// and this only needs to match the design in one place.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../constants/theme';

export default function StepHeader({
  step, totalSteps = 4, heading, highlight, headingBreak, description, onBack,
}) {
  const pct = Math.min(100, Math.max(0, (step / totalSteps) * 100));
  return (
    <View>
      <SafeAreaView edges={['top']} style={styles.navy}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={26} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.navyTitle}>Post a Job</Text>
          <View style={{ width: 26 }} />
        </View>
      </SafeAreaView>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>

      <View style={styles.headingBlock}>
        {headingBreak ? (
          <>
            <Text style={styles.headingText}>{heading}</Text>
            {!!highlight && <Text style={[styles.headingText, styles.highlightText]}>{highlight}</Text>}
          </>
        ) : (
          <Text style={styles.headingText}>
            {heading}{!!highlight && ' '}
            {!!highlight && <Text style={styles.highlightText}>{highlight}</Text>}
          </Text>
        )}
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navy: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  navyTitle: { ...typography.h3, color: colors.white },
  progressTrack: { height: 4, backgroundColor: colors.background },
  progressFill: { height: 4, backgroundColor: colors.orange },
  headingBlock: { backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  headingText: { ...typography.h1, color: colors.textPrimary },
  highlightText: { color: colors.orange },
  description: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.sm, lineHeight: 19 },
});
