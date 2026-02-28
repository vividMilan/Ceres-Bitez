import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const [currentRequest, setCurrentRequest] = useState(null);
    const [isBusy, setIsBusy] = useState(false);

    const acceptTimeout = useRef(null);

    const voluteerId = "V9iAalOh7ufEfJ4XCiVp";

    const freeVolunteer = async () => {
        try {
            const volunteerRef = doc(db, "volunteers", voluteerId);

            await updateDoc(volunteerRef, {
                isBusy: false,
            });

            setIsBusy(false);
        } catch (error) {
            throw error;
        }
    };

    const handleButton = async () => {
        try {
            const voluteerRef = doc(db, "volunteers", "V9iAalOh7ufEfJ4XCiVp");

            const voluteerSnap = await getDoc(voluteerRef);

            const online = !isOnline;

            setIsOnline(!isOnline);

            if (voluteerSnap.exists()) {
                await updateDoc(voluteerRef, {
                    isOnline: online,
                });
            }

            await fetchRequests();
        } catch (error) {
            console.log(error);
        }
    };

    const handleAccept = async () => {
        clearTimeout(acceptTimeout.current);
        setShowRequestCard(false);
        const updatedRequest = {
            ...currentRequest,
            status: "v-accepted",
        };

        const currentRef = doc(db, "studentRequests", currentRequest.id);
        await updateDoc(currentRef, {
            status: "v-accepted",
        });
        setCurrentRequest(updatedRequest);
        navigate(updatedRequest);
        setIsBusy(true);
    };

    const getDistanceKm = async (start, end) => {
        try {
            const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
            const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`;
            const response = await fetch(url);

            const data = await response.json();

            return data.features[0].properties.distance / 1000;
        } catch (error) {
            throw error;
        }
    };

    const filterNearbyRequests = async (requests) => {
        try {
            if (!currentLocation) return;

            const nearby = [];

            for (const req of requests) {
                const shopCoords = req.restuarant.location;

                const distKm = await getDistanceKm(currentLocation, shopCoords);

                if (distKm < 100) {
                    nearby.push({
                        ...req,
                        distance: distKm.toFixed(2),
                    });
                }
            }
            nearby.sort((a, b) => a.distance - b.distance);

            setNearbyRequests(nearby);

            if (nearby[0]) {
                setCurrentRequest(nearby[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const studentsRequestSnap = await getDocs(
                query(
                    collection(db, "studentRequests"),
                    where("status", "==", "r-accepted"),
                ),
            );

            const studentRequests = studentsRequestSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            await filterNearbyRequests(studentRequests);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = (request) => {
        setLoading(true);
        if (!currentLocation) return;

        if (request.status === "v-accepted") {
            getRoute(currentLocation, request.restuarant.location);
        }

        if (request.status === "picked-up") {
            getRoute(currentLocation, request.student.location);
        }
    };

    const getCurrentLocation = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert("Location Permission is Required");
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            const { latitude, longitude } = location.coords;

            const region = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
            };

            setCurrentLocation(region);
            setCurrentLocation({ latitude, longitude });

            mapRef.current?.animateToRegion(region, 1000);
        } catch (error) {
            console.log(error.message);
        }
    };

    const cancelRequest = () => {
        clearTimeout(acceptTimeout.current);
        setNearbyRequests((prev) => {
            const updated = prev.slice(1);
            setCurrentRequest(updated.length > 0 ? updated[0] : null);

            return updated;
        });
    };

    const getRoute = async (start, end) => {
        const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
        try {
            const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`;

            const response = await fetch(url);

            const data = await response.json();

            const route = data.features[0].geometry.coordinates[0].map(
                ([log, lat]) => ({
                    latitude: lat,
                    longitude: log,
                }),
            );

            setRouteCoords(route);
            mapRef.current?.fitToCoordinates(route, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const isNear = (a, b, threshold = 0.0005) => {
        if (!a || !b) return false;

        return (
            Math.abs(a.latitude - b.latitude) < threshold &&
            Math.abs(a.longitude - b.longitude) < threshold
        );
    };

    const simulateRider = async () => {
        let index = 0;

        fakeGPS.current = setInterval(async () => {
            if (index >= routeCoords.length) {
                clearInterval(fakeGPS.current);
                return;
            }

            const point = routeCoords[index];
            setCurrentLocation(point);

            mapRef.current?.animateToRegion(
                {
                    ...point,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                },
                500,
            );

            const volunteerRef = doc(db, "volunteers", voluteerId);

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

    // const sendLocationToFirestore = async () => {
    //     if (!currentLocation) return

    //     console.log(currentLocation)

    //     const voluteerRef = doc(db, "volunteers", voluteerId)

    //     await updateDoc(voluteerRef, {
    //         location: {currentLocation},
    //         lastUpdated: new Date()
    //     })
    // }

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (routeCoords.length > 0) {
            simulateRider();
        }

        return () => stopFakeTracking();
    }, [routeCoords]);

    useEffect(() => {
        if (!currentRequest || !currentLocation) return;

        const checkStatus = async () => {
            if (
                currentRequest.status === "v-accepted" &&
                isNear(currentLocation, currentRequest.restuarant.location)
            ) {
                Alert.alert("Picked Up");
                const updated = { ...currentRequest, status: "picked-up" };
                const currentRef = doc(
                    db,
                    "studentRequests",
                    currentRequest.id,
                );
                await updateDoc(currentRef, {
                    status: "picked-up",
                });
                setCurrentRequest(updated);
                navigate(updated);
            }

            if (
                currentRequest.status === "picked-up" &&
                isNear(currentLocation, currentRequest.student.location)
            ) {
                Alert.alert("Delivery Completed");
                const currentRef = doc(
                    db,
                    "studentRequests",
                    currentRequest.id,
                );
                await updateDoc(currentRef, {
                    status: "delivered",
                });
                setCurrentRequest(null);
                setRouteCoords([]);
                freeVolunteer();
            }
        };

        checkStatus();
    }, [currentLocation, isBusy]);

    // real time status changing
    // useEffect(() => {

    //     if (!isOnline) return

    //     const q = query(
    //         collection(db, "studentRequests"),
    //         where("status", "==", "r-accepted")
    //     )

    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //         const requests = snapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data()
    //         }))

    //         filterNearbyRequests(requests)
    //     })

    //     return () => unsubscribe()
    // }, [isOnline, currentLocation])

    // Update location every 10 seconds
    // useEffect(() => {
    //     const interval = setInterval(sendLocationToFirestore, 10000)
    //     return () => clearInterval(interval)
    // }, [currentLocation])

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
                        key={`${currentLocation.latitude} - ${currentLocation.longitude}`}
                        coordinate={currentLocation}
                    />
                )}
            </MapView>
            {currentRequest && showRequestCard && (
                <View style={styles.cardContainer}>
                    <View style={styles.orderCard}>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View style={globalStyles.flexDisplay}>
                                <Text>
                                    {currentRequest.student.studentName}
                                </Text>
                                <FontAwesome6
                                    name="graduation-cap"
                                    size={24}
                                    color="black"
                                />
                            </View>
                            <View>
                                <AntDesign
                                    onPress={cancelRequest}
                                    name="close"
                                    size={24}
                                    color="black"
                                />
                            </View>
                        </View>

                        <View>
                            <View style={globalStyles.flexDisplay}>
                                <AntDesign
                                    name="shop"
                                    size={24}
                                    color="black"
                                />
                                <Text>
                                    {currentRequest.restuarant.restuarantName}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[
                                        globalStyles.subTitleText,
                                        { color: Colors.default.primary },
                                    ]}
                                >
                                    {currentRequest.distance} Km
                                </Text>
                            </View>
                            <View style={globalStyles.flexDisplay}>
                                <FontAwesome5
                                    name="location-arrow"
                                    size={24}
                                    color="black"
                                />
                                <Text>
                                    {currentRequest.restuarant.restuarantName}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[globalStyles.button, { marginTop: "auto" }]}
                            onPress={handleAccept}
                        >
                            <Text style={globalStyles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <Ionicons
                style={styles.menuButton}
                name="menu"
                size={24}
                color="black"
            />

            {!isBusy && (
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
    orderCard: {
        backgroundColor: "#ffffffe2",
        gap: 12,
        padding: 15,
        borderRadius: 12,
    },
});
