import { FontProvider } from '@/context/FontContext';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {

  return (
    <FontProvider>
      <Stack />
    </FontProvider>
  );
}
