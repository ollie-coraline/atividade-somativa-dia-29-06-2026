import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import StatsScreen from '../../src/components/StatsScreen';
import { globalStyles } from '../../src/styles/global';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function StatsTab() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <StatsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
});
