import { Stack } from "expo-router";

export default function RequestStackLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
        </Stack>
    )
}