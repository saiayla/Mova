import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastroPassageiro" options={{ headerShown: false }} />
        <Stack.Screen name="cadastroMotorista" options={{ headerShown: false }} />
        <Stack.Screen name="registroVeiculo" options={{ headerShown: false }} />
        <Stack.Screen name="solicitarViagem" options={{ headerShown: false }} />
        <Stack.Screen name="criarViagem" options={{ headerShown: false }} />
        <Stack.Screen name="veiculos" options={{ headerShown: false }} />
        <Stack.Screen name="perfilMotorista" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
