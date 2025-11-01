import { useFont } from '@/context/FontContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text } from 'react-native';


export default function Index() {

    const fonts = useFont();

    useEffect(() => {
        router.replace("/screens/(auth)/student/student_login")
    })

    return (
        <Text style={{ fontFamily: fonts.regular , padding: 20, fontSize: 40 }}>Hello, World!</Text>
    )
}
