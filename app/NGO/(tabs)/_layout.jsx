import { Colors } from "@/constants/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function NGOBottomTabs() {
    return (        
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ffff", 
                tabBarInactiveTintColor: "#9A97C8",
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: Colors.default.primary
                },
            }}
        >
            <Tabs.Screen name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({color, size}) => (
                        <Entypo name="home" size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen name="requests"
                options={{
                    title: "Requests",
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="file" size={size} color={color} />
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