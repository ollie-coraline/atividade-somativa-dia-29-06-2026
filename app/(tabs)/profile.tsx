import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { loginAPI, signupAPI, logoutAPI } from '../../src/utils/handle-api';
import { globalStyles } from '../../src/styles/global';

export default function ProfileScreen() {
  const { user, setAuth, logout } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const data = await loginAPI({ email, password });
        setAuth(data.token, data.user);
      } else {
        const data = await signupAPI({ name, email, password });
        setAuth(data.token, data.user);
      }
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.warn("Logout request failed, clearing local state anyway");
    } finally {
      logout();
    }
  };

  if (user) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user.name}</Text>
            
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{user.email}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Criar Conta'}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.disabledButton]} 
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleButtonText}>
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    paddingVertical: 12,
    backgroundColor: globalStyles.primaryColor,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: globalStyles.textColor,
  },
  primaryButton: {
    backgroundColor: '#5C6BC0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#5C6BC0',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    marginBottom: 12,
    textAlign: 'center',
  },
});
