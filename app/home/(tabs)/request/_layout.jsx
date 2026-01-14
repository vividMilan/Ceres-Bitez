import { Stack } from "expo-router";

export default function RequestStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(deliveryProgress)/progress1"
        options={{ headerShown: false }}
      />
           <Stack.Screen
        name="(deliveryProgress)/progress2"
        options={{ headerShown: false }}
      />
          <Stack.Screen
        name="(deliveryProgress)/progress3"
        options={{ headerShown: false }}
      />
         <Stack.Screen
        name="(deliveryProgress)/progress4"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="(deliveryProgress)/progress5"
        options={{ headerShown: false }}
      />
     
    </Stack>
  );
}
