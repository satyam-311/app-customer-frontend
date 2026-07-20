// src/screens/ProProfile/ProProfileScreen.js
//
// A tradesperson's public profile ("pro profile.png"): cover/avatar, name,
// rating, experience, about section, portfolio photo strip, and reviews
// below the fold (the design showed this cut off, so we've built out a
// reasonable "rest of the profile" - portfolio grid + review list -
// since a real profile screen needs somewhere for that content to live).
//
// Reads `route.params.proId` and looks the professional up via the api
// facade - this screen is pushed from Home, Quotes, and Posted Jobs
// (completed job's assigned pro), so it never assumes which screen sent
// it here.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography, CURRENCY } from '../../constants/theme';
import { api } from '../../data/mockData';
import { StarRating, Badge, Card, PrimaryButton, ScreenHeader } from '../../components/UI';

export default function ProProfileScreen({ route, navigation }) {
  const { proId } = route.params;
  const [pro, setPro] = useState(null);

  useEffect(() => {
    api.getProfessionalById(proId).then(setPro);
  }, [proId]);

  if (!pro) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  }

  const startChat = () => {
    // In this mock data model, chats are keyed by pro id; a real app would
    // look up (or create) the conversation server-side. We navigate
    // straight to the thread since our mock CHATS already has one per pro.
    navigation.navigate('ChatThread', { proId: pro.id });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Professional Profile" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: pro.avatar }} style={styles.avatar} />
            {pro.verified && (
              <View style={styles.proBadge}>
                <Ionicons name="checkmark-circle" size={12} color={colors.white} />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{pro.name}</Text>
          <Text style={styles.role}>{pro.title || pro.service}</Text>
          <StarRating rating={pro.rating} reviewCount={pro.reviews} size={15} />

          {(pro.licensed || pro.insured) && (
            <View style={styles.badgeRow}>
              {pro.licensed && (
                <View style={styles.pillBadge}><Text style={styles.pillBadgeText}>Licensed</Text></View>
              )}
              {pro.insured && (
                <View style={styles.pillBadge}><Text style={styles.pillBadgeText}>Insured</Text></View>
              )}
            </View>
          )}

          <View style={styles.statsRow}>
            <Stat label="Experience" value={pro.experience.replace(' experience', '')} />
            <Stat label="Rate" value={`${CURRENCY}${pro.rate}/hr`} />
            <Stat label="Location" value={pro.location} />
          </View>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{pro.about}</Text>
        </Card>

        {pro.portfolio.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pro.portfolio.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.portfolioImg} />
              ))}
            </ScrollView>
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews ({pro.reviews})</Text>
          {pro.reviewsList.length === 0 && <Text style={styles.emptyReviews}>No written reviews yet.</Text>}
          {pro.reviewsList.map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <StarRating rating={r.rating} showValue={false} size={12} />
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Message" icon="chatbubble-ellipses" onPress={startChat} />
      </View>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  profileTop: { alignItems: 'center', marginBottom: spacing.lg },
  avatarWrap: { marginBottom: spacing.md },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  proBadge: {
    position: 'absolute', bottom: -4, right: -4, flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.success, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 2, borderColor: colors.white,
  },
  proBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  name: { ...typography.h2 },
  role: { color: colors.orange, fontWeight: '700', marginTop: 2, marginBottom: spacing.sm },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  pillBadge: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: 6,
  },
  pillBadgeText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.lg, marginTop: spacing.lg, width: '100%', justifyContent: 'space-between',
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { ...typography.bodyBold },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  section: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  aboutText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  portfolioImg: { width: 100, height: 100, borderRadius: radius.md, marginRight: spacing.sm },
  emptyReviews: { color: colors.textMuted, fontSize: 13 },
  reviewRow: { marginBottom: spacing.md },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewName: { ...typography.bodyBold, fontSize: 13 },
  reviewText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
