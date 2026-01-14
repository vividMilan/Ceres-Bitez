import { globalStyles } from '@/constants/globalStyle';
import { Colors } from '@/constants/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from "expo-location";
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";

    export default function index() {

        
        const mapRef = useRef(null);
        const [currentRegion, setCurrentRegion] = useState(null);
        const [currentLocation, setCurrentLocation] = useState(null)
        const [distance, setDistance] = useState(null)

        const fakeGPS = useRef(null)
        
        const [request, setRequest] = useState(
            {
                name: "A. Ashen",
                shop : {
                    name: "Amachi Vegitarian",
                    coords: {
                        latitude: 6.8559,
                        longitude: 79.8630
                    }
                },
                destination: {
                    name: "The Open University",
                    coords: {
                        latitude: 6.883015921299818, 
                        longitude: 79.88661706065521
                    }
                },
                status: "pending", 
                type: "student"
            }
        )

        const [ngoRequest, setNGORequest] = useState(
            {
                name: "Helping Hands",
                shop: {
                    
                }
            }
        )


        const [routeCoords, setRouteCoords] = useState([]);

        const [isOnline, setIsOnline] = useState(false)
        const [showRequestCard, setShowRequestCard] = useState(true)
        const [loading, setLoading] = useState(false)

        const navigate = (request) => {
            setLoading(true)
            if (!currentLocation) return

            if (request.status === "accepted") {
                getRoute(currentLocation, request.shop.coords)
                console.log("accepted")
            }

            if (request.status === "picked-up") {
                getRoute(currentLocation, request.destination.coords)
                console.log("picked-Up")
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

                const region = {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2
                }

                setCurrentLocation(region)
                setCurrentLocation({latitude, longitude})

                mapRef.current?.animateToRegion(region, 1000)


            } catch (error) {
                console.log(error.message)
            }
        }

        const getRoute = async (start, end) => {
            const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY
            try {
                const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`

                const response = await fetch(url)

                const data = await response.json()

                const distance = data.features[0].properties.distance

                setDistance(distance)

                const route = data.features[0].geometry.coordinates[0].map(
                    ([log, lat]) => ({
                        latitude: lat,
                        longitude: log
                    })
                )

                setRouteCoords(route)
                mapRef.current?.fitToCoordinates(route, {
                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                    animated: true,
                })

            } catch (error) {
                console.log(error.message)
            }
        }

        const isNear = (a, b, threshold = 0.0005) => {
            if (!a || !b) return false

            return (
                Math.abs(a.latitude - b.latitude) < threshold &&
                Math.abs(a.longitude - b.longitude) < threshold
            )
        }

        const simulateRider = () => {

            let index = 0

            fakeGPS.current = setInterval(() => {
                if (index >= routeCoords.length) {
                    clearInterval(fakeGPS.current)
                    return
                }

                const point = routeCoords[index]
                setCurrentLocation(point)


                mapRef.current?.animateToRegion({
                    ...point,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                }, 500)

                index++
            }, 200)
        }

        const stopFakeTracking = () => {
            if (fakeGPS.current) {
                clearInterval(fakeGPS.current)
                fakeGPS.current = null
            }
        }

        useEffect(() => {
            getCurrentLocation()
        }, [])

        useEffect(() => {
            if (routeCoords.length > 0) {
                simulateRider()
            }

            return () => stopFakeTracking()
        }, [routeCoords])


        useEffect(() => {
            if (!distance) return

            if (request.status === "accepted" && isNear(currentLocation, request.shop.coords)) {
                Alert.alert("Picked Up")
                const updated = { ...request, status: "picked-up" }
                setRequest(updated)
                navigate(updated)
            }

            if (request.status === "picked-up" && isNear(currentLocation, request.destination.coords)) {
                Alert.alert("Delivery Completed")
                setRequest({ ...request, status: "completed" })
                setRouteCoords([])
            }   
        }, [currentLocation])


        return (
            <View style={{flex: 1}}>
                <MapView 
                    ref={mapRef}
                    region={currentRegion}
                    style={StyleSheet.absoluteFillObject}
                    showsUserLocation
                >
                    {routeCoords.length > 0 && (
                        <Polyline 
                            coordinates={routeCoords}
                            strokeWidth={5}
                            strokeColor='blue'
                        />
                    )}

                    {currentLocation && (
                        <Marker 
                            coordinate={currentLocation}
                        />
                    )}
                </MapView>
                {(showRequestCard && (request.status === "pending")) && (
                    <View style={styles.cardContainer}>
                        <View style={styles.orderCard}>

                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <View style={globalStyles.flexDisplay}>
                                    <Text>{request.name}</Text>
                                    <FontAwesome6 name="graduation-cap" size={24} color="black" />
                                </View>
                                <View>
                                    <AntDesign onPress={() => setShowRequestCard(false)} name="close" size={24} color="black" />
                                </View>
                            </View>

                            <View>
                                <View style={globalStyles.flexDisplay}>
                                    <AntDesign name="shop" size={24} color="black" />
                                    <Text>{request.shop.name}</Text>
                                </View>
                                <View>
                                    <Text style={[globalStyles.subTitleText, {color: Colors.default.primary}]}>{distance}</Text>
                                </View>
                                <View style={globalStyles.flexDisplay}>
                                    <FontAwesome5 name="location-arrow" size={24} color="black" />
                                    <Text>{request.destination.name}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[globalStyles.button, {marginTop: "auto"}]} onPress={() => {
                                const updatedRequest = {
                                    ...request,
                                    status: "accepted"
                                }
                                setRequest(updatedRequest)
                                navigate(updatedRequest)
                            }}>
                                <Text style={globalStyles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <Ionicons style={styles.menuButton} name="menu" size={24} color="black" />
                <TouchableOpacity onPress={() => {
                    setIsOnline(!isOnline) 
                    }} 
                    style={isOnline ? styles.stopButton : styles.goButton}
                >
                    <Text style={[{color: Colors.default.background, fontSize: 20}]}>{isOnline ? "Stop" : "GO"}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const styles = StyleSheet.create({
        menuButton: {
            backgroundColor: "white",
            position: "absolute",
            padding: 15,
            borderRadius: 100,
            top: "5%",
            left: "5%",
            zIndex: 1
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
            alignSelf: "center"
        },
        orderCard: {
            backgroundColor: "#ffffffe2",
            gap: 12,
            padding: 15,
            borderRadius: 12
        }
    })