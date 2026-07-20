// src/navigation/MainTabNavigator.js
//
// Bottom tab bar: Home, Quotes ("Pro's"), Post a Job (center FAB), Posted
// Jobs, Messages.
//
// The "Post a Job" tab is a special case: tapping it should push the
// 4-step creation flow onto the *root* stack (so it gets its own back
// history, a close button, etc.) rather than becoming a tab with its own
// content. We do that by giving it a dummy screen component (never
// actually shown) and a `tabPress` listener that calls
// `e.preventDefault()` + `navigation.navigate('PostJobStep1')` on the
// parent stack.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

import HomeScreen from '../screens/Home/HomeScreen';
import QuotesScreen from '../screens/Quotes/QuotesScreen';
import PostedJobsScreen from '../screens/PostedJobs/PostedJobsScreen';
import MessagesScreen from '../screens/Messages/MessagesScreen';

const Tab = createBottomTabNavigator();

// Never rendered - tabPress is intercepted below - but a component is
// required by the navigator.
function PostJobPlaceholder() {
  return <View />;
}

// Custom button for the center FAB tab item.
function FabButton({ children, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.fabWrap}>
      <View style={styles.fab}>{children}</View>
    </TouchableOpacity>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={{
          tabBarLabel: "Pro's",
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PostJobTab"
        component={PostJobPlaceholder}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => <Ionicons name="add" size={30} color={colors.white} />,
          tabBarButton: (props) => <FabButton {...props} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // stop it from trying to "select" this tab
            navigation.navigate('PostJobStep1');
          },
        })}
      />
      <Tab.Screen
        name="PostedJobs"
        component={PostedJobsScreen}
        options={{
          tabBarLabel: 'Posted Job',
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
  },
  label: { fontSize: 11, fontWeight: '600' },
  fabWrap: {
    top: -22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
