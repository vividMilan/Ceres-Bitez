import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
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

    const router = useRouter()

    const volunteerId = "V9iAalOh7ufEfJ4XCiVp";

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
                setCurrentLocation({latitude, longitude})

                const volunteerRef = doc(db, "volunteers", volunteerId)

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
            const volunteerRef = doc(db, "volunteers", "V9iAalOh7ufEfJ4XCiVp")

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

        }
    }

    /*---------------------- Navigation Handling ----------------------*/

    const navigateToRestaurant = (request) => {
        getRoute(currentLocation, request.restuarant.location)
    }

    const navigateToNGO = (request) => {
        getRoute(request.restuarant.location, request.NGO.location)
    }

    const navigateToHome = (request) => {
        getRoute(request.NGO.location, request.home.location)
    }

    const filterNearbyRequests = async (requests) => {
        if (!requests) return

        const nearby = []
        
        for (const request of requests) {

            let destination = null

            if (request.type === "home") {
                if (request.status === "packed") {
                    destination = request.restuarant.location
                }

                if (request.status === "prepared") {
                    destination = request.NGO.location
                }
            }
            
            if (request.type === "student") {
            
                // todo
                
            }

            if (!destination) continue

            
            const distance = await getDistanceKM(currentLocation, destination)

            if (distance < 10) {
                nearby.push({
                    requestId: request.id,
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

        if (nearby.length) {
            setCurrentRequestId(nearby[0].requestId)
            setShowRequestCard(true)
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
            console.log("getDistanceKM : ", error);
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
            setCurrentLocation(point);

            const volunteerRef = doc(db, "volunteers", volunteerId);

            await updateDoc(volunteerRef, {
                location: point,
                lastUpdated: new Date(),
            });

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
            
        }
        
        
        if (!destination) return
        


    }, [currentLocation])

    const changeRequestStatus = async (newStatus) => {
        const requestRef = doc(db, "requests", currentRequestId)

        await updateDoc(requestRef, {
            status: newStatus
        })
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

            { currentRequest?.type === "home" && showRequestCard && (
                <View style={styles.cardContainer}>
                    <View style={styles.requestCard}>
                        <Text>
                            Destination : {currentRequest?.restuarant?.name}
                        </Text>
                        <Text>
                            Distance : {currentRequest?.distance}
                        </Text>
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
