// src/screens/PostedJobs/PostedJobsScreen.js
//
// One screen serves both "posted jobs.png" and "completed jobs.png" - they
// are the same Job Management screen with a different tab selected
// (Active vs Completed). Real tab-switching state (`useState`), not two
// separate screens, since the designs show a single underline-tab pair.
//
// Grouping: Active jobs are grouped by status ("Opened", "Assigned").
// Completed jobs are grouped by status ("Completed", "Cancelled"). We
// derive both groupings from the same flat `jobs` array with a small
// `groupBy` helper so adding a new status later is just a data change.
//
// The design's "Client: X" / "Professional: X" line and per-job button
// pairs aren't representable from the current job shape (no client-name
// field, and the two Completed cards in the design actually show
// different button labels per job, which would need a data flag that
// doesn't exist in mockData.js - out of scope for this visual pass). We
// approximate: the client is always the signed-in user (this is a
// customer app, so that's always true), and the professional's name is
// resolved from job.proId via api.getProfessionals() - both real facade
// calls, no invented data.

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../../constants/theme';
import { api } from '../../data/mockData';
import { Badge, Card, PrimaryButton } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const STATUS_TONE = {
  Opened: 'info',
  Assigned: 'navy',
  Completed: 'successSolid',
  Cancelled: 'danger',
};

// Display-only wording for the status badge, per design ("In Progress" /
// "Finished") - the underlying job.status strings stay as Opened/Assigned/
// Completed/Cancelled since grouping and the action-button logic key off them.
const STATUS_LABEL = {
  Assigned: 'In Progress',
  Completed: 'Finished',
};

const SECTION_ICON = {
  Completed: { name: 'checkmark-circle', color: colors.success },
  Cancelled: { name: 'close-circle', color: colors.danger },
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
  const [proNames, setProNames] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    api.getJobs().then(setJobs);
    api.getProfessionals().then((all) => {
      const map = {};
      all.forEach((p) => { map[p.id] = p.name; });
      setProNames(map);
    });
  }, []);

  const sections = useMemo(() => {
    const filtered = jobs.filter((j) => j.tab === tab);
    return groupBy(filtered, (j) => j.status);
  }, [jobs, tab]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => Alert.alert('Notifications', "This screen isn’t built yet in this scaffold.")}
            >
              <Ionicons name="notifications" size={18} color={colors.white} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TabButton label="Active" active={tab === 'active'} onPress={() => setTab('active')} />
          <TabButton label="Completed" active={tab === 'completed'} onPress={() => setTab('completed')} />
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
          <SectionHeader title={title} count={data.length} navigation={navigation} />
        )}
        renderItem={({ item }) => <JobCard job={item} clientName={user?.name} proName={proNames[item.proId]} navigation={navigation} />}
      />
    </View>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
    </TouchableOpacity>
  );
}

function SectionHeader({ title, count, navigation }) {
  const icon = SECTION_ICON[title];
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionHeaderLeft}>
        {icon ? (
          <Ionicons name={icon.name} size={22} color={icon.color} />
        ) : (
          <View style={[styles.countBadge, { backgroundColor: title === 'Assigned' ? colors.navy : colors.orange }]}>
            <Text style={styles.countBadgeText}>{count}</Text>
          </View>
        )}
        <Text style={styles.sectionHeader}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert(title, "This screen isn’t built yet in this scaffold.")}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}

function JobCard({ job, clientName, proName, navigation }) {
  const isCancelled = job.status === 'Cancelled';
  const isCompleted = job.status === 'Completed';
  const personLine = isCompleted && proName ? `Professional: ${proName}` : `Client: ${clientName || 'You'}`;

  return (
    <Card style={[styles.jobCard, { backgroundColor: isCancelled ? colors.cardTintRed : colors.cardTintBlue }, isCancelled && styles.jobCardCancelled]}>
      <View style={styles.jobCardTop}>
        <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
        <Badge label={STATUS_LABEL[job.status] || job.status} tone={STATUS_TONE[job.status] || 'neutral'} />
      </View>
      <Text style={styles.jobMeta}>{personLine}</Text>
      <View style={styles.jobMetaRow}>
        <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
        <Text style={styles.jobMeta}>
          {job.tab === 'active' ? `Posted ${job.postedAt}` : `Closed ${job.completedAt}`}
        </Text>
      </View>

      <View style={styles.jobActions}>
        {job.status === 'Opened' && (
          <>
            <PrimaryButton
              title="View Message"
              variant="outline"
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Messages')}
            />
            <PrimaryButton
              title="View Quote"
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Quotes')}
            />
          </>
        )}
        {job.status === 'Assigned' && (
          <>
            <PrimaryButton
              title="View Message"
              variant="outline"
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Messages')}
            />
            <PrimaryButton
              title="View Pro"
              style={styles.actionBtn}
              onPress={() => navigation.navigate('ProProfile', { proId: job.proId })}
            />
          </>
        )}
        {job.status === 'Completed' && (
          <>
            <PrimaryButton
              title="View Message"
              variant="outline"
              color={colors.success}
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Messages')}
            />
            <PrimaryButton
              title="View Pro"
              color={colors.success}
              style={styles.actionBtn}
              onPress={() => navigation.navigate('ProProfile', { proId: job.proId })}
            />
          </>
        )}
        {isCancelled && (
          <PrimaryButton
            title="View Details"
            variant="outline"
            color={colors.dangerAccent}
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
  header: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  headerTitle: { ...typography.h3, color: colors.white, flex: 1, marginLeft: spacing.md },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bellBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: colors.orange, borderWidth: 1, borderColor: colors.navy,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.orange },

  tabRow: { flexDirection: 'row', marginTop: spacing.xl },
  tab: { flex: 1, alignItems: 'center', paddingBottom: spacing.md },
  tabText: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: 17 },
  tabTextActive: { color: colors.orange },
  tabUnderline: { height: 2, width: '100%', backgroundColor: 'rgba(255,255,255,0.6)', marginTop: spacing.sm },
  tabUnderlineActive: { backgroundColor: colors.orange },

  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  countBadge: { minWidth: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  countBadgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  sectionHeader: { ...typography.h3, color: colors.textPrimary },
  viewAll: { color: colors.orange, fontWeight: '600', fontSize: 13, textDecorationLine: 'underline' },

  jobCard: { marginBottom: spacing.md },
  jobCardCancelled: { borderRightWidth: 4, borderRightColor: colors.dangerAccent },
  jobCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  jobTitle: { ...typography.bodyBold, flex: 1, marginRight: spacing.sm },
  jobMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  jobMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  jobActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, height: 42 },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.sm },
  emptyText: { color: colors.textMuted },
});
