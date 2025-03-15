import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { EllipsisVertical, LogOut, User2 } from 'lucide-react-native';
import Modal from 'react-native-modal';
import Colors from '@/src/constants/Colors';

const accounts = [
    { id: 1, name: 'Lucas Adriano' },
    { id: 2, name: 'Dev Account' },
];

export default function MenuAccount() {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

    function switchAccount(account: any) {
        setSelectedAccount(account);
        setIsVisible(false);
    }

    return (
        <View>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setIsVisible(true)}
            >
                <EllipsisVertical />
            </TouchableOpacity>

            <Modal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                backdropOpacity={0.3}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={500}
                animationOutTiming={500}
                style={styles.modal}
            >
                <View style={styles.menu}>
                    {accounts.map((account) => (
                        <TouchableOpacity
                            key={account.id}
                            style={styles.menuItem}
                            onPress={() => switchAccount(account)}
                        >
                            <User2 />
                            <Text style={styles.textItem}>{account.name}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.menuItem}>
                        <LogOut />
                        <Text style={styles.textItem}>Sair da conta</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    menu: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 10,
        width: '100%',
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    textItem: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
