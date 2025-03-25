import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { EllipsisVertical, LogIn, LogOut, User2 } from 'lucide-react-native';
import Modal from 'react-native-modal';
import Colors from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import userService from '@/src/service/api/userService';
import { localStorageUtil } from '@/src/util/localStorageUtil';

interface MenuAccountProps {
    userId: string;
}

export default function MenuAccount({ userId }: MenuAccountProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    // const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
    const router = useRouter();

    // function switchAccount(account: any) {
    //     setSelectedAccount(account);
    //     setIsVisible(false);
    // }

    async function handleLogout(navigateToLogin?: boolean) {
        try {
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
                                await userService.logout(userId);

                                await localStorageUtil.remove('token');
                                await localStorageUtil.remove('userId');
                                await localStorageUtil.remove('refreshToken');

                                if (navigateToLogin) {
                                    router.replace('/login');
                                }

                                Alert.alert('', 'Você foi desconectado.');
                            } catch (error) {
                                console.error('Erro durante o logout:', error);
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
                <EllipsisVertical color={Colors.light.text} />
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
                    {/* {accounts.map((account) => (
                    <TouchableOpacity
                        key={account.id}
                        style={styles.menuItem}
                        onPress={() => switchAccount(account)}
                    >
                        <User2 color={Colors.light.text} />
                        <Text style={styles.textItem}>{account.name}</Text>
                    </TouchableOpacity>
                    ))} */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        // onPress={!setOpenModal}
                    >
                        <LogIn color={Colors.light.text} />
                        <Text style={styles.textItem}>
                            Logar em outra conta
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        // onPress={handleLogout()}
                    >
                        <LogOut color={Colors.light.text} />
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
