import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text, TouchableOpacity } from 'react-native';
import StatsScreen from '../../src/components/StatsScreen';
import { globalStyles } from '../../src/styles/global';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Link, useRouter } from 'expo-router';

export default function StatsTab() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
        ]}
      >
        <View style={styles.center}>
          <Text style={styles.title}>Acesso às Estatísticas</Text>
          <Text style={styles.message}>
            Para visualizar as estatísticas você precisa criar uma conta e entrar.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/signup')}>
              <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
            <Link href="/login" style={styles.link}>
              <Text style={styles.linkText}>Já tenho conta</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginBottom: 18,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: globalStyles.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  link: {
    marginLeft: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkText: {
    color: globalStyles.primaryColor,
    fontWeight: '600',
    fontSize: 15,
  },
});
