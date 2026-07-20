// App.js
//
// Entry point. Order matters here:
//   SafeAreaProvider  - so useSafeAreaInsets()/SafeAreaView work everywhere
//     AuthProvider     - signed-in user, needs to wrap the stack since
//                         Splash reads it to decide Login vs MainTabs
//       JobFormProvider  - post-a-job draft state, needs to wrap the stack
//                           since the 4 steps live at the root-stack level
//         NavigationContainer
//           RootNavigator

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import { JobFormProvider } from './src/context/JobFormContext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <JobFormProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </JobFormProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
