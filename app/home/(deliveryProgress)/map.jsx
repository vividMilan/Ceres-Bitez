import { db } from '@/firebaseConfig'
import { useLocalSearchParams } from 'expo-router'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker, Polyline } from "react-native-maps"
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function map(){

  const {requestId} = useLocalSearchParams()

  const [requestData, setRequestData] = useState(null);
  const [volunteerLocation, setVolunteerLocation] = useState(null)
  const [destination, setDestination] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])
  
  
  const mapRef = useRef(null);

  //Listen to request
  useEffect(() => {
    if (!requestId) return;

    const unsubscribe = onSnapshot(
      doc(db, "requests", requestId),
      (docSnap) => {
        if (docSnap.exists()) {
          setRequestData(docSnap.data());
        }
      }
    );

    return () => unsubscribe();
  }, [requestId]);


  //Listen to volunteer location  
  useEffect(() => {
    if (!requestData?.volunteerID) return

    const unsubscribe = onSnapshot(
      doc(db, "volunteers", requestData.volunteerID),
      (docSnap) => {
        if (docSnap.exists()) {
          const geo = docSnap.data().location
          
          setVolunteerLocation({
            latitude: geo.latitude,
            longitude: geo.longitude
          })
        }
      }
    )

    return () => unsubscribe();

  }, [requestData?.volunteerID])

  //Automatically update destination when status changes
  useEffect(() => {
    if (!requestData) return;

    const status = requestData.status
    const type = requestData.type

    if (type === "home" && status === "rv-accepted") {
      setGeoDestination(requestData.restuarant.location)
    }

    if (type === "home" && status === "r-picked-up") {
      setGeoDestination(requestData.NGO.location)
    }

    if (type === "home" && status === "nv-accepted") {
      setGeoDestination(requestData.home.location)
    }

  }, [requestData])


  // Helper function to convert to GeoPoint
  const setGeoDestination = (geo) => {
    if (!geo) return

    setDestination({
      latitude: geo.latitude,
      longitude: geo.longitude
    })
  }

  // get route from geoapify
  const getRouteFromGeoapify = async (start, end) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY
      const url = `https://api.geoapify.com/v1/routing?waypoints=${start.latitude},${start.longitude}|${end.latitude},${end.longitude}&mode=drive&apiKey=${apiKey}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!result.features || result.features.length === 0) return

      const coordinates = result.features[0].geometry.coordinates[0];

      const route = coordinates.map(
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
  }

  useEffect(() => {
    if (!volunteerLocation || !destination) return;

    getRouteFromGeoapify(volunteerLocation, destination);

  }, [volunteerLocation, destination]);

  return (
    <SafeAreaProvider sstyle={{ flex: 1 }}>
    <MapView
                ref={mapRef}
                initialRegion={
                  volunteerLocation && {
                    ...volunteerLocation,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }
                }
                style={StyleSheet.absoluteFillObject}
            >
                {/* {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={}
                        strokeWidth={5}
                        strokeColor="blue"
                    />
                )} */}

                {volunteerLocation && (
                    <Marker
                        key={`${volunteerLocation.latitude} - ${volunteerLocation.longitude}`}
                        coordinate={volunteerLocation}
                    />
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
  )
}