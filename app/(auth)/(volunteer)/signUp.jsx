import { sendOTP } from "@/app/(auth)/authController/sendOTP";
import { fonts, fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { NGOs } from "@/data/NGOs";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";


import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const PENDING_SIGNUP_KEY = "pendingSignUp";

export default function signUp() {

    const router = useRouter ();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [ngo, setNgo] = useState("");
    const [isChecked, setChecked] = useState(false);
    const [imageUri, setImageUri] = useState(null);


    // Other States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [secureMode_password, setSecureMode_password] = useState(true);
    const [secureMode_conPassword, setSecureMode_conPassword] = useState(true)
    const [imageUploading, setImageUploading] = useState(false);
    const [showSourcePicker, setShowSourcePicker] = useState(false);


    const volunteerData = {
        name: name,
        email: email,
        mobile: mobile,
        ngo: ngo,
        licence_img_url: "none",
        userRole: "volunteers"
    }

    /**
 * Handle Change for form fields
 */
    const handleChange = (field, value) => {

        // Clearing Error
        clearErrors();

        setShowSuccess(false);

        // Updating field values
        if (field === "name") setName(value);
        else if (field === "email") setEmail(value);
        else if (field === "mobile") setMobile(value);
        else if (field === "password") setPassword(value);
        else if (field === "confirmPassword") setConfirmPassword(value);
        else if (field === "ngo") setNgo(value);
        else if (field === "isChecked") setChecked(value);
        else if (field === "imageUri") setImageUri(value);
    };

    /**
 * Function to handle sign up process
 */

    const handleSignUp = async () => {

        const newError = {};

        // Validation regex patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = {
            length: /^.{6,}$/,
        };
        const mobileRegex = /^\d{10}$/;


        // Validating inputes 
        if (!name.trim()) newError.name = "Volunteer name is required.";
        if (!email.trim()) newError.email = "Email is required.";
        else if (!emailRegex.test(email.trim())) newError.email = "Invalid email format.";
        if (!mobile.trim()) newError.mobile = "Mobile number is required.";
        else if (!mobileRegex.test(mobile.trim())) newError.mobile = "Invalid mobile number format.";
        if (!password) newError.password = "Password is required.";
        else {
            if (!passwordRegex.length.test(password)) newError.password = "Password must be at least 6 characters.";
        }
        if (!confirmPassword) newError.confirmPassword = "Confirm password is required.";
        else if (password !== confirmPassword) newError.confirmPassword = "Passwords do not match.";
        if (!ngo.trim()) newError.ngo = "NGO is required.";
        if (!isChecked) newError.isChecked = "You must accept the terms and conditions.";
        if (!imageUri) newError.imageUri = "Volunteer Licence image is required.";


        // Show input errors
        setError(newError);
        setShowSuccess(Object.keys(newError).length === 0);
        if (Object.keys(newError).length > 0) {
            return;
        }


        // Sign in logic
        try {
            setLoading(true);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            // send otp to user email
            await sendOTP(email, otp);
            console.log("Generated OTP from params:", otp);


            await AsyncStorage.setItem(
                PENDING_SIGNUP_KEY,
                JSON.stringify({
                    email,
                    password,
                    userData: volunteerData,
                }),
            );

            router.push({
                pathname: "/(auth)/authController/otpVerification",
                params: { email, generatedOTP: otp },
            });
        } catch (error) {
            console.error("Error during sign up:", error);
            Alert.alert("Sign Up Failed", "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }

    }
    /**
    * Function to clear error messages
    */
    const clearErrors = () => {
        if (Object.keys(error).length === 0) return;
        setError({});
    }


    /**
     * Image Picker Methods
     * 
     */
    // Clear selected image
    const clearImage = () => {
        setImageUri(null);
    };


    const askImageSource = () => {
        setShowSourcePicker(true);
    };

    // `Choose image source (camera or gallery) and open respective picker
    const chooseImageSource = (source) => {
        setShowSourcePicker(false);
        openImagePicker(source);
    };
    // Function to open image picker based on source (camera or gallery)
    const openImagePicker = async (source) => {
        try {
            let permission;

            if (source === 'camera') {
                permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    alert("Camera permission is required!");
                    return;
                }
            } else {
                permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    alert("Gallery permission is required!");
                    return;
                }
            }

            const result = source === 'camera'
                ? await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.back,
                    allowsEditing: false,
                    quality: 0.75,
                })
                : await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    quality: 0.75,
                });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            alert("Error selecting image: " + error.message);
        }
    };






    return (
        <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={globalStyles.titleText}>Create Account as Volunteer</Text>

                    {/*  Input Student Name */}
                    <View>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Name with initials"
                            value={name}
                            onChangeText={(value) => handleChange("name", value)}

                        />
                        {error.name ? <Text style={styles.errorText}>{error.name}</Text> : null}
                    </View>


                    {/**Input Student Email */}
                    <View>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={(value) => handleChange("email", value)}
                        />
                        {error.email ? <Text style={styles.errorText}>{error.email}</Text> : null}
                    </View>

                    {/** Input Mobile Number */}
                    <View>
                        <TextInput
                            style={globalStyles.input}
                            keyboardType="phone-pad"
                            maxLength={10}
                            placeholder="Mobile Number"
                            value={mobile}
                            onChangeText={(value) => handleChange("mobile", value)}
                        />
                        {error.mobile ? <Text style={styles.errorText}>{error.mobile}</Text> : null}
                    </View>


                    {/* Input Password and Confirm Password */}

                    <View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[globalStyles.input, styles.passwordInput]}
                                placeholder="Password"
                                secureTextEntry={secureMode_password}
                                value={password}
                                maxLength={12}
                                onChangeText={(value) => handleChange("password", value)}
                            />
                            <TouchableOpacity
                                onPress={() => setSecureMode_password(!secureMode_password)}
                                style={styles.icon}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={secureMode_password ? "eye-off" : "eye"}
                                    size={30}
                                    color="gray"

                                />
                            </TouchableOpacity>
                        </View>
                        {error.password ? <Text style={styles.errorText}>{error.password}</Text> : null}

                    </View>

                    <View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[globalStyles.input, styles.passwordInput]}
                                placeholder="Confirm Password"
                                secureTextEntry={secureMode_conPassword}
                                value={confirmPassword}
                                maxLength={12}
                                onChangeText={(value) => handleChange("confirmPassword", value)}
                            />
                            <TouchableOpacity
                                onPress={() => setSecureMode_conPassword(!secureMode_conPassword)}
                                style={styles.icon}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={secureMode_conPassword ? "eye-off" : "eye"}
                                    size={30}
                                    color="gray"

                                />
                            </TouchableOpacity>

                        </View>
                        {error.confirmPassword ? <Text style={styles.errorText}>{error.confirmPassword}</Text> : null}
                    </View>


                    {/* Image Picker */}
                    <View style={{ marginVertical: 15 }}>

                        {/**Check imageUrl*/}

                        {imageUri ? (
                            <View>
                                {/* If image selected, show preview with options to change or remove */}
                                <Image
                                    source={{ uri: imageUri, cache: "reload" }}
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        borderRadius: 8,
                                        marginBottom: 10,
                                    }}
                                    resizeMode="contain"
                                />
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                    <TouchableOpacity
                                        style={[styles.image_button, { flex: 1 }]}
                                        onPress={() => openImagePicker("camera")}
                                        disabled={imageUploading}
                                    >
                                        <Text style={styles.image_button_text}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.image_button, { flex: 1 }]}
                                        onPress={() => openImagePicker("gallery")}
                                        disabled={imageUploading}
                                    >
                                        <Text style={styles.image_button_text}>Gallery</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.image_button, { flex: 1, backgroundColor: "red" }]}
                                        onPress={clearImage}
                                        disabled={imageUploading}
                                    >
                                        <Text style={styles.image_button_text}> Remove</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>


                        ) : (


                            <View style={{ gap: 10 }}>
                                {/* If no image selected, show placeholder with option to select image */}
                                <TouchableOpacity
                                    style={globalStyles.cameraClick}
                                    onPress={askImageSource}
                                >
                                    <Entypo
                                        name="camera"
                                        size={72}
                                        color={Colors.default.inputText}
                                    />
                                    <Text
                                        style={{
                                            fontSize: fontSizes.regular,
                                            color: Colors.default.inputText,
                                        }}
                                    >
                                        Upload Licence
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {error.imageUri ? <Text style={styles.errorText}>{error.imageUri}</Text> : null}
                    </View>

                    {/**Input for NGO  selection */}
                    <View style={globalStyles.dropDownContainer}>
                        <Picker
                            selectedValue={ngo}
                            onValueChange={(value) => handleChange("ngo", value)}
                        >
                            <Picker.Item
                                style={{ color: Colors.default.inputText }}
                                label="Select Ngo"
                                value=""
                            />

                            {NGOs.map((item, index) => (
                                <Picker.Item
                                    key={index}
                                    label={item}
                                    value={item}
                                />
                            ))}
                        </Picker>
                    </View>


                    {/** terms and conditions */}
                    <View style={styles.termsContainer}>
                        <View style={styles.termsRow}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={(value) => handleChange("isChecked", value)}
                                color={Colors.default.primary}
                            />
                            <Text style={[globalStyles.regularText, styles.termsText]}>
                                By selecting checkbox accept the terms and conditions
                            </Text>
                        </View>
                        {error.isChecked ? <Text style={styles.termsErrorText}>{error.isChecked}</Text> : null}
                    </View>


                    {loading ? (
                        // Show loading indicator while processing sign up
                        <ActivityIndicator size="large" color={Colors.default.primary} />
                    ) : (

                        // Show Sign Up button and navigation to login if not loading

                        <View>
                            <TouchableOpacity
                                style={[globalStyles.button, { marginTop: "auto" }]}
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                <Text style={globalStyles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>

                            <View>
                                <Text
                                    onPress={() => router.push("/(auth)/(volunteer)/login")}
                                    style={{
                                        marginHorizontal: "auto",
                                        fontFamily: fonts.regular,
                                    }}
                                >
                                    Already have an account ?
                                    <Text
                                        style={[
                                            {
                                                color: Colors.default.primary,
                                                fontFamily: fonts.semiBold,
                                            },
                                        ]}
                                    >
                                        {" "}
                                        Login
                                    </Text>
                                </Text>
                            </View>

                        </View>
                    )}







                </ScrollView>
            </KeyboardAvoidingView>

            {/* Image Source Picker Modal */}
            <Modal
                visible={showSourcePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSourcePicker(false)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.45)",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                    }}
                    onPress={() => setShowSourcePicker(false)}
                >
                    <Pressable
                        style={{
                            backgroundColor: Colors.white,
                            borderRadius: 16,
                            padding: 18,
                            gap: 10,
                        }}
                        onPress={() => { }}
                    >
                        <Text
                            style={{

                                fontFamily: fonts.semiBold,
                                color: "white",
                                marginBottom: 10,
                                fontSize: fontSizes.subTitle
                            }}
                        >
                            Select Image Source
                        </Text>

                        <TouchableOpacity
                            style={[
                                globalStyles.button,
                                { backgroundColor: Colors.default.primary },
                            ]}
                            onPress={() => chooseImageSource("camera")}
                        >
                            <Text style={globalStyles.buttonText}>Open Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                globalStyles.button,
                                { backgroundColor: Colors.default.primary },
                            ]}
                            onPress={() => chooseImageSource("gallery")}
                        >
                            <Text style={globalStyles.buttonText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                globalStyles.button,
                                { backgroundColor: "#dc2626" },
                            ]}
                            onPress={() => setShowSourcePicker(false)}
                        >
                            <Text style={globalStyles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cameraClick: {
        height: 300,
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 50,
        marginBottom: 20,
    },
    dropDownContainer: {
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        borderRadius: 50,
        marginBottom: 20,
        paddingInline: 10,
    },
     screen: {
        flex: 1,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 32,
        flexGrow: 1,
    },
    cameraClick: {
        height: 300,
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 50,
        marginBottom: 20,
    },
    dropDownContainer: {
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        borderRadius: 50,
        marginBottom: 20,
        paddingInline: 10,
    },

    errorText: {
        color: "#dc2626",
        fontSize: 12,
        marginBottom: 10,
        fontFamily: fonts.regular,
        marginTop: -18,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1, 
        height: 50,
    },
    icon: {
        padding: 10,

    },
    passwordContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",


    },
    passwordInput: {
        flex: 1,
    },
    termsContainer: {
        marginBottom: 20,
    },
    termsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 30,
        height: 30,
        margin: 8,
    },
    termsText: {
        flex: 1,
    },
    termsErrorText: {
        color: "#dc2626",
        fontSize: 12,
        fontFamily: fonts.regular,
        marginTop: 4,
        marginLeft: 46,
    },
    image_button: {
        backgroundColor: Colors.default.primary,
        padding: 7,
        borderRadius: 8,
        alignItems: "center",
        color: Colors.white,
    },
    image_button_text: {
        color: "white",
        fontSize: 14,
        fontFamily: fonts.semiBold,
    }
});
