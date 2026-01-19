import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSummery() {
    const { shopId, shopName, selectedItems } = useLocalSearchParams();

    const parsedSelectedItems = JSON.parse(selectedItems) || [];

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [canPress, setCanPress] = useState(false);

    const urlBuilder = (latitude, longitude) => {
        return `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`;
    };

    const fetchAddress = async (latitude, longitude) => {
        try {
            const url = urlBuilder(latitude, longitude);
            const response = await fetch(url);
            const data = await response.json();

            const name = data.results[0].name ?? data.results[0].street;
            const suburb = data.results[0].suburb;

            setAddress(name);
            setCity(suburb);

            console.log(name);
            console.log(`City: ${suburb}`);
        } catch (error) {
            console.log(error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            setLoading(true);
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                return;
            }

            const fetchedLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = fetchedLocation.coords;

            fetchAddress(latitude, longitude);
            setLocation({ latitude, longitude });
            setCanPress(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const router = useRouter();
    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView stickyHeaderIndices={[0]}>
                <PageTitleWithBackButton heading={"Summery"} />
                <View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[globalStyles.subTitleText]}>Address</Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <FontAwesome6
                                    name="location-dot"
                                    size={36}
                                    color="black"
                                />
                                <View>
                                    {address && city ? (
                                        <>
                                            <Text
                                                style={{
                                                    fontFamily: fonts.regular,
                                                }}
                                            >
                                                {address}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontFamily: fonts.regular,
                                                }}
                                            >
                                                {city}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text>Loading....</Text>
                                    )}
                                </View>
                            </View>

                            <MaterialIcons
                                name="navigate-next"
                                size={44}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        {/* {parsedSelectedItems.map((orderDetail, index) => (
                            <Accordian
                                key={index}
                                shopName={shopName}
                                orders={orderDetail}
                            />
                        ))} */}
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={[globalStyles.subTitleText]}>Price</Text>
                        {parsedSelectedItems.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: fonts.regular,
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: fonts.regular,
                                    }}
                                >
                                    Rs.{item.price * item.qty}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                disabled={!canPress}
                style={[globalStyles.button, { marginTop: "auto" }]}
                onPress={() =>
                    router.push({
                        pathname: "/student/(tabs)/home/checkout",
                        params: {
                            shopId,
                            shopName,
                            location: JSON.stringify(location),
                            request: JSON.stringify(parsedSelectedItems),
                        },
                    })
                }
            >
                <Text style={globalStyles.buttonText}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
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
        borderTopColor: "#eee",
    },
});
