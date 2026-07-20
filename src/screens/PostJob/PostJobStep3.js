// src/screens/PostJob/PostJobStep3.js
//
// Step 3: where should the pro come? A draggable/tappable map pin plus an
// address form underneath. Two ways to set the pin:
//   1. Tap "Use current location" -> expo-location grabs GPS coords.
//   2. Tap anywhere on the map -> marker moves there.
// The street address field is a plain text input (in a production app this
// would be wired to a geocoding API to reverse-lookup from coordinates, or
// to forward-geocode a typed address into coordinates - left as a mock/
// manual entry for now, noted in a comment below).
//
// Validation: continue is disabled until both a marker position AND a
// non-empty address line exist.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { colors, spacing, radius, typography } from '../../constants/theme';
import { useJobForm } from '../../context/JobFormContext';
import StepHeader from '../../components/StepHeader';
import { PrimaryButton } from '../../components/UI';

// Default map center: New Delhi (matches the user's approximate region).
const DEFAULT_REGION = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function PostJobStep3({ navigation }) {
  const { draft, updateDraft } = useJobForm();
  const [region, setRegion] = useState(
    draft.coordinates
      ? { ...draft.coordinates, latitudeDelta: 0.02, longitudeDelta: 0.02 }
      : DEFAULT_REGION
  );
  const [address, setAddress] = useState(draft.address);
  const [addressDetails, setAddressDetails] = useState(draft.addressDetails);
  const [locating, setLocating] = useState(false);

  const canContinue = !!draft.coordinates && address.trim().length > 3;

  const useCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow location access to auto-fill your address.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      updateDraft({ coordinates: coords });

      // Reverse-geocode to a human readable address.
      const [place] = await Location.reverseGeocodeAsync(coords);
      if (place) {
        const line = [place.name, place.street, place.city].filter(Boolean).join(', ');
        setAddress(line);
        updateDraft({ address: line });
      }
    } catch (err) {
      Alert.alert('Couldn\u2019t get location', 'Please enter your address manually below.');
    } finally {
      setLocating(false);
    }
  };

  const onMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    updateDraft({ coordinates: coords });
  };

  const onAddressChange = (text) => {
    setAddress(text);
    updateDraft({ address: text });
  };

  const onDetailsChange = (text) => {
    setAddressDetails(text);
    updateDraft({ addressDetails: text });
  };

  return (
    <View style={styles.screen}>
      <StepHeader
        step={3}
        title="Where's the job?"
        onBack={() => navigation.goBack()}
        onClose={() => navigation.navigate('MainTabs')}
      />

      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onPress={onMapPress}
          showsUserLocation
        >
          {draft.coordinates && <Marker coordinate={draft.coordinates} pinColor={colors.orange} />}
        </MapView>

        <TouchableOpacity style={styles.locateBtn} onPress={useCurrentLocation} disabled={locating}>
          <Ionicons name="locate" size={16} color={colors.orange} />
          <Text style={styles.locateBtnText}>{locating ? 'Locating...' : 'Use current location'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Street address</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Main Street"
          placeholderTextColor={colors.placeholder}
          value={address}
          onChangeText={onAddressChange}
        />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Apartment / unit / notes (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Apt 4B, gate code 1234..."
          placeholderTextColor={colors.placeholder}
          value={addressDetails}
          onChangeText={onDetailsChange}
        />

        {!draft.coordinates && (
          <Text style={styles.errorText}>Tap the map or use current location to drop a pin.</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Continue" disabled={!canContinue} onPress={() => navigation.navigate('PostJobStep4')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  mapWrap: { height: 220, position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  locateBtn: {
    position: 'absolute', bottom: spacing.md, alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill, gap: 6, ...Platform.select({ ios: { shadowOpacity: 0.15, shadowRadius: 6 }, android: { elevation: 4 } }),
  },
  locateBtnText: { color: colors.orange, fontWeight: '600', fontSize: 12 },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  label: { ...typography.bodyBold, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    height: 48, paddingHorizontal: spacing.md, fontSize: 14, color: colors.textPrimary,
  },
  errorText: { color: colors.danger, fontSize: 12, marginTop: spacing.md },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});
