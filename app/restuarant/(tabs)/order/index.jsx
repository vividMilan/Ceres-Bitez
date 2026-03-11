import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const progressStatus = [
    "r-accepted",
    "packed",
    "rv-accepted"
]

export default function Index() {

    const router = useRouter()

    const [requests, setRequests] = useState([])

    useEffect(() => {
        const q = query(
            collection(db, "requests"),
            where("status", "in", progressStatus)
        )

        const unsubscribe = onSnapshot(q, (snapShot) => {
            const data = []

            snapShot.forEach((doc) => {
                data.push({
                    requestId: doc.id,
                    ...doc.data()
                })
            })

            setRequests(data)
        }, (error) => {
            console.log(error.message)
        })

        return () => unsubscribe()
    }, [])

    const renderRequest = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: "/restuarant/(deliveryProgress)/",
                        params: {
                            requestId: item.requestId,
                        }
                    })
                }}

                style={{
                    width: "100%",
                    backgroundColor: "#d9c7f2",
                    padding: 24,
                    borderRadius: 34
                }}
            >
                <Image source={{uri: item.NGO?.imageUrl}} style={{width: "100%", height: 150, marginBottom: 10, borderRadius: 20}}  />
                <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                    {item.NGO?.name || "Unkown NGO"}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>
                Ongoing Requests
            </Text>

            <FlatList 
                data={requests}
                key={item => item.id}
                renderItem={renderRequest}
            />
        </SafeAreaView>
    )
}