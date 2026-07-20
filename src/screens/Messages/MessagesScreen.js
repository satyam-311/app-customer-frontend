// src/screens/Messages/MessagesScreen.js
//
// Chat list ("messages.png"). Each chat is joined with its professional
// record (avatar/name) since the mock CHATS array only stores `proId`.
// Tapping a row pushes "ChatThread" with the chat id.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { api } from '../../data/mockData';

export default function MessagesScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [pros, setPros] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getChats().then(setChats);
    api.getProfessionals().then((list) => {
      const byId = {};
      list.forEach((p) => { byId[p.id] = p; });
      setPros(byId);
    });
  }, []);

  const rows = chats
    .map((chat) => ({ ...chat, pro: pros[chat.proId] }))
    .filter((row) => row.pro)
    .filter((row) => row.pro.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={rows}
        keyExtractor={(row) => row.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('ChatThread', { chatId: item.id })}
          >
            <Image source={{ uri: item.pro.avatar }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={styles.rowTop}>
                <Text style={styles.name}>{item.pro.name}</Text>
                <Text style={styles.time}>{item.lastMessageAt}</Text>
              </View>
              <View style={styles.rowBottom}>
                <Text style={[styles.lastMessage, item.unread > 0 && styles.unreadText]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
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
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 56 + spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { ...typography.bodyBold },
  time: { color: colors.textMuted, fontSize: 11 },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  lastMessage: { color: colors.textSecondary, fontSize: 13, flex: 1, marginRight: spacing.sm },
  unreadText: { color: colors.textPrimary, fontWeight: '600' },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  unreadBadgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
});
