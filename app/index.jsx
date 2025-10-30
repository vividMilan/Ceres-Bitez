import Fonts from '@/constants/fonts'
import React from 'react'
import { Text } from 'react-native'


export default function Index() {
    return (
        <Text style={{ fontFamily: Fonts.Poppins_700Bold, padding: 20, fontSize: 40 }}>Hello, World!</Text>
    )
}
