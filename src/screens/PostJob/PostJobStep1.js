// src/screens/PostJob/PostJobStep1.js
//
// Step 1: pick a service category. Selection is written straight into the
// shared JobFormContext draft (`updateDraft({ category })`) so Step 2+ and
// the final review screen can all read `draft.category` without any prop
// drilling or route params.
//
// Validation: "Continue" is disabled until a category is chosen.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { api } from '../../data/mockData';
import { useJobForm } from '../../context/JobFormContext';
import StepHeader from '../../components/StepHeader';
import { PrimaryButton } from '../../components/UI';

export default function PostJobStep1({ navigation }) {
  const [categories, setCategories] = useState([]);
  const { draft, updateDraft } = useJobForm();

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const selectCategory = (cat) => updateDraft({ category: cat });

  const canContinue = !!draft.category;

  return (
    <View style={styles.screen}>
      <StepHeader
        step={1}
        title="What do you need done?"
        onBack={() => navigation.goBack()}
        onClose={() => navigation.navigate('MainTabs')}
      />

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.helper}>Choose the category that best matches your job.</Text>

        <View style={styles.grid}>
          {categories.map((cat) => {
            const selected = draft.category?.id === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => selectCategory(cat)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBubble, selected && styles.iconBubbleSelected]}>
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={26}
                    color={selected ? colors.white : colors.orange}
                  />
                </View>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          disabled={!canContinue}
          onPress={() => navigation.navigate('PostJobStep2')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  helper: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  option: {
    width: '48%', backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', marginBottom: spacing.md,
    borderWidth: 2, borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.orange, backgroundColor: colors.orangeLight },
  iconBubble: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.orangeLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  iconBubbleSelected: { backgroundColor: colors.orange },
  optionLabel: { ...typography.bodyBold, color: colors.textPrimary },
  optionLabelSelected: { color: colors.orange },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
