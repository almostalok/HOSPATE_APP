import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.root}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#000000" translucent={true} />
            <RootNavigator />
          </View>
        </SafeAreaProvider>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    ...(Platform.OS === 'web'
      ? {
          height: '100vh' as any,
          width: '100vw' as any,
          overflow: 'hidden' as any
        }
      : {})
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 520,
          marginHorizontal: 'auto' as any,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#1E293B'
        }
      : {})
  }
});
