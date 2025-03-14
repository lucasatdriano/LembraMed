import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { EllipsisVertical, Search } from 'lucide-react-native';

export default function Header({ placeholder }: { placeholder: string }) {
    const [text, setText] = useState('');
    const colorScheme = useColorScheme();

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
            <Link href="/modal" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <EllipsisVertical
                            size={25}
                            color={Colors[colorScheme ?? 'light'].text}
                            style={styles.icon}
                        />
                    )}
                </Pressable>
            </Link>
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
    icon: {
        marginLeft: 15,
    },
});
