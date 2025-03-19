import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { EllipsisVertical, LogOut, User2 } from 'lucide-react-native';
import Modal from 'react-native-modal';
import Colors from '@/src/constants/Colors';
import { useRouter } from 'expo-router';
import userService from '@/src/service/api/userService';
import { localStorageUtil } from '@/src/util/localStorageUtil';

const accounts = [
    { id: 1, name: 'Lucas Adriano' },
    { id: 2, name: 'Dev Account' },
];

interface MenuAccountProps {
    userId: string;
}

export default function MenuAccount({ userId }: MenuAccountProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
    const router = useRouter();

    function switchAccount(account: any) {
        setSelectedAccount(account);
        setIsVisible(false);
    }

    async function handleLogout() {
        try {
            console.log('Abrir alert');
            Alert.alert(
                'Confirmar Logout',
                'Tem certeza que deseja sair da sua conta?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Sair',
                        onPress: async () => {
                            try {
                                console.log('Iniciando logout...');
                                await userService.logout(userId);

                                console.log(
                                    'Removendo tokens do localStorage...',
                                );
                                await localStorageUtil.remove('token');
                                await localStorageUtil.remove('userId');
                                await localStorageUtil.remove('refreshToken');

                                console.log(
                                    'Redirecionando para a tela de login...',
                                );
                                router.replace('/login');

                                Alert.alert('', 'Você foi desconectado.');
                            } catch (error) {
                                console.error('Erro durante o logout:', error);
                                if (error instanceof Error) {
                                    Alert.alert('Erro', error.message);
                                } else {
                                    Alert.alert(
                                        'Erro',
                                        'Ocorreu um erro inesperado ao tentar sair da conta.',
                                    );
                                }
                            } finally {
                                setIsVisible(false);
                            }
                        },
                    },
                ],
                { cancelable: true },
            );
        } catch (error) {
            console.error('Erro ao tentar exibir o alerta de logout:', error);
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro inesperado ao tentar sair da conta.',
                );
            }
        }
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
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleLogout}
                    >
                        <LogOut />
                        <Text style={styles.textItem}>Sair da conta</Text>
                    </TouchableOpacity>
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
