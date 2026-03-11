import { Stack } from "expo-router";

export default function homeDeliveryProgressLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="index"
            />
        </Stack>    
    )

}