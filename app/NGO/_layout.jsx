import { Stack } from "expo-router";

export default function NGOLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="(deliveryProgress)" options={{headerShown: false}} />
        </Stack>
    )
}