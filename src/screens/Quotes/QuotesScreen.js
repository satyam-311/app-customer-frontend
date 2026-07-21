// src/screens/Quotes/QuotesScreen.js
//
// Shows professionals matching the current search/service ("quotes.png").
// This is one of the 5 bottom tabs (labeled "Pro's" in the tab bar). Each
// card navigates to the shared root-stack "ProProfile" screen with the
// pro's id as a param - that screen doesn't care which tab pushed it.
//
// Rendered as a 2-column photo-card grid per the design (previously a
// 1-column list) - that part is a close match to the design and is left
// untouched here. This pass only adds the header the design has above
// the grid: a static location line (no real location facade exists, so
// it's presentational chrome like the static titles elsewhere in the
// app), a bigger heading, a docked search button, and filter chips - the
// chips are built from the professionals' actual `service` values
// (Plumbing/Electrical/Carpentry/Painting) rather than inventing category
// data that doesn't exist in mockData.js.

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { api } from '../../data/mockData';
import { PrimaryButton } from '../../components/UI';

export default function QuotesScreen({ navigation }) {
  const [pros, setPros] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    api.getProfessionals().then(setPros);
  }, []);

  const services = useMemo(() => {
    const seen = new Set();
    return pros.map((p) => p.service).filter((s) => (seen.has(s) ? false : seen.add(s)));
  }, [pros]);

  const filtered = pros.filter((p) =>
    (p.name + p.service).toLowerCase().includes(search.toLowerCase())
    && (!selectedService || p.service === selectedService)
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.locationBlock}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.white} />
              <Text style={styles.locationTitle}>London, SW1A 1AA</Text>
            </View>
            <Text style={styles.locationSubtitle}>10 Downing Street</Text>
          </View>
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

        <Text style={styles.headerTitle}>Find the Perfect Pro</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search by trade or name..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <PrimaryButton title="Search" style={styles.searchBtn} onPress={() => {}} />
        </View>

        {!!services.length && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {services.map((service) => {
              const active = selectedService === service;
              return (
                <TouchableOpacity
                  key={service}
                  style={styles.chip}
                  onPress={() => setSelectedService(active ? null : service)}
                >
                  <Text style={styles.chipText}>{service}</Text>
                  {active && <Ionicons name="close" size={14} color={colors.orange} style={{ marginLeft: 4 }} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.proCard}>
            <View style={styles.photoWrap}>
              <Image source={{ uri: item.avatar }} style={styles.photo} />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={11} color={colors.star} />
                <Text style={styles.ratingBadgeText}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.roleLine} numberOfLines={1}>{item.title || item.service} \u00b7 {item.experience}</Text>
              {!!item.skills?.length && (
                <View style={styles.tagRow}>
                  {item.skills.slice(0, 2).map((skill) => (
                    <View key={skill} style={styles.tag}>
                      <Text style={styles.tagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              )}
              <PrimaryButton
                title="View Profile"
                variant="light"
                style={styles.viewBtn}
                onPress={() => navigation.navigate('ProProfile', { proId: item.id })}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationBlock: { flex: 1 },
  locationTitle: { color: colors.white, fontWeight: '700', fontSize: 15 },
  locationSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 20, marginTop: 1 },
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
  headerTitle: { ...typography.h1, color: colors.white, marginTop: spacing.lg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, paddingLeft: spacing.md, height: 52, marginTop: spacing.lg,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary, fontSize: 14 },
  searchBtn: { height: 52, borderRadius: radius.md, paddingHorizontal: spacing.lg },
  chipRow: { gap: spacing.sm, marginTop: spacing.md, paddingRight: spacing.lg },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  chipText: { color: colors.orange, fontWeight: '700', fontSize: 13 },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  row: { justifyContent: 'space-between' },
  proCard: {
    width: '48%', marginBottom: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
  },
  photoWrap: { width: '100%', aspectRatio: 1, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  ratingBadge: {
    position: 'absolute', top: spacing.sm, right: spacing.sm, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(16,24,40,0.65)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3, gap: 3,
  },
  ratingBadgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  cardBody: { padding: spacing.md },
  name: { ...typography.bodyBold, fontSize: 14 },
  roleLine: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm, marginBottom: spacing.sm },
  tag: { backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 3 },
  tagText: { fontSize: 9, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.3 },
  viewBtn: { height: 40, paddingHorizontal: spacing.sm },
});
