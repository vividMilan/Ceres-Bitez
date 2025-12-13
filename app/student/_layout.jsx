import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";

export default function StudentLayout() {
    return (
        <Tabs screenOptions={{headerShown: false}}>
            
            <Tabs.Screen 
                name="index" 
                options={{
                    title: "Home",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="home" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen 
                name="order" 
                options={{
                    title: "Orders",
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="border-color" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen 
                name="profile" 
                options={{
                    title: "Profile",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="user" size={size} color={color} />
                    )
                }}
            />

        </Tabs>
    )
}