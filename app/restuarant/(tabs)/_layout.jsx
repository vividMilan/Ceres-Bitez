import { Colors } from "@/constants/theme";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function RestuarantBottomTabs() {
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
                name="food"
                options={{
                    title: "Food",
                    tabBarIcon: ({color, size}) => (
                        <Entypo name="circle-with-plus" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    )
}