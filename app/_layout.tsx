import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useAuthStore } from '@/src/store/useAuthStore';
import { globalStyles } from '../src/styles/global';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user } = useAuthStore();

  useEffect(() => {
    // Ignora estado inicial quando segments ainda não foi carregado
    if (segments.length === 0) return;

    // Redireciona com base no estado de autenticação
    const inTabsGroup = segments[0] === '(tabs)';
    const inPublicRoute = segments[0] === 'login' || segments[0] === 'signup';

    // Usa setTimeout para aguardar o router estar completamente pronto
    const navigationTimeout = setTimeout(() => {
      // Se não tem usuário e tenta acessar rota protegida, redireciona para login
      if (!user && inTabsGroup) {
        router.replace('/login');
      }
      // Se tem usuário e está em login/signup, redireciona para home
      else if (user && inPublicRoute) {
        router.replace('/(tabs)');
      }
    }, 0);

    return () => clearTimeout(navigationTimeout);
  }, [user, segments, router]);

  return (
    <GluestackUIProvider mode="dark">
      <Slot />
    </GluestackUIProvider>
  );
}
