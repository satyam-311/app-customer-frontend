// src/screens/Quotes/QuotesScreen.js
//
// Shows professionals matching the current search/service ("quotes.png").
// This is one of the 5 bottom tabs (labeled "Pro's" in the tab bar). Each
// card navigates to the shared root-stack "ProProfile" screen with the
// pro's id as a param - that screen doesn't care which tab pushed it.
//
// Rendered as a 2-column photo-card grid per the design (previously a
// 1-column list). Skill tags shown in the design aren't in mockData.js
// yet - deferred, see the Pass-1 audit follow-up.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { api } from '../../data/mockData';
import { PrimaryButton } from '../../components/UI';

export default function QuotesScreen({ navigation }) {
  const [pros, setPros] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProfessionals().then(setPros);
  }, []);

  const filtered = pros.filter((p) =>
    (p.name + p.service).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Pros near you</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search by name or service..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
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
  headerTitle: { ...typography.h2, color: colors.white, marginTop: spacing.sm },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, paddingHorizontal: spacing.md, height: 46, marginTop: spacing.lg,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary, fontSize: 14 },
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
