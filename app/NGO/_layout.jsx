import { Stack } from "expo-router";

export default function NgoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="requestDetails" options={{ headerShown: false }} />
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
        <Stack.Screen
        name="(deliveryProgress)/progress6"
        options={{ headerShown: false }}
      />
         <Stack.Screen
        name="(deliveryProgress)/progress7"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="(deliveryProgress)/progress8"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
