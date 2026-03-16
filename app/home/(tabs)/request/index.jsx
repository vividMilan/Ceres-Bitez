import { getUserData } from "@/app/(auth)/authController/authMethods";
import Spinner from "@/components/Spinner";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { collection, doc, GeoPoint, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function index() {

    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [qty, setQty] = useState()
    const [vegOrNonVeg, setVegOrNonVeg] = useState(null)
    const [description, setDescription] = useState("")
    const [currentLocation, setCurrentLocation] = useState(null)
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [home, setHome] = useState(null)

    const today = new Date()

    const {userData, loading: userDataLoading} = getUserData()

    const urlBuilder = (latitude, longitude) => {
        return (`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`)
    }



    const router = useRouter()

        useEffect(() => {
        getCurrentLocation()
    }, [])

    useEffect(() => {
        const fetchHomeDetails = async () => {
            try {
                const homeSnap = await getDoc(doc(db, "home", userData.uid))

                setHome(homeSnap.data())

            } catch (error) {
                console.log(error.message)
            }
        } 

        fetchHomeDetails()
    }, [userData])

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
            const {status} = await Location.requestForegroundPermissionsAsync()

            if (status !== "granted") {
                Alert.alert("Location Permission is Required")
                return
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest
            })

            const {latitude, longitude} = location.coords

            setCurrentLocation({latitude, longitude})
            fetchAddress(latitude, longitude)
        } catch (err) {
            console.log(err.message)
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const requestFood = async (item) => {
        const newRequestRef = doc(collection(db, "requests"));

        await setDoc(newRequestRef, {
            qty: item.qty,
            veg: item.vegOrNonVeg === "veg" ? true : false,
            date: item.date,
            type: "home",
            status: "pending",
            createdAt: serverTimestamp(),
            home : {
                homeId: userData.uid,
                location: new GeoPoint(
                    item.currentLocation.latitude,
                    item.currentLocation.longitude
                ),
                city: city,
                address: address,
                name: home.name
            },
            description: item.description || ""
        })

        // console.log("Add Successfully");
        Alert.alert("Request Submitted Successfully");

        setQty("");
        setVegOrNonVeg(null);
        setDate(null);
    };

    const handleAddRequest = async () => {
        setLoading(true)

        if (!qty || !vegOrNonVeg || !date) {
            Alert.alert("Please fill all required fields")
            setLoading(false)
            return
        }

        if (!currentLocation) {
            Alert.alert("Location not ready. Please wait...")
            setLoading(false)
            return
        }

        const request = {
            qty: Number(qty),
            vegOrNonVeg,
            date,
            description,
            currentLocation
        }

        try {
            await requestFood(request)
            setDate(new Date())
            setQty(0)
            setVegOrNonVeg(null)
            setDescription("")
            router.navigate("/home/(tabs)/home")
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (userDataLoading) {
        return (
            <Spinner text="Loading..." />
        )
    }


    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Request Food</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                onChangeText={setQty}
            />
            <View style={globalStyles.dropDownContainer}>
                <Picker onValueChange={(value) => setVegOrNonVeg(value)}>
                    <Picker.Item
                        label="Select Food Type"
                        value=""
                        style={Colors.default.inputText}
                    />
                    <Picker.Item label="Veg" value="veg" />
                    <Picker.Item label="Non-Veg" value="non-veg" />
                </Picker>
            </View>
            <TouchableOpacity onPress={() => setShow(true)} style={[globalStyles.input, globalStyles.flexDisplay]} >
                <Text style={[globalStyles.regularText, {color: Colors.default.inputText}]}>
                    {date ? date.toDateString() : "Select Date"}
                </Text>
                <Entypo name="calendar" size={16} />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date" 
                    onChange={onChange}
                    minimumDate={today}
                />
            )}

            <TextInput 
                editable
                multiline
                numberOfLines={6}
                maxLength={100}
                onChangeText={setDescription}
                value={description}
                style={globalStyles.input}
                placeholder="If there are any special instructions"
                placeholderTextColor="grey"
            />
                <View style={{marginBottom: 20}}>
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
            <TouchableOpacity onPress={handleAddRequest} style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>{loading ? "Processing..." : "Submit Request"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}