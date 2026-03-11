import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function availableRestuarants() {

    const router = useRouter()
    
    const {requestId} = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [restaurants, setRestaurants] = useState([])
    

    useEffect(() => {
        const fetchRestuarants = async () => {
            try {
                //fetch request data
                const requestSnap = await getDoc(doc(db, "requests", requestId))
                const request = requestSnap.data()
                const requiredQty = request.qty
                const isVeg = request.veg

                // get all foods
                const foodsSnap = await getDocs(collection(db, "foods"))


                // get all restuarant IDs with suitable foods
                const restaurantIdSet = new Set()
                const foodsByRestuarant = {}
                

                // check for suitability
                foodsSnap.forEach((docSnap) => {
                    const food = docSnap.data()
                    const rid = food.restuarantId

                    if (food.quantity < requiredQty) return
                    if (isVeg && food.vegNonVeg != "Veg") return
                    if (food.notSuitableAt.toDate() > new Date()) return


                    // Track suitable foods per restuarant
                    if (!foodsByRestuarant[rid]) foodsByRestuarant[rid] = []
                    foodsByRestuarant[rid].push({ id: docSnap.id, ...food })

                    restaurantIdSet.add(rid)
                })

                const restaurantData = []

                for (const restuarantId of restaurantIdSet) {
                    const restuarantSnap = await getDoc(doc(db, "restaurants", restuarantId))

                    if (restuarantSnap.exists()) {
                        restaurantData.push({
                            requestId,
                            restuarantId,
                            ...restuarantSnap.data(),
                            suitableFoods: foodsByRestuarant[restuarantId]
                        })
                    }
                }

                setRestaurants(restaurantData)

                console.log(restaurantData)
                
            } catch (error) {
                console.log(error)
            } 
             finally {
                setLoading(false)
            }
        }

        fetchRestuarants()
    }, [requestId])

    const renderRestuarant = ({item}) => (
        <TouchableOpacity
            style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                marginBottom: 15,
                overflow: "hidden",
            }}
            onPress={() =>
                router.push({
                pathname: "/NGO/(tabs)/requests/restaurantFoods",
                params: { 
                    requestId: item.requestId,
                    restuarantId: item.restuarantId,
                    restuarantName: item.name,
                    restuarantImage: item.imageUrl,
                    suitableFoods: JSON.stringify(item.suitableFoods)
                },
                })
            }
        >

            <Image 
                source={{uri: item.imageUrl}}
                style={{ width: "100%", height: 150 }}
            />
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
                <Text>Contact: {item.mobile}</Text>
                <Text>Email: {item.email}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={[globalStyles.container, { padding: 10 }]}>
            <Text style={[globalStyles.titleText, { marginBottom: 10 }]}>
                Suitable Restaurants
            </Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : restaurants.length === 0 ? (
                <Text>No suitable restaurants found</Text>
            ) : (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.restuarantId}
                    renderItem={renderRestuarant}
                />
            )}
        </SafeAreaView>
    )
}