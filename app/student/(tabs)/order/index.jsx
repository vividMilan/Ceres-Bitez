import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

    const studentId = "czdMs8Z3GTXLTCbyExVKaXsOAa62"

    const router = useRouter()

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        const q = query(
            collection(db, "requests"),
            where("type", "==", "student"),
            where("student.studentId", "==", studentId),
            where("status", "!=", "delivered")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            
            const data = [] 
            
            snapshot.forEach((doc) => {
                data.push({
                    requestId: doc.id,
                    ...doc.data()
                })
            })

            setRequests(data)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [studentId])

    if (loading) {
        return (
            <SafeAreaView style={globalStyles.container}>
                <ActivityIndicator />
            </SafeAreaView>
        )
    }

    const renderRequests = ({ item }) => {
        return (
            <TouchableOpacity style={styles.requestCard} onPress={() => router.push({pathname: "/student/(deliveryProgress)", params: {requestId: item.requestId}})}>
                <Text style={{ fontSize: 20, fontFamily: fonts.semiBold }}>
                    {item.restuarant?.name}
                </Text>

                <Text
                    style={{
                        fontSize: 24,
                        fontFamily: fonts.semiBold,
                        marginTop: 5,
                    }}
                >
                    Rs. {item.totalPrice}
                </Text>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Ongoing Requests</Text>

            {
                requests.length > 0 
                ?
                    <FlatList data={requests} renderItem={renderRequests}></FlatList>
                : 
                    <Text style={globalStyles.subTitleText}>No Current Requests</Text>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    requestCard: {
        display: "flex",
        gap: 2,
        backgroundColor: Colors.default.greyBackground,
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
});
