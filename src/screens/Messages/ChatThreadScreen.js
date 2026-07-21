// src/screens/Messages/ChatThreadScreen.js
//
// Individual chat thread ("messages-1.png"): text bubbles (mine vs theirs),
// timestamps, and an inline "Service Quote" card with Accept / Counter
// Offer buttons rendered as a special message type.
//
// Can be reached two ways:
//   - navigation.navigate('ChatThread', { chatId })   <- from Messages list
//   - navigation.navigate('ChatThread', { proId })    <- from Pro Profile
// so on mount we resolve whichever param was passed into a single `chat`
// object via the api facade.
//
// Sending a message is optimistic: it's appended locally via the mock
// `api.sendMessage`, which also happens to mutate the shared CHATS array
// so it "persists" for the rest of the session.

import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography, CURRENCY } from '../../constants/theme';
import { api } from '../../data/mockData';
import { ScreenHeader, PrimaryButton, Avatar } from '../../components/UI';

export default function ChatThreadScreen({ route, navigation }) {
  const { chatId, proId } = route.params || {};
  const [chat, setChat] = useState(null);
  const [pro, setPro] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    (async () => {
      const resolvedChat = chatId ? await api.getChatById(chatId) : await api.getChatByProId(proId);
      setChat(resolvedChat);
      if (resolvedChat) {
        const resolvedPro = await api.getProfessionalById(resolvedChat.proId);
        setPro(resolvedPro);
      }
    })();
  }, [chatId, proId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !chat) return;
    setInput('');
    setSending(true);
    const message = await api.sendMessage(chat.id, text);
    if (message) {
      setChat((prev) => ({ ...prev, messages: [...prev.messages, message] }));
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
    setSending(false);
  };

  const handleQuoteAction = (action) => {
    Alert.alert(action === 'accept' ? 'Quote accepted' : 'Counter offer', 
      action === 'accept'
        ? 'The pro has been notified you accepted their quote.'
        : 'Counter-offer flow would open here in a full build.');
  };

  if (!chat || !pro) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScreenHeader
        title={pro.name}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.navigate('ProProfile', { proId: pro.id })}>
            <Avatar uri={pro.avatar} size={30} />
          </TouchableOpacity>
        }
      />

      <FlatList
        ref={listRef}
        data={chat.messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          item.type === 'quote'
            ? <QuoteBubble item={item} onAction={handleQuoteAction} />
            : <TextBubble item={item} />
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.placeholder}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending || !input.trim()}>
          {sending ? <ActivityIndicator size="small" color={colors.white} /> : <Ionicons name="send" size={18} color={colors.white} />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function TextBubble({ item }) {
  const mine = item.from === 'me';
  return (
    <View style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{item.text}</Text>
      </View>
      <Text style={styles.timestamp}>{item.time}</Text>
    </View>
  );
}

function QuoteBubble({ item, onAction }) {
  const { quote } = item;
  return (
    <View style={styles.bubbleRow}>
      <View style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <Ionicons name="document-text" size={16} color={colors.orange} />
          <Text style={styles.quoteHeaderText}>Service Quote</Text>
        </View>
        <Text style={styles.quoteService}>{quote.service}</Text>
        <Text style={styles.quotePrice}>{CURRENCY}{quote.price}</Text>
        <Text style={styles.quoteMeta}>Estimated start: {quote.eta}</Text>
        <Text style={styles.quoteMeta}>{quote.note}</Text>
        <View style={styles.quoteActions}>
          <PrimaryButton title="Accept" style={styles.quoteBtn} onPress={() => onAction('accept')} />
          <PrimaryButton title="Counter Offer" variant="outline" style={styles.quoteBtn} onPress={() => onAction('counter')} />
        </View>
      </View>
      <Text style={styles.timestamp}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: spacing.lg, paddingBottom: spacing.lg },
  bubbleRow: { marginBottom: spacing.md, maxWidth: '85%' },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleTheirs: { backgroundColor: colors.orangePeach, borderBottomLeftRadius: 4 },
  bubbleMine: { backgroundColor: colors.navy, borderBottomRightRadius: 4 },
  bubbleText: { ...typography.body, color: colors.textPrimary },
  bubbleTextMine: { color: colors.white },
  timestamp: { color: colors.textMuted, fontSize: 10, marginTop: 4, marginHorizontal: 4 },
  quoteCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.orange,
    padding: spacing.lg, width: 260,
  },
  quoteHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  quoteHeaderText: { color: colors.orange, fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  quoteService: { ...typography.bodyBold, marginBottom: 2 },
  quotePrice: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  quoteMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  quoteActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  quoteBtn: { flex: 1, height: 40, paddingHorizontal: 0 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md, gap: spacing.sm,
    backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.background, borderRadius: radius.lg, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, maxHeight: 100, fontSize: 14, color: colors.textPrimary,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.navy,
    alignItems: 'center', justifyContent: 'center',
  },
});
