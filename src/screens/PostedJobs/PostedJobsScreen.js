// src/screens/PostedJobs/PostedJobsScreen.js
//
// One screen serves both "posted jobs.png" and "completed jobs.png" - they
// are the same Job Management screen with a different tab selected
// (Active vs Completed). Real tab-switching state (`useState`), not two
// separate screens, since the designs show a single segmented control.
//
// Grouping: Active jobs are grouped by status ("Opened", "Assigned").
// Completed jobs are grouped by status ("Completed", "Cancelled"). We
// derive both groupings from the same flat `jobs` array with a small
// `groupBy` helper so adding a new status later is just a data change.

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { api } from '../../data/mockData';
import { Badge, Card, PrimaryButton } from '../../components/UI';

const STATUS_TONE = {
  Opened: 'info',
  Assigned: 'warning',
  Completed: 'success',
  Cancelled: 'danger',
};

// Display-only wording for the status badge, per design ("In Progress" /
// "Finished") - the underlying job.status strings stay as Opened/Assigned/
// Completed/Cancelled since grouping and the action-button logic key off them.
const STATUS_LABEL = {
  Assigned: 'In Progress',
  Completed: 'Finished',
};

function groupBy(jobs, keyFn) {
  const groups = {};
  jobs.forEach((job) => {
    const key = keyFn(job);
    if (!groups[key]) groups[key] = [];
    groups[key].push(job);
  });
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function PostedJobsScreen({ navigation }) {
  const [tab, setTab] = useState('active'); // 'active' | 'completed'
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.getJobs().then(setJobs);
  }, []);

  const sections = useMemo(() => {
    const filtered = jobs.filter((j) => j.tab === tab);
    return groupBy(filtered, (j) => j.status);
  }, [jobs, tab]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Job Management</Text>
        <View style={styles.segmentWrap}>
          <TouchableOpacity
            style={[styles.segment, tab === 'active' && styles.segmentActive]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.segmentText, tab === 'active' && styles.segmentTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, tab === 'completed' && styles.segmentActive]}
            onPress={() => setTab('completed')}
          >
            <Text style={[styles.segmentText, tab === 'completed' && styles.segmentTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="briefcase-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No {tab} jobs yet.</Text>
          </View>
        }
        renderSectionHeader={({ section: { title, data } }) => (
          <Text style={styles.sectionHeader}>{title} ({data.length})</Text>
        )}
        renderItem={({ item }) => <JobCard job={item} navigation={navigation} />}
      />
    </View>
  );
}

function JobCard({ job, navigation }) {
  return (
    <Card style={styles.jobCard}>
      <View style={styles.jobCardTop}>
        <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
        <Badge label={STATUS_LABEL[job.status] || job.status} tone={STATUS_TONE[job.status] || 'neutral'} />
      </View>
      <Text style={styles.jobMeta}>{job.category} \u00b7 {job.address}</Text>
      <Text style={styles.jobMeta}>
        {job.tab === 'active' ? `Posted ${job.postedAt}` : `Closed ${job.completedAt}`}
      </Text>

      <View style={styles.jobActions}>
        {job.status === 'Opened' && (
          <PrimaryButton
            title={`View quotes (${job.quotesCount || 0})`}
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Quotes')}
          />
        )}
        {job.status === 'Assigned' && (
          <PrimaryButton
            title="Message pro"
            variant="outline"
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Messages')}
          />
        )}
        {job.status === 'Completed' && (
          <PrimaryButton
            title="View pro"
            variant="outline"
            style={styles.actionBtn}
            onPress={() => navigation.navigate('ProProfile', { proId: job.proId })}
          />
        )}
        {job.status === 'Cancelled' && (
          <PrimaryButton
            title="View Details"
            variant="outline"
            style={styles.actionBtn}
            onPress={() =>
              Alert.alert(
                job.title,
                `${job.category} · ${job.address}\nCancelled ${job.completedAt}`
              )
            }
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { ...typography.h2, color: colors.white, marginTop: spacing.sm },
  segmentWrap: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.pill,
    padding: 4, marginTop: spacing.lg,
  },
  segment: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.pill, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.orange },
  segmentText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 13 },
  segmentTextActive: { color: colors.white },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  sectionHeader: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  jobCard: { marginBottom: spacing.md },
  jobCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  jobTitle: { ...typography.bodyBold, flex: 1, marginRight: spacing.sm },
  jobMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  jobActions: { marginTop: spacing.md },
  actionBtn: { height: 42 },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.sm },
  emptyText: { color: colors.textMuted },
});
