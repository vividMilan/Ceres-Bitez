import Accordian from '@/components/Accordian';
import PageTitleWithBackButton from '@/components/PageTitleWithBackButton';
import { fonts } from '@/constants/fonts';
import { globalStyles } from '@/constants/globalStyle';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function OrderSummery() {
    
    const {shopName, order} = useLocalSearchParams()
    
    const parsedOrder = order ? JSON.parse(order) : []
    
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [request, setRequest] = useState([])
    
    const orderDetail = [
        {
            shopName,
            order: parsedOrder    
        }
    ]
    
   
    const urlBuilder = (latitude, longitude) => {
        return (`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`)
    }

    const fetchAddress = async (latitude, longitude) => {
        try {
            const url = urlBuilder(latitude, longitude)
            const response = await fetch(url)
            const data = await response.json()

            const name = data.results[0].name ?? data.results[0].street
            const suburb = data.results[0].suburb

            setAddress(name)
            setCity(suburb)

            console.log(name)
            console.log(`City: ${suburb}`)
            
        } catch (error) {
            console.log(error)
        }
    }

    const getCurrentLocation = async () => {
        try {
            setLoading(true)
            const { status } = await Location.requestForegroundPermissionsAsync()

            if (status !== "granted") {
                return
            }

            const fetchedLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            })

            const {latitude, longitude} = fetchedLocation.coords

            fetchAddress(latitude, longitude)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCurrentLocation()
        setRequest(orderDetail)
    }, [])

    const router = useRouter()
    return (
        <View style={globalStyles.container}>
            <ScrollView stickyHeaderIndices={[0]} >
                <PageTitleWithBackButton 
                    heading={"Summery"}
                />
                <View>
                    <View style={{marginBottom: 20}}>
                        <Text style={[globalStyles.subTitleText]}>Address</Text>
                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                <FontAwesome6 name="location-dot" size={36} color="black" />
                                <View>
                                    {
                                        address && city ? (
                                            <>
                                                <Text style={{fontFamily: fonts.regular}}>{address}</Text>
                                                <Text style={{fontFamily: fonts.regular}}>{city}</Text>
                                            </>
                                        ): (
                                            <Text>Loading....</Text>
                                        )
                                    }
                                </View>
                            </View>

                            <MaterialIcons name="navigate-next" size={44} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        {request.map((orderDetail, index) => (
                            <Accordian 
                                key={index}
                                shopName={orderDetail.shopName}
                                orders={orderDetail.order}
                            />
                        ))}
                    </View>
                    <View style={{marginBottom: 20}}>
                        <Text style={[globalStyles.subTitleText]}>Price</Text>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 20, fontFamily: fonts.regular}}>Fish Rice & Curry</Text>
                            <Text style={{fontSize: 20, fontFamily: fonts.regular}}>150.00</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 20, fontFamily: fonts.regular}}>Egg Hoppers</Text>
                            <Text style={{fontSize: 20, fontFamily: fonts.regular}}>200.00</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>Total</Text>
                            <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>150.00</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <TouchableOpacity 
                style={[globalStyles.button, {marginTop: "auto"}]} 
                onPress={() => 
                    router.push({
                       pathname: "/student/(tabs)/home/checkout",
                       params: {
                        request: JSON.stringify(request)
                       } 
                    })
                }
            >
                <Text style={globalStyles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee"
    }
})