// src/screens/Home/HomeScreen.js
//
// Layout (top to bottom), matching "Home page.png":
//   - Dark navy header: greeting + user's name, notification bell, avatar
//   - Hero photo banner (verified-builders pill + heading + subtext)
//   - White panel overlapping the header/body boundary: service search,
//     location field, "Post a Job" CTA
//   - "Our Services" grid (6 categories -> pre-fills post-a-job step 1's
//     category; icons/labels come from mockData's SERVICE_CATEGORIES,
//     which is out of scope for this visual-only pass)
//   - "Your posted jobs" horizontal preview (-> Posted Jobs tab)
//   - "Elite professionals" list (-> Quotes tab / Pro Profile) and a trust
//     badges strip - below the fold in the design export, kept as-is
//
// Data comes from src/data/mockData.js via the `api` facade so this screen
// never needs to change when a real backend is wired in.

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, radius, typography, shadow, CURRENCY } from '../../constants/theme';
import { api } from '../../data/mockData';
import { StarRating, Badge, Card, PrimaryButton } from '../../components/UI';
import { useJobForm } from '../../context/JobFormContext';
import { useAuth } from '../../context/AuthContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=70';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pros, setPros] = useState([]);
  const [search, setSearch] = useState('');
  const { updateDraft } = useJobForm();
  const { user } = useAuth();

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
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.greetingName}>{user?.name || 'there'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => Alert.alert('Notifications', "This screen isn’t built yet in this scaffold.")}
            >
              <Ionicons name="notifications" size={20} color={colors.white} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>

        <ImageHero />
      </SafeAreaView>

      <View style={styles.searchPanel}>
        <View style={styles.fieldRow}>
          <Ionicons name="search" size={18} color={colors.orange} />
          <TextInput
            placeholder="What services do you need?"
            placeholderTextColor={colors.placeholder}
            style={styles.fieldInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.fieldRow}>
          <Ionicons name="location" size={18} color={colors.orange} />
          <Text style={styles.locationText}>London, UK</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </View>
        <PrimaryButton
          title="Post a Job"
          iconRight="add"
          style={styles.postJobBtn}
          onPress={() => navigation.navigate('PostJobStep1')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Services grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('All Services', "This screen isn’t built yet in this scaffold.")}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} style={styles.gridItem} onPress={() => startJobWithCategory(c)}>
              <View style={styles.gridIconBubble}>
                <MaterialCommunityIcons name={c.icon} size={24} color={colors.orange} />
              </View>
              <Text style={styles.gridLabel} numberOfLines={2}>{c.label}</Text>
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
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Elite professionals</Text>
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
                <Text style={styles.proService}>{pro.service} · {pro.experience}</Text>
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

function ImageHero() {
  return (
    <View style={styles.heroWrap}>
      <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
      <View style={styles.heroOverlay} />
      <View style={styles.heroContent}>
        <View style={styles.heroPill}>
          <View style={styles.heroPillDot} />
          <Text style={styles.heroPillText}>5,000+ Verified Builders</Text>
        </View>
        <Text style={styles.heroTitle}>Find Trusted Builders Near You</Text>
        <Text style={styles.heroSubtitle}>Get free quotes from verified professionals in minutes.</Text>
      </View>
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
  header: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  greetingName: { color: colors.white, fontSize: 22, fontWeight: '700', marginTop: 2 },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.orange, borderWidth: 1, borderColor: colors.navy,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.orange },

  heroWrap: { marginTop: spacing.lg, borderRadius: radius.xl, overflow: 'hidden', height: 220 },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,28,50,0.35)' },
  heroContent: { flex: 1, justifyContent: 'flex-end', padding: spacing.lg },
  heroPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4, marginBottom: spacing.sm,
  },
  heroPillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 6 },
  heroPillText: { color: colors.orange, fontSize: 11, fontWeight: '700' },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: '800', lineHeight: 28 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: spacing.sm },

  searchPanel: {
    backgroundColor: colors.white, marginHorizontal: spacing.lg, marginTop: -spacing.xxl,
    borderRadius: radius.xl, padding: spacing.lg, ...shadow.card, gap: spacing.md,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.md, paddingHorizontal: spacing.md, height: 48, gap: spacing.sm,
  },
  fieldInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  locationText: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  postJobBtn: { marginTop: spacing.xs },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  seeAll: { color: colors.orange, fontWeight: '600', fontSize: 13, textDecorationLine: 'underline' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  gridItem: {
    width: '22.5%', aspectRatio: 0.85, backgroundColor: colors.navy, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center', padding: spacing.xs,
  },
  gridIconBubble: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs,
  },
  gridLabel: { fontSize: 11, fontWeight: '700', color: colors.white, textAlign: 'center' },

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
