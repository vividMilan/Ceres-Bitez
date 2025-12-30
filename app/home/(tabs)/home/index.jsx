import Chip from "@/components/Chip";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const requestStatus =[
    "Ongoing",
    "Assigned",
    "Pending"
]

const homeDetails = {
    name: "Suhhinda Elders Home",
    address: "123, Main Street, City",
    location: "Mirihana",
}

const requestDetails = [
    {
        id: "REQ123456",
        date: "2023-10-15",
        status: requestStatus[0],
        qty: 30,
        description: "Requesting 30 meals for the elderly residents.",
        ngo: "Helping Hands NGO",
        image: "https://as1.ftcdn.net/v2/jpg/02/60/12/88/1000_F_260128861_Q2ttKHoVw2VrmvItxyCVBnEyM1852MoJ.jpg",
        location: "Nugegoda"
    },
    
    {
        id: "REQ123456",
        date: "2023-10-45",
        status: requestStatus[1],
        qty: 30,
        description: "asdfasdfasdfasdf",
        ngo: "Example NGO",
        image: "https://media.licdn.com/dms/image/v2/C561BAQEKvdShFoK9EQ/company-background_10000/company-background_10000/0/1630334532945/esala_foundation_cover?e=1767625200&v=beta&t=PKRkYkMT5YNrAw_qHTF8zFfnrNz0QQLVxueCK9FYx4o",
        location: "Mirihana"

    },
    
    {
        id: "REQ123456",
        date: "2023-10-78",
        status: requestStatus[2],
        qty: 30,
        description: "adgggdddgggdgdg",
        ngo: "Friends NGO",
        image: "https://assets.impactpool.org/cdn-cgi/image/height=,quality=75,format=auto,fit=cover/logos/friends-international-4c88775f-7cc4-4114-8d1b-cc1c45a1488b.png",
        location: "Kirulapona"
    },
    
]

export default function index() {

    const [selected, setSelected] = useState("Ongoing");

    const renderRequest = ({ item }) => {
        return (
                <TouchableOpacity 
                    style={styles.shopCard}
                    key={item.id}
                    // onPress={() => router.push({
                    //     pathname: "/NGO/requestDetails",
                    //     params: {
                    //         requestId: item.id,
                    //         homeId: item.homeData?.id,
                    //         homeName: item.homeData?.name,
                    //         homeImage: item.homeData?.image,
                    //         homeLocation: item.homeData?.location,
                    //         requestDate: item.date
                    //     }
                    // })}
                >

                    <Image source={{uri: item.image}} style={{width:"100%", height: 200, borderRadius: 5}}/>

                    <View style={styles.title}>
                        <Text style={styles.shopName}>{item.ngo}</Text>
                    </View>
                    <View style={styles.ratingRow}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                            <MaterialIcons name="group" size={16} color="black" />
                            <Text style={{color: "black", fontFamily: fonts.semiBold}}>{item.qty}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                            <Entypo name="calendar" size={16} color="black" />
                            <Text style={{color: "#565556D"}}>{item.date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        )
    }


    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>{homeDetails.name}</Text>
            <Text style={globalStyles.subTitleText}>{selected} Orders</Text>
            <View>
                <Chip 
                    options={requestStatus}
                    selected={selected}
                    onPress={setSelected}
                />
            </View>
            <FlatList 
                data={requestDetails.filter((req) => req.status === selected)}
                id={(item) => item.id}
                renderItem={renderRequest}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    shopCard: {
        backgroundColor: "#D9D9D9",
        flexDirection: "column",
        width: "100%",
        height: "fit-content",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20
    },
    shopName: {
        fontSize: 18,
        fontFamily: fonts.semiBold,
    },
    title: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    }
});