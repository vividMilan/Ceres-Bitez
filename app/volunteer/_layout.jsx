import { Stack } from "expo-router";

export default function volunteerLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
        </Stack>
    )
}