import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf")
  })

  if (!fontsLoaded) return null;

  return (
      <Stack screenOptions={{headerShown: false}}/>
  );
}
