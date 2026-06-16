import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '@/src/styles/global';

export default function BackButton({ label = 'Voltar' }: { label?: string }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
      <Text style={styles.text}>‹ {label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  text: {
    color: globalStyles.primaryColor,
    fontSize: 16,
    fontWeight: '600',
  },
});
