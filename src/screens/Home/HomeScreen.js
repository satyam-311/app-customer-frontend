// src/screens/Home/HomeScreen.js
//
// Layout (top to bottom), matching "Home page.png":
//   - Dark navy header: greeting + profile avatar (-> Profile stack screen)
//   - Search bar (floats over the header/body boundary)
//   - "Post a Job" CTA banner
//   - Services grid (6 categories -> pre-fills post-a-job step 1's category)
//   - "Your posted jobs" horizontal preview (-> Posted Jobs tab)
//   - "Elite professionals" list (-> Quotes tab / Pro Profile)
//   - Trust badges strip
//
// Data comes from src/data/mockData.js via the `api` facade so this screen
// never needs to change when a real backend is wired in.

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, radius, typography, shadow, CURRENCY } from '../../constants/theme';
import { api } from '../../data/mockData';
import { StarRating, Badge, Card, ServiceIcon } from '../../components/UI';
import { useJobForm } from '../../context/JobFormContext';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pros, setPros] = useState([]);
  const [search, setSearch] = useState('');
  const { updateDraft } = useJobForm();

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getJobs().then((all) => setJobs(all.filter((j) => j.tab === 'active').slice(0, 3)));
    api.getProfessionals().then((all) => setPros(all.slice(0, 4)));
  }, []);

  const startJobWithCategory = (category) => {
    updateDraft({ category });
    navigation.navigate('PostJobStep1');
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning \ud83d\udc4b</Text>
            <Text style={styles.greetingName}>Let's get something fixed</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search for a service..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Post a Job CTA */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('PostJobStep1')}>
          <Card style={styles.ctaCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitle}>Need something done?</Text>
              <Text style={styles.ctaSubtitle}>Post a job and get quotes from verified pros in minutes.</Text>
            </View>
            <View style={styles.ctaButton}>
              <Ionicons name="add" size={22} color={colors.white} />
            </View>
          </Card>
        </TouchableOpacity>

        {/* Services grid */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} style={styles.gridItem} onPress={() => startJobWithCategory(c)}>
              <ServiceIcon name={c.icon} />
              <Text style={styles.gridLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Posted jobs preview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your posted jobs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PostedJobs')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={jobs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(j) => j.id}
          contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.lg }}
          renderItem={({ item }) => (
            <Card style={styles.jobPreviewCard}>
              <Badge
                label={item.status}
                tone={item.status === 'Opened' ? 'info' : 'success'}
              />
              <Text style={styles.jobPreviewTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.jobPreviewMeta}>{item.postedAt}</Text>
            </Card>
          )}
        />

        {/* Elite professionals */}
        <Text style={styles.sectionTitle}>Elite professionals</Text>
        {pros.map((pro) => (
          <TouchableOpacity
            key={pro.id}
            onPress={() => navigation.navigate('ProProfile', { proId: pro.id })}
          >
            <Card style={styles.proRow}>
              <Image source={{ uri: pro.avatar }} style={styles.proAvatar} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={styles.row}>
                  <Text style={styles.proName}>{pro.name}</Text>
                  {pro.verified && <Ionicons name="checkmark-circle" size={15} color={colors.success} style={{ marginLeft: 4 }} />}
                </View>
                <Text style={styles.proService}>{pro.service} \u00b7 {pro.experience}</Text>
                <StarRating rating={pro.rating} reviewCount={pro.reviews} size={12} />
              </View>
              <Text style={styles.proPrice}>{`${CURRENCY}${pro.rate}/hr`}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Trust badges */}
        <View style={styles.trustStrip}>
          <TrustBadge icon="shield-check" label="Verified Pros" />
          <TrustBadge icon="cash-check" label="Secure Payments" />
          <TrustBadge icon="headset" label="24/7 Support" />
        </View>
      </ScrollView>
    </View>
  );
}

function TrustBadge({ icon, label }) {
  return (
    <View style={styles.trustBadge}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.navy} />
      <Text style={styles.trustLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  greetingName: { color: colors.white, fontSize: 19, fontWeight: '700', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.orange },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, paddingHorizontal: spacing.md, height: 48, marginTop: spacing.xl,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary, fontSize: 14 },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.navy, marginTop: -spacing.xl,
  },
  ctaTitle: { color: colors.white, fontSize: 16, fontWeight: '700' },
  ctaSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 4, lineHeight: 17 },
  ctaButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center', marginLeft: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl },
  seeAll: { color: colors.orange, fontWeight: '600', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '30%', alignItems: 'center', marginBottom: spacing.lg },
  gridLabel: { marginTop: spacing.sm, fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  jobPreviewCard: { width: 160 },
  jobPreviewTitle: { ...typography.bodyBold, marginTop: spacing.sm },
  jobPreviewMeta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  proRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  proAvatar: { width: 52, height: 52, borderRadius: 26 },
  proName: { ...typography.bodyBold },
  proService: { color: colors.textSecondary, fontSize: 12, marginTop: 2, marginBottom: 4 },
  proPrice: { ...typography.bodyBold, color: colors.orange },
  trustStrip: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, ...shadow.card,
  },
  trustBadge: { alignItems: 'center', gap: 6 },
  trustLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
});
