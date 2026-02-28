import { Colors } from "@/constants/theme";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Zocial from "@expo/vector-icons/Zocial";
import { Image, StyleSheet, Text, View } from "react-native";

import { fonts, fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
    const router = useRouter();

    const profile_pic = require("../../../../assets/images/profile_pic.png");

    return (
        <SafeAreaView>
            <View style={styles.banner}>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        onPress={() => router.back()}
                        name="arrow-back-outline"
                        size={36}
                        color="white"
                        style={{ marginRight: 10 }}
                    />
                    <Text style={{ fontSize: fontSizes.title, color: "white" }}>
                        Back
                    </Text>
                </View>
                <View style={styles.info_banner}>
                    <Image source={profile_pic} style={styles.profile_pic} />
                    <Text
                        style={{
                            fontFamily: fonts.semiBold,
                            color: "white",
                            letterSpacing: 0.5,
                            fontSize: 24,
                        }}
                    >
                        A. Dheena
                    </Text>
                    <Text
                        style={{
                            fontFamily: fonts.regular,
                            color: "white",
                            letterSpacing: 0.75,
                        }}
                    >
                        The Open Univerisity of Sri Lanka
                    </Text>
                </View>
            </View>
            <View style={[globalStyles.container, { gap: 20 }]}>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <FontAwesome name="user-circle" size={32} color="black" />
                    <Text style={[globalStyles.regularText]}>Ajith Dheena</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <MaterialIcons name="location-on" size={32} color="black" />
                    <Text style={[globalStyles.regularText]}>Nawala</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <MaterialCommunityIcons
                        name="book-education"
                        size={32}
                        color="black"
                    />
                    <Text style={[globalStyles.regularText]}>
                        The Open University of Sri Lanka
                    </Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <Fontisto name="date" size={32} color="black" />
                    <Text style={[globalStyles.regularText]}>2025/10/01</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="call" size={32} color="black" />
                    <Text style={[globalStyles.regularText]}>71 8622 126</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <Zocial name="email" size={32} color="black" />
                    <Text style={[globalStyles.regularText]}>
                        student@university.lk
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: Colors.default.primary,
        tintColor: "white",
        padding: 20,
    },
    profile_pic: {
        height: 125,
        width: 125,
        borderRadius: "50%",
    },
    info_banner: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        width: "100%",
    },
});
