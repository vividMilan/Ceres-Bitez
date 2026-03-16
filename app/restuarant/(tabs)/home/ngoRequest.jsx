import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { auth, db } from "@/firebaseConfig";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ngoRequest() {
    const router = useRouter()

    const {name, imageUrl, date, quantity, selectedFood, home, requestId} = useLocalSearchParams()
    const [homeAddress, setHomeAddress] = useState("Loading...")

    let formatedDate = "No Date"

    const parsedSelectedFood = JSON.parse(selectedFood)
    const parsedHomeDetails = JSON.parse(home)

    const restuarantId = auth.currentUser.uid

    
    
    const fetchHomeAddress = async () => {
        try {
            if (parsedHomeDetails?.location) {
                const lat = parsedHomeDetails.location.latitude
                const lon = parsedHomeDetails.location.longitude
                
                const response = await fetch(
                    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`
                    
                );
                
                const data = await response.json();
                
                console.log(data)
                if (data.results && data.results.length > 0) {
                    const addressLine = data.results[0].address_line1;
                    
                    const city = data.results[0].city;
                    
                    const address = `${addressLine}, \n${city}`
                    
                    setHomeAddress(address);
                } else {
                    setHomeAddress("Address not found");
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    
    useEffect(() => {
        fetchHomeAddress()
    }, [])
    
    const handleAccept = async() => {
        try {
            const requestRef = doc(db, "requests", requestId)
            
            const restuarant = (await getDoc(doc(db, "restaurant", restuarantId))).data()
            
            await updateDoc(requestRef, {
                status: "r-accepted",
                restuarant: restuarant
            })
            
            Alert.alert("Successfully Accepted ✅")
            
            router.replace("/restuarant/(tabs)/home")
        } catch (err) {
            console.log(err)
        }
    }
    
    if (date) {
        try {
            const parsedDate = JSON.parse(date)
            const jsDate = new Date(parsedDate.seconds * 1000)
            formatedDate = jsDate.toDateString()
        } catch (err) {
            console.log(err)
        }
        
    }
    
    return (
        <SafeAreaView style={[{flex: 1}]}>
            <View style={{flex: 1, justifyContent: "space-between"}}>
                <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
                    <Text style={[globalStyles.titleText]}>{name}</Text>

                    <View style={[globalStyles.flexDisplay, globalStyles.marginBottom]}>
                        <Entypo name="calendar" size={24} color="black" />
                        <Text>{formatedDate}</Text>
                    </View>

                    <View style={[globalStyles.flexDisplay, globalStyles.marginBottom]}>
                        <Ionicons name="people-sharp" size={24} color="black" />
                        <Text>{quantity} People</Text>
                    </View>

                    {/* Selected Food */}
                    <Text style={[globalStyles.regularText, {fontFamily: fonts.semiBold, fontSize: 20}]}>
                        Selected Food
                    </Text>
                    <View style={{flexDirection: "row", gap: 12, paddingVertical: 12, borderRadius: 12, overflow: "hidden", elevation: 1, backgroundColor: "#e7e2e2ff"}}>
                        <Image source={{uri: parsedSelectedFood.imageUrl}} style={{width: 100, height: 100}} />
                        <View>
                            <Text style={{ fontFamily: fonts.semiBold }}>{parsedSelectedFood.name}</Text>
                            <Text style={{ fontFamily: fonts.regular, fontSize: 12, marginTop: 5 }}>
                                {parsedSelectedFood.vegNonVeg}
                            </Text>
                        </View>
                    </View>

                    {/* Home Details */}
                    <Text style={[globalStyles.regularText, {fontFamily: fonts.semiBold, fontSize: 20}]}>
                        Home Details
                    </Text>
                    <View style={{gap: 10}}>
                        <View style={globalStyles.flexDisplay}>
                            <Entypo name="home" size={24} color="black" />
                            <Text>{parsedHomeDetails.name}</Text>
                        </View>
                        <View style={globalStyles.flexDisplay}>
                            <FontAwesome6 name="location-dot" size={24} color="black" />
                            <Text>{homeAddress}</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Button at the bottom */}
                <View style={{padding: 20}}>
                    <TouchableOpacity 
                        style={globalStyles.button}
                        onPress={handleAccept}
                    >
                        <Text style={globalStyles.buttonText}>Accept Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}