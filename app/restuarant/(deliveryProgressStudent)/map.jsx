import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function map() {

    const { requestId } = useLocalSearchParams();

    const [requestData, setRequestData] = useState(null);
    const [volunteerLocation, setVolunteerLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);

    const mapRef = useRef(null);
    const routeFetched = useRef(false);

    // Listen to request
    useEffect(() => {
        if (!requestId) return;

        const unsubscribe = onSnapshot(
            doc(db, "requests", requestId),
            (docSnap) => {

                if (docSnap.exists()) {
                    setRequestData(docSnap.data());
                }

                console.log("Request:", docSnap.data());
            }
        );

        return () => unsubscribe();
    }, [requestId]);



    // Listen to volunteer location
    useEffect(() => {

        if (!requestData?.volunteerId) return;

        const unsubscribe = onSnapshot(
            doc(db, "volunteers", requestData.volunteerId),
            (docSnap) => {

                if (docSnap.exists()) {

                    const geo = docSnap.data().location;

                    if (!geo) return;

                    setVolunteerLocation({
                        latitude: geo.latitude,
                        longitude: geo.longitude,
                    });

                }

            }
        );

        return () => unsubscribe();

    }, [requestData?.volunteerId]);



    // Update destination when status changes
    useEffect(() => {

        if (!requestData) return;

        const status = requestData.status;
        const type = requestData.type;

        let geo = null

        if (type === "home") {

            const destinations = {
                "rv-accepted": requestData.restuarant?.location,
                "r-picked-up": requestData.NGO?.location,
                "nv-accepted": requestData.NGO?.location,
                "v-picked-up": requestData.home?.location,
                "n-picked-up": requestData.home?.location,
            };

            geo = destinations[status];

            
        }
        
        if (type === "student") {
            const destinations = {
                "rv-accepted": requestData.restuarant?.location,
                "picked": requestData.student?.location
            }
            
            geo = destinations[status];
        }
        
        if (!geo) return;

        setDestination({
            latitude: geo.latitude,
            longitude: geo.longitude,
        });

    }, [requestData]);



    // Reset route when destination changes
    useEffect(() => {
        routeFetched.current = false;
    }, [destination]);



    // Fetch route once when both points exist
    useEffect(() => {

        if (!volunteerLocation || !destination) return;

        if (routeFetched.current) return;

        routeFetched.current = true;

        getRouteFromGeoapify(volunteerLocation, destination);

    }, [volunteerLocation, destination]);



    // Get route from Geoapify
    const getRouteFromGeoapify = async (start, end) => {

        try {

            const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

            const url =
                `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`;

            const response = await fetch(url);
            const result = await response.json();

            if (!result.features || result.features.length === 0) return;

            const coordinates = result.features[0].geometry.coordinates[0];

            const route = coordinates.map(([lng, lat]) => ({
                latitude: lat,
                longitude: lng,
            }));

            setRouteCoords(route);

            mapRef.current?.fitToCoordinates(route, {
                edgePadding: {
                    top: 100,
                    right: 50,
                    bottom: 100,
                    left: 50,
                },
                animated: true,
            });

        } catch (error) {

            console.log("Routing error:", error.message);

        }

    };



    return (

        <SafeAreaProvider style={{ flex: 1 }}>

            <MapView
                ref={mapRef}
                initialRegion={
                    volunteerLocation
                        ? {
                              ...volunteerLocation,
                              latitudeDelta: 0.01,
                              longitudeDelta: 0.01,
                          }
                        : {
                              latitude: 6.9271,
                              longitude: 79.8612,
                              latitudeDelta: 0.05,
                              longitudeDelta: 0.05,
                          }
                }
                style={StyleSheet.absoluteFillObject}
            >

                {volunteerLocation && (
                    <Marker coordinate={volunteerLocation} />
                )}

                {destination && (
                    <Marker coordinate={destination} pinColor="green" />
                )}

                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeWidth={5}
                        strokeColor="blue"
                    />
                )}

            </MapView>

        </SafeAreaProvider>

    );
}