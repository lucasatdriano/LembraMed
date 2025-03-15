import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Search } from 'lucide-react-native';
import MenuAccount from '@/src/components/layout/menuAccount';

export default function Header({ placeholder }: { placeholder: string }) {
    const [text, setText] = useState('');

    return (
        <View style={styles.headerContainer}>
            <View style={styles.inputContainer}>
                <Search style={styles.iconInput} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor="#888"
                />
            </View>
            <MenuAccount />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.colorPrimary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    inputContainer: {
        position: 'relative',
        width: '90%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.colorPrimary,
    },
    iconInput: {
        position: 'absolute',
        left: 10,
        alignSelf: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.text,
        backgroundColor: Colors.light.input,
        color: Colors.light.text,
        paddingHorizontal: 40,
    },
});
