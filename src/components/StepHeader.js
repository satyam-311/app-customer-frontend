// src/components/StepHeader.js
//
// The 4-step "Post a Job" flow all share the same header: back/close button,
// title, and a step-progress bar (4 segments, filled up to current step).
// Pulled out into one component so the 4 step screens stay focused on their
// own form logic.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../constants/theme';

export default function StepHeader({ step, totalSteps = 4, title, onBack, onClose }) {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={26} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Step {step} of {totalSteps}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View key={i} style={[styles.segment, i < step && styles.segmentActive]} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  stepLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  title: { ...typography.h2, color: colors.white, marginTop: spacing.md },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: spacing.lg },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  segmentActive: { backgroundColor: colors.orange },
});
