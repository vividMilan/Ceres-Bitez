import { Stack } from "expo-router";

export default function OrderStackLayout() {
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name="index"
            />
            <Stack.Screen name = "(deliveryProgress)/progress1"/>
            <Stack.Screen name = "(deliveryProgress)/progress2"/>
            <Stack.Screen name = "(deliveryProgress)/progress3"/>
            <Stack.Screen name = "(deliveryProgress)/progress4"/>
            <Stack.Screen name = "(deliveryProgress)/progress5"/>
        </Stack>
    )
}