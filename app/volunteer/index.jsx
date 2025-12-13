import { Colors } from '@/constants/theme';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function index() {

    const mapRef = useRef(null);
    const [currentRegion, setCurrentRegion] = useState({
        latitude: 6.9355,
        longitude: 79.8428,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);



    return (
        <View style={{flex: 1}}>
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
    }
})