import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { auth, db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const readyForDelivery = ["packed", "prepared"]

export default function index() {
    const mapRef = useRef(null);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const currentLocationRef = useRef(null)

    const fakeGPS = useRef(null);
    const [routeCoords, setRouteCoords] = useState([]);

    const [isOnline, setIsOnline] = useState(false);
    const [showRequestCard, setShowRequestCard] = useState(true);
    const [loading, setLoading] = useState(false);
    const [nearbyRequests, setNearbyRequests] = useState([]);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [currentRequest, setCurrentRequest] = useState(null)
    const [isBusy, setIsBusy] = useState(false);

    const acceptTimeout = useRef(null);

    const volunteerId = auth.currentUser.uid;

    const updateLocation = (coords) => {
        setCurrentLocation(coords)
        currentLocationRef.current = coords
    }

    const formatLocation = (geoPoint) => {
        if (!geoPoint) return null;

        return {
            latitude: geoPoint.latitude,
            longitude: geoPoint.longitude
        }
    }

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                const {status} =
                    await Location.requestForegroundPermissionsAsync()

                if (status !== "granted") {
                    Alert.alert("Location Permission is required")
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                })

                const {latitude, longitude} = location.coords

                const region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                }

                setCurrentRegion(region)
                updateLocation({latitude, longitude})

                const volunteerRef = doc(db, "volunteer", volunteerId)

                await updateDoc(volunteerRef, {
                    location: {
                        latitude,
                        longitude
                    }
                })

                mapRef.current?.animateToRegion(region, 500)

            } catch (error) {
                console.log("From getCurrentLocation : ", error)
            }
        }

        getCurrentLocation()
    }, [])

    useEffect(() => {

        if (!currentRequestId) return

        const fetchRequest = async () => {
            const requestSnap = await getDoc(doc(db, "requests", currentRequestId))
    
            const request = {
                requestId: requestSnap.id,
                ...requestSnap.data()
            }
    
            setCurrentRequest(request)
        }


        fetchRequest()


    }, [currentRequestId])

    const handleButton = async () => {
        try {
            const volunteerRef = doc(db, "volunteer", auth.currentUser.uid)

            if (volunteerRef) {
                await updateDoc(volunteerRef, {
                    isOnline: isOnline
                })
                setIsOnline(!isOnline)
            }
        } catch (error) {
            console.log("from: handleButton: ", error);
        }
    }


    const handleAccept = async () => {

        let newStatus = null

        const requestRef = doc(db, "requests", currentRequestId)

        const request = (await getDoc(requestRef)).data()

        if (request.type === "home") {
            if (request.status === "packed") {
                newStatus = "rv-accepted"
            }

            if (request.status === "prepared") {
                newStatus = "nv-accepted"
            }
        }

        if (request.type === "student") {
            if (request.status === "packed") {
                newStatus = "v-accepted"
            }
        }

        if (!newStatus) return;

        await updateDoc(requestRef, {
            status: newStatus,
            volunteerId: volunteerId
        })

        setIsBusy(true)
        setShowRequestCard(false)
        setIsOnline(false)
    }

    useEffect(() => {

        if (isOnline === false) return

        const q = query(
            collection(db, "requests"),
            where("status", "in", readyForDelivery)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = []
            snapshot.forEach((doc) => {
                requests.push({
                    requestId: doc.id,
                    ...doc.data()
                })
            })

            filterNearbyRequests(requests)
        })

        return () => unsubscribe()

    }, [isOnline])

    useEffect(() => {

        if(!currentRequestId) return


        const requestRef = doc(db, "requests", currentRequestId)

        const unsubscribe = onSnapshot(requestRef, (snapshot) => {
            if (!snapshot.exists()) return


            const request = {
                requestId: snapshot.id,
                ...snapshot.data()
            }
            
            setCurrentRequest(request)

            if (request.type === "home") {
                if (request.status === "rv-accepted") {
                    navigateToRestaurant(request)
                }

                if (request.status === "r-picked-up") {
                    navigateToNGO(request)
                }

                if (request.status === "nv-accepted") {
                    navigateToNGO(request)
                }

                if (request.status === "n-picked-up") {
                    navigateToHome(request)
                }
            }

            if (request.type === "student") {

                if (request.status === "v-accepted") {
                    navigateToRestaurant(request)
                }

                if (request.status === "picked") {
                    navigateToStudent(request)
                }
            }

        }) 

        return () => unsubscribe()

        

    }, [currentRequestId])

    const getRoute = async (start, end) => {
        if (!start || !end) return

        try {

            const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY

            const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`;

            const res = await fetch(url);
            const data = await res.json();

            const route = data.features[0].geometry.coordinates[0].map(
                ([lng, lat]) => ({
                latitude: lat,
                longitude: lng,
                })
            );

            setRouteCoords(route);

        } catch (error) {
            console.log(error.message)
        }
    }

    /*---------------------- Navigation Handling ----------------------*/

    const navigateToRestaurant = (request) => {
        getRoute(currentLocationRef.current, request.restuarant.location)
    }

    const navigateToNGO = (request) => {
        getRoute(currentLocationRef.current, request.NGO.location)
    }

    const navigateToHome = (request) => {
        getRoute(currentLocationRef.current, request.home.location)
    }

    const navigateToStudent = (request) => {
        getRoute(currentLocationRef.current, request.student.location)
    }

    const filterNearbyRequests = async (requests) => {
        if (!requests || !currentLocation) return

        const nearby = []
        
        for (const request of requests) {

            let destination = null

            if (request.type === "home") {
                if (request.status === "packed") {
                    destination = formatLocation(request.restuarant.location)
                }

                if (request.status === "prepared") {
                    destination = formatLocation(request.NGO.location)
                }
            }
            
            if (request.type === "student") {
                if (request.status === "packed") {
                    destination = formatLocation(request.restuarant.location)
                }

                if (request.status === "picked") {
                    destination = formatLocation(request.student.location)
                }   
            }

            if (!destination) continue

            
            const distance = await getDistanceKM(currentLocation, destination)

            if (distance < 10) {
                nearby.push({
                    requestId: request.requestId,
                    distance: distance,
                    ...request
                })

            }
        }


        // Sort the nearbyRequests distance acsending
        nearby.sort((a, b) => a.distance - b.distance)

        const formattedNearby = nearby.map(item => ({
            ...item,
            distance: item.distance.toFixed(2)
        }))
        
        setNearbyRequests(formattedNearby)

        console.log(formattedNearby)

        if (nearby.length) {
            setCurrentRequestId(formattedNearby[0].requestId)
            
            if (!currentRequestId) {
                setCurrentRequestId(formattedNearby[0].requestId)
                setShowRequestCard(true)
            }
        }
    }

    const getDistanceKM = async (start, end) => {
        try {
            const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY

            const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`

            const response = await fetch(url)

            const data = await response.json()

            return data.features[0].properties.distance / 1000;
        } catch (error) {
            console.log("getDistanceKM : ", error, "start & End", start, end);
        }
    }

    /*-------------------------------- GPS Simulation --------------------*/

    // Simulate Rider
    useEffect(() => {
        if (routeCoords.length > 0) {
            simulateRider();
        }

        return () => stopFakeTracking();
    }, [routeCoords]);

    const simulateRider = async () => {
        let index = 0;

        fakeGPS.current = setInterval(async () => {
            if (index >= routeCoords.length) {
                clearInterval(fakeGPS.current);
                return;
            }

            const point = routeCoords[index];
            setCurrentLocation({
                latitude: point.latitude,
                longitude: point.longitude
            });

            const volunteerRef = doc(db, "volunteer", volunteerId);

            await updateDoc(volunteerRef, {
                location: point,
                lastUpdated: new Date(),
            });

            updateLocation(point);

            index++;
        }, 200);
    };

    const stopFakeTracking = () => {
        if (fakeGPS.current) {
            clearInterval(fakeGPS.current);
            fakeGPS.current = null;
        }
    };

    /*------------------------- checking proximity ----------------------------*/

    const isNear = (a, b, threshold = 0.0005) => {
        if (!a || !b) return false;

        return (
            Math.abs(a.latitude - b.latitude) < threshold &&
            Math.abs(a.longitude - b.longitude) < threshold
        );
    };

    useEffect(() => {
        if(!currentLocation || !currentRequest) return

        let destination = null

        if (currentRequest.type === "home") {
            if (currentRequest.status === "rv-accepted") {
                destination = currentRequest.restuarant.location
                const arrived = isNear(currentLocation, destination)
        
                if (arrived) {
                    Alert.alert(
                        "Pick up conformation", 
                        "Picked up the food ?", 
                        [
                            {text: "Yes", onPress:() => changeRequestStatus("r-picked-up")}  
                        ]
                    )
                }
            }
            
            if (currentRequest.status === "r-picked-up") {
                destination = currentRequest.NGO.location
                const arrived = isNear(currentLocation, destination)

                if (arrived) {
                    Alert.alert(
                        "Drop Conformation",
                        "Did the NGO collected the food",
                        [
                            {text: "Yes", onPress: () => changeRequestStatus("checking")}
                        ]
                    )

                    setIsBusy(false)
                    setRouteCoords([])
                    setIsOnline(true)
                    setShowRequestCard(false)
                }
            }

            if (currentRequest.status === "nv-accepted") {
                destination = currentRequest.NGO.location
                const arrived = isNear(currentLocation, destination)

                if (arrived) {
                    Alert.alert(
                        "Pick up confirmation",
                        "Did you picked up the food ??",
                        [
                            {text: "Yes", onPress: () => changeRequestStatus("n-picked-up")}
                        ]
                    )

                    setIsBusy(false)
                    setRouteCoords([])
                    setIsOnline(true)
                    setShowRequestCard(false)
                }
            }
            
            if (currentRequest.status === "n-picked-up") {
                destination = currentRequest.home.location
                const arrived = isNear(currentLocation, destination)

                console.log(arrived)
                

                if (arrived) {
                    Alert.alert(
                        "Delivery Notification",
                        "Did you deliver the food ?",
                        [
                            {text: "Yes", onPress: () => changeRequestStatus("delivered")}
                        ]
                    )
                    setIsBusy(false)
                    setRouteCoords([])
                    setIsOnline(true)
                    setShowRequestCard(false)
                }


            }
        }
        
        if (currentRequest.type === "student") {
            if (currentRequest.status === "v-accepted") {
                destination = currentRequest.restuarant.location
                const arrived = isNear(currentLocation, destination)

                console.log("student : ", arrived)

                if (arrived) {
                    Alert.alert(
                        "Pick Up Notification",
                        "Did you picked the food ?",
                        [
                            {text: "Yes", onPress: () => changeRequestStatus("picked")}
                        ]
                    )
                    setIsBusy(false)
                    setRouteCoords([])
                    setIsOnline(true)
                    setShowRequestCard(false)
                }

            }

            if (currentRequest.status === "picked") {
                destination = currentRequest.student.location
                const arrived = isNear(currentLocation, destination)
                console.log("student : ", arrived)

                if (arrived) {
                    Alert.alert(
                        "Delivery Notification",
                        "Did you deliver the food ?",
                        [
                            {text: "Yes", onPress: () => changeRequestStatus("delivered")}
                        ]
                    )
                    setIsBusy(false)
                    setRouteCoords([])
                    setIsOnline(true)
                    setShowRequestCard(false)
                }

            }
        }
        
        
        if (!destination) return
        


    }, [currentLocation])

    const changeRequestStatus = async (newStatus) => {
        const requestRef = doc(db, "requests", currentRequestId)

        await updateDoc(requestRef, {
            status: newStatus
        })
    }

    const handleCloseRequest = () => {
        if (nearbyRequests.length === 0) return

        const updatedRequests = nearbyRequests.slice(1) // remove the first element

        setNearbyRequests(updatedRequests)

        if (updatedRequests.length > 0) {
            setCurrentRequestId(updatedRequests[0].requestId)
            setShowRequestCard(true)
        } else {
            setCurrentRequestId(null);
            setShowRequestCard(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                initialRegion={currentRegion}
                style={StyleSheet.absoluteFillObject}
            >
                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeWidth={5}
                        strokeColor="blue"
                    />
                )}

                {currentLocation && (
                    <Marker
                        coordinate={currentLocation}
                    />
                )}
            </MapView>
            <Ionicons
                style={styles.menuButton}
                name="menu"
                size={24}
                color="black"
            />

            {isBusy === false && (
                <TouchableOpacity
                    onPress={handleButton}
                    style={isOnline ? styles.stopButton : styles.goButton}
                >
                    <Text
                        style={[
                            { color: Colors.default.background, fontSize: 20 },
                        ]}
                    >
                        {isOnline ? "Stop" : "GO"}
                    </Text>
                </TouchableOpacity>
            )}

            { currentRequest?.type === "home" && currentRequest.status === "packed" && showRequestCard && (
                <View style={styles.cardContainer}>
                    <View style={styles.requestCard}>
                        <View style={{display: "flex", flexDirection: "row",justifyContent: "space-between"}}>
                            <View 
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: Colors.default.primary,
                                    borderRadius: 10,
                                    paddingHorizontal: 12,  
                                    paddingVertical: 4,   
                                    alignSelf: "flex-start",
                                    justifyContent: "center",
                                    gap: 4,
                                }}
                                >
                                    <Entypo name="home" size={12} color="white" />
                                    <Text style={{fontFamily: fonts.semiBold, color: "white", fontSize: 12}}>Home Request</Text>
                            </View>
                            <FontAwesome name="close" size={24} color="#d41515ff" onPress={handleCloseRequest}/>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "8", alignItems: "center", alignSelf: "flex-start"}}>
                            <Ionicons name="restaurant" size={24} color="black" />
                            <Text style={{fontFamily: fonts.regular}}>{currentRequest.restuarant?.restaurantName}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "8", alignItems: "center", alignSelf: "flex-start"}}>
                            <FontAwesome6 name="location-dot" size={24} color="black" />
                            <Text style={{fontFamily: fonts.regular}}>{currentRequest.NGO?.ngoName}</Text>
                        </View>
                        <TouchableOpacity onPress={handleAccept} style={globalStyles.button}>
                            <Text style={globalStyles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}



            { currentRequest?.type === "home" && currentRequest.status === "prepared" && showRequestCard && (
                <View style={styles.cardContainer}>
                    <View style={styles.requestCard}>
                        <View style={{display: "flex", flexDirection: "row",justifyContent: "space-between"}}>
                            <View 
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: Colors.default.primary,
                                    borderRadius: 10,
                                    paddingHorizontal: 12,  
                                    paddingVertical: 4,   
                                    alignSelf: "flex-start",
                                    justifyContent: "center",
                                    gap: 4,
                                }}
                                >
                                    <Entypo name="home" size={12} color="white" />
                                    <Text style={{fontFamily: fonts.semiBold, color: "white", fontSize: 12}}>Home Request</Text>
                            </View>
                            <FontAwesome name="close" size={24} color="#d41515ff" onPress={handleCloseRequest}/>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "8", alignItems: "center", alignSelf: "flex-start"}}>
                            <FontAwesome6 name="building-ngo" size={24} color="black" />
                            <Text style={{fontFamily: fonts.regular}}>{currentRequest.NGO?.ngoName}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "8", alignItems: "center", alignSelf: "flex-start"}}>
                            <FontAwesome6 name="location-dot" size={24} color="black" />
                            <Text style={{fontFamily: fonts.regular}}>{currentRequest.home?.name}</Text>
                        </View>
                        <TouchableOpacity onPress={handleAccept} style={globalStyles.button}>
                            <Text style={globalStyles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {currentRequest?.type === "student" && showRequestCard && (
                <View style={styles.cardContainer}>
                    <View style={styles.requestCard}>
                        <View style={{display: "flex", flexDirection: "row",justifyContent: "space-between"}}>
                            <View 
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: Colors.default.primary,
                                    borderRadius: 10,
                                    paddingHorizontal: 12,  
                                    paddingVertical: 4,   
                                    alignSelf: "flex-start",
                                    justifyContent: "center",
                                    gap: 4,
                                }}
                                >
                                    <FontAwesome6 name="graduation-cap" size={24} color="white" />
                                    <Text style={{fontFamily: fonts.semiBold, color: "white", fontSize: 12}}>Student Request</Text>
                            </View>
                            <FontAwesome name="close" size={24} color="#d41515ff" onPress={handleCloseRequest}/>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "8", alignItems: "center", alignSelf: "flex-start"}}>
                            <Ionicons name="restaurant" size={24} color="black" />
                            <Text style={{fontFamily: fonts.regular}}>{currentRequest.restuarant?.restaurantName}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "8", alignItems: "center", alignSelf: "flex-start"}}>
                            <FontAwesome6 name="location-dot" size={24} color="black" />
                            <Text style={{fontFamily: fonts.regular}}>{currentRequest.student?.name}</Text>
                        </View>
                        <TouchableOpacity onPress={handleAccept} style={globalStyles.button}>
                            <Text style={globalStyles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        backgroundColor: "white",
        position: "absolute",
        padding: 15,
        borderRadius: 100,
        top: "5%",
        left: "5%",
        zIndex: 1,
    },
    goButton: {
        padding: 30,
        position: "absolute",
        zIndex: 1,
        bottom: "7%",
        left: "50%",
        borderColor: "white",
        borderWidth: 5,
        marginInline: "auto",
        transform: [{ translateX: "-50%" }],
        backgroundColor: Colors.default.primary,
        borderRadius: 100,
    },
    stopButton: {
        padding: 30,
        position: "absolute",
        zIndex: 1,
        bottom: "7%",
        left: "50%",
        borderColor: "white",
        borderWidth: 5,
        marginInline: "auto",
        transform: [{ translateX: "-50%" }],
        backgroundColor: "red",
        borderRadius: 100,
    },
    cardContainer: {
        position: "absolute",
        zIndex: 100,
        bottom: 20,
        width: "90%",
        alignSelf: "center",
    },
    requestCard: {
        backgroundColor: "#ffffffe2",
        gap: 12,
        padding: 15,
        borderRadius: 12,
    },
});
