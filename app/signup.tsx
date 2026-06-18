import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { signupAPI } from '@/src/utils/handle-api';
import { useAuthStore } from '@/src/store/useAuthStore';
import BackButton from '@/components/ui/back-button';
import { globalStyles } from '@/src/styles/global';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleSignup = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const data = await signupAPI({ name, email, password });
      setAuth(data.token, data.user);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      {/* Back button for non-tab flows */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro</Text>
        <Text style={styles.headerSubtitle}>Crie sua conta para começar a usar.</Text>
      </View>

      <View style={styles.card}>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Criar Conta</Text>}
        </TouchableOpacity>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Já tem uma conta?</Text>
          <Link href="/login" style={styles.linkButton}>
            <Text style={styles.linkText}>Entrar</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#5C6BC0',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: '#D8DAF3',
    fontSize: 16,
  },
  card: {
    margin: 24,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E6F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FBFBFF',
    color: globalStyles.textColor,
  },
  primaryButton: {
    backgroundColor: '#5C6BC0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomTextContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkButton: {
    marginLeft: 6,
  },
  linkText: {
    color: '#5C6BC0',
    fontSize: 14,
    fontWeight: '700',
  },
  topBack: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topBackText: {
    color: '#5C6BC0',
    fontSize: 16,
    fontWeight: '600',
  },
});
