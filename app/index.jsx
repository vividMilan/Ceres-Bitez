import { useFont } from '@/context/FontContext';
import React from 'react';
import { Text } from 'react-native';


export default function Index() {

    const fonts = useFont();

    return (
        <Text style={{ fontFamily: fonts.regular , padding: 20, fontSize: 40 }}>Hello, World!</Text>
    )
}
