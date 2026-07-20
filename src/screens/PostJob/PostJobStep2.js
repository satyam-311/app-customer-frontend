// src/screens/PostJob/PostJobStep2.js
//
// Step 2: free-text job description + optional photos (up to 5).
// Uses expo-image-picker for a real device photo picker/camera - falls
// back gracefully (shows an alert) if permission is denied.
//
// Validation: description must be at least 10 characters before
// "Continue" is enabled - short enough to not be annoying, long enough
// to filter out empty/junk submissions.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { useJobForm } from '../../context/JobFormContext';
import StepHeader from '../../components/StepHeader';
import { PrimaryButton } from '../../components/UI';

const MAX_PHOTOS = 5;
const MIN_DESCRIPTION_LENGTH = 10;

export default function PostJobStep2({ navigation }) {
  const { draft, updateDraft } = useJobForm();
  const [description, setDescription] = useState(draft.description);

  const canContinue = description.trim().length >= MIN_DESCRIPTION_LENGTH;

  const handleDescriptionChange = (text) => {
    setDescription(text);
    updateDraft({ description: text });
  };

  const pickImage = async () => {
    if (draft.photos.length >= MAX_PHOTOS) {
      Alert.alert('Limit reached', `You can attach up to ${MAX_PHOTOS} photos.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to attach pictures of the job.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      updateDraft({ photos: [...draft.photos, result.assets[0].uri] });
    }
  };

  const removePhoto = (uri) => {
    updateDraft({ photos: draft.photos.filter((p) => p !== uri) });
  };

  return (
    <View style={styles.screen}>
      <StepHeader
        step={2}
        title="Describe the job"
        onBack={() => navigation.goBack()}
        onClose={() => navigation.navigate('MainTabs')}
      />

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Job description</Text>
        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholder="E.g. Kitchen faucet has been dripping for a week, water pools under the sink..."
          placeholderTextColor={colors.placeholder}
          value={description}
          onChangeText={handleDescriptionChange}
          maxLength={600}
        />
        <Text style={styles.charCount}>{description.length}/600</Text>
        {description.length > 0 && description.trim().length < MIN_DESCRIPTION_LENGTH && (
          <Text style={styles.errorText}>Please add a little more detail (at least {MIN_DESCRIPTION_LENGTH} characters).</Text>
        )}

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Photos (optional)</Text>
        <Text style={styles.helper}>Photos help pros give you a more accurate quote.</Text>

        <View style={styles.photoGrid}>
          {draft.photos.map((uri) => (
            <View key={uri} style={styles.photoWrap}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removePhoto(uri)}>
                <Ionicons name="close" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
          {draft.photos.length < MAX_PHOTOS && (
            <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
              <Ionicons name="camera" size={22} color={colors.orange} />
              <Text style={styles.addPhotoLabel}>Add photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Continue" disabled={!canContinue} onPress={() => navigation.navigate('PostJobStep3')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  label: { ...typography.bodyBold, marginBottom: spacing.sm },
  helper: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.md },
  textarea: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, minHeight: 140, fontSize: 14, color: colors.textPrimary,
  },
  charCount: { alignSelf: 'flex-end', color: colors.textMuted, fontSize: 11, marginTop: 4 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  photoWrap: { width: 84, height: 84, borderRadius: radius.md, overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  addPhoto: {
    width: 84, height: 84, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.orange,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.orangeLight,
  },
  addPhotoLabel: { color: colors.orange, fontSize: 10, fontWeight: '600', marginTop: 4 },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
