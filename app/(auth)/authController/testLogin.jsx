/**
 * testLogin.jsx  — dev validation screen
 * Navigate here after login/signup to confirm the Firestore profile was written
 * and that auth.currentUser is populated correctly.
 */

import { globalStyles } from "@/constants/globalStyle";
import { auth, db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestLogin() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter()


    const handleLogout = async () => {
        try {
            await auth.signOut();

            console.log("User logged out successfully.");
            router.back();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    setError("No user is currently signed in.");
                    return;
                }
                

                // Home users are stored in the "home" collection under their uid
                const home = await getDoc(doc(db, "home", currentUser.uid));
                const ngo = await getDoc(doc(db, "ngo", currentUser.uid));
                const restaurants = await getDoc(doc(db, "restaurants", currentUser.uid));
                const volunteers = await getDoc(doc(db, "volunteers", currentUser.uid));
                const students = await getDoc(doc(db, "student", currentUser.uid)); 

                let snp = null;

                if (home.exists()) snp = home;
                else if (ngo.exists()) snp = ngo;
                else if (restaurants.exists()) snp = restaurants;
                else if (volunteers.exists()) snp = volunteers;
                else if (students.exists()) snp = students;

                if (snp && snp.exists()) {
                    setUserData({ uid: currentUser.uid, ...snp.data() });
                } else {
                    setError(`No Firestore document found for uid: ${currentUser.uid}`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.hint}>Loading user data...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorMsg}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Logged-in User Data</Text>
                <View style={styles.card}>
                    {Object.entries(userData).map(([key, value]) => (
                        <View key={key} style={styles.row}>
                            <Text style={styles.key}>{key}</Text>
                            <Text style={styles.value}>{String(value)}</Text>
                        </View>
                    ))}
                </View>
                 <TouchableOpacity
                style={globalStyles.button}
                onPress={handleLogout}
            >
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            </ScrollView>

           
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    container: { padding: 20 },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
    hint: { marginTop: 10, color: "#555" },
    errorTitle: { fontSize: 18, fontWeight: "700", color: "#dc2626", marginBottom: 8 },
    errorMsg: { color: "#555", textAlign: "center" },
    card: {
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        padding: 16,
        gap: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e5e5",
        paddingBottom: 8,
    },
    key: { fontWeight: "600", color: "#333", flex: 1 },
    value: { color: "#555", flex: 2, textAlign: "right" },
});
