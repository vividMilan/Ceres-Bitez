import { Colors } from "@/constants/theme";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";

export default function StudentTabLayout() {
    return (
        <Tabs screenOptions={{tabBarActiveTintColor: Colors.default.primary, headerShown: false}}>
            <Tabs.Screen 
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({color, size}) => (
                        <Entypo name="home" size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen 
                name="order"
                options={{
                    title: "Order",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="invoice-list" size={size} color={color}/>
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