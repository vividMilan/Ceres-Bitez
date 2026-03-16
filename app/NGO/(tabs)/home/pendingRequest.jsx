import Spinner from "@/components/Spinner";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { auth, db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, GeoPoint, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function pendingRequest() {

    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState(null)

    const ngoId = auth.currentUser.uid
 
    const router = useRouter();

    const requestDate = request?.date?.toDate
  ? request.date.toDate().toLocaleDateString()
  : "No date";

    const { requestId } =
        useLocalSearchParams();

    useEffect(() => {
        const fetchRequest = async () => {

            if (!requestId) return

            try {

                setLoading(true)

                const requestSnap = await getDoc(doc(db, "requests", requestId))

                if (!requestSnap.exists()) return

                const data = {
                    requestId: requestSnap.id,
                    ...requestSnap.data()
                }

                setRequest(data)

            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRequest()
    }, [requestId])

    useEffect(() => {
        getCurrentLocation()
    }, [])

    const getCurrentLocation = async () => {
        try {
            setLoading(true)
            const {status} = await Location.requestForegroundPermissionsAsync()

            if (status !== "granted") {
                return
            }

            const fetchedLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            })

            const {latitude, longitude} = fetchedLocation.coords

            console.log("Current Location", fetchedLocation.coords)

            setLocation({latitude, longitude})
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    const getNGODetails = async (NGOId) => {
        try {
            const NGOSnap = await getDoc(doc(db, "ngo", NGOId));

            const NGO = NGOSnap.data();

            return NGO;
        } catch (error) {}
    };

    const handleAcceptRequest = async () => {
        try {
            const requestRef = doc(db, "requests", requestId);

            const NGO = await getNGODetails(auth.currentUser.uid);

            await updateDoc(requestRef, {
                status: "n-accepted",
                NGO: {
                    location: new GeoPoint(
                        location.latitude,
                        location.longitude
                    ),
                    ...NGO
                },
            });

            router.push({
                pathname: "/NGO/requests/availableRestuarants",
                params: {
                    requestId: requestId,
                },
            });
        } catch (error) {
            console.log(error)
        }
    };

    if (loading) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Spinner text="Loading request..." />
        </SafeAreaView>
    );
}

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{ flex: 1 }}>
                <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
                    {/* <Image
                        source={{ uri: homeImage }}
                        style={{ width: "100%", height: 200 }}
                    /> */}
                    <Text
                        style={[
                            globalStyles.titleText
                        ]}
                    >
                        Pending Request Details
                    </Text>
                </View>
                {/* Middle + Bottom Section */}
                <View
                    style={[
                        { paddingHorizontal: 20, flex: 1, justifyContent: "space-between" },
                    ]}
                >
                    <View style={{gap: 16}}>
                        <View style={globalStyles.flexDisplay}>
                            <FontAwesome name="home" size={24} color="black" />
                            <Text style={[fonts.regular, {fontSize: 20}]}>{request?.home?.name}</Text>
                        </View>
                        <View style={globalStyles.flexDisplay}>
                            <FontAwesome name="calendar" size={24} color="black" />
                            <Text style={[fonts.regular, {fontSize: 20}]}>{requestDate}</Text>
                        </View>
                        <View style={globalStyles.flexDisplay}>
                            <FontAwesome6 name="location-dot" size={24} color="black" />
                            <Text style={[fonts.regular, {fontSize: 20}]}>{request?.home?.city}</Text>
                        </View>
                        <View style={globalStyles.flexDisplay}>
                            <FontAwesome5 name="pen" size={24} color="black" />
                            <Text style={[fonts.regular, {fontSize: 20}]}>{request?.description}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={handleAcceptRequest}
                    >
                        <Text style={globalStyles.buttonText}>
                            Accept Request
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
