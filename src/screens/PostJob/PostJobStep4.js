// src/screens/PostJob/PostJobStep4.js
//
// Step 4: final review before posting. Each section has an edit (pencil)
// icon that jumps straight back to the relevant step -- using `navigate`
// (not `goBack` repeatedly) so it's a direct hop regardless of how the
// user got here.
//
// On submit: calls api.postJob(draft) (mock, returns a fake created job
// with an id), resets the draft via resetDraft(), and navigates back to
// the Posted Jobs tab so the user immediately sees their new job in the
// list context. Uses `reset` (not `navigate`) to clear the post-a-job
// stack history so the back button doesn't return into the flow.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { useJobForm } from '../../context/JobFormContext';
import { api } from '../../data/mockData';
import StepHeader from '../../components/StepHeader';
import { PrimaryButton, Card } from '../../components/UI';

export default function PostJobStep4({ navigation }) {
  const { draft, resetDraft } = useJobForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.postJob({
        title: draft.description.slice(0, 60),
        category: draft.category?.label,
        description: draft.description,
        photos: draft.photos,
        address: draft.address,
        addressDetails: draft.addressDetails,
        coordinates: draft.coordinates,
      });
      resetDraft();
      // Reset the whole navigation state to MainTabs -> PostedJobs so the
      // back stack doesn't contain the 4 post-job screens anymore.
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs', state: { routes: [{ name: 'PostedJobs' }] } }],
        })
      );
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StepHeader
        step={4}
        title="Review your job"
        onBack={() => navigation.goBack()}
        onClose={() => navigation.navigate('MainTabs')}
      />

      <ScrollView contentContainerStyle={styles.body}>
        <ReviewSection
          label="Category"
          onEdit={() => navigation.navigate('PostJobStep1')}
        >
          <View style={styles.row}>
            <Ionicons name="pricetag" size={16} color={colors.orange} />
            <Text style={styles.value}>{draft.category?.label || 'Not set'}</Text>
          </View>
        </ReviewSection>

        <ReviewSection label="Description" onEdit={() => navigation.navigate('PostJobStep2')}>
          <Text style={styles.value}>{draft.description || 'Not set'}</Text>
          {draft.photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
              {draft.photos.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.photo} />
              ))}
            </ScrollView>
          )}
        </ReviewSection>

        <ReviewSection label="Location" onEdit={() => navigation.navigate('PostJobStep3')}>
          <View style={styles.row}>
            <Ionicons name="location" size={16} color={colors.orange} />
            <Text style={styles.value}>{draft.address || 'Not set'}</Text>
          </View>
          {!!draft.addressDetails && <Text style={styles.subValue}>{draft.addressDetails}</Text>}
        </ReviewSection>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={18} color={colors.info} />
          <Text style={styles.noticeText}>
            Once posted, verified pros nearby will be notified and can send you quotes directly in Messages.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={submitting ? 'Posting...' : 'Post job'}
          onPress={handleSubmit}
          loading={submitting}
        />
      </View>
    </View>
  );
}

function ReviewSection({ label, children, onEdit }) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>{label}</Text>
        <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="pencil" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  cardLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  value: { ...typography.body, color: colors.textPrimary, flexShrink: 1 },
  subValue: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  photo: { width: 64, height: 64, borderRadius: radius.sm, marginRight: spacing.sm },
  noticeCard: {
    flexDirection: 'row', backgroundColor: colors.infoBg, borderRadius: radius.md,
    padding: spacing.md, gap: spacing.sm, alignItems: 'flex-start',
  },
  noticeText: { flex: 1, color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
