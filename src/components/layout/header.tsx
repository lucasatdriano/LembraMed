import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Search } from 'lucide-react-native';
import MenuAccount from '@/src/components/layout/menuAccount';
import { localStorageUtil } from '@/src/util/localStorageUtil';

interface HeaderProps {
    placeholder: string;
    onSearch: (search: string) => void;
}

export default function Header({ placeholder, onSearch }: HeaderProps) {
    const [text, setText] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    const handleSearch = (searchText: string) => {
        setText(searchText);
        onSearch(searchText);
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.inputContainer}>
                <Search style={styles.iconInput} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={text}
                    onChangeText={handleSearch}
                    placeholderTextColor="#888"
                />
            </View>
            <MenuAccount userId={userId || ''} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.colorPrimary,
        width: '100%',
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
