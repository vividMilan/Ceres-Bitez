import { Stack } from "expo-router";

export default function RestuarantLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="(deliveryProgress)" options={{headerShown: false}} />
            <Stack.Screen name="(deliveryProgressStudent)" options={{headerShown: false}} />
        </Stack>
    )
}