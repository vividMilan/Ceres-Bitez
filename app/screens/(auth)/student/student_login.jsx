import fontSize from "@/constants/fontSizes"
import { Colors } from "@/constants/theme"
import { useFont } from "@/context/FontContext"
import { router } from "expo-router"
import React from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

export default function student_login() {

    const fonts = useFont()

    return (
        <View>
            <Text style={styles.title}>Login</Text>
            <TextInput 
                placeholder="Username"
            />
            <TextInput 
                placeholder="Password"
            />
            <Pressable
                style={styles.button}
            >
                <Text>Login</Text>
            </Pressable>
            <Pressable
                style={styles.button}
            >
                <Text>Continue With</Text>
            </Pressable>
            <Pressable
                onPress={() => router.push("/screens/student")}
            >
                Don't Have an account. Sign Up
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: fontSize.large,
        fontFamily: fonts.semibold
    },
    button:{
        backgroundColor: Colors.theme.primary,
        color: Colors.theme.text
    }
})