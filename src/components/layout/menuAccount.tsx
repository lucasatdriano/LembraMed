import SwitchAccountModal from '@/src/components/modals/switchAccountModal';
import Colors from '@/src/constants/colors';
import userService from '@/src/service/domains/userService';
import { secureStorageUtil } from '@/src/util/secureStorageUtil';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface MenuAccountProps {
    userId: string;
}

export default function MenuAccount({ userId }: MenuAccountProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [switchAccountModalVisible, setSwitchAccountModalVisible] =
        useState(false);
    const router = useRouter();

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
                                await secureStorageUtil.remove('accessToken');
                                await secureStorageUtil.remove('userId');
                                await secureStorageUtil.remove('refreshToken');

                                if (navigateToLogin) {
                                    setSwitchAccountModalVisible(true);
                                } else {
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

    function handleLoginAnotherAccount() {
        console.log('AAAAAAAAAAAAAAA');
        setIsVisible(false);
        handleLogout(true);
    }

    return (
        <View>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setIsVisible(true)}
            >
                <MaterialCommunityIcons
                    name="dots-vertical"
                    size={24}
                    color={Colors.light.text}
                />
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
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleLoginAnotherAccount}
                    >
                        <Feather
                            name="log-in"
                            size={24}
                            color={Colors.light.text}
                        />
                        <Text style={styles.textItem}>
                            Logar em outra conta
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleLogout()}
                    >
                        <Feather
                            name="log-out"
                            size={24}
                            color={Colors.light.text}
                        />
                        <Text style={styles.textItem}>Sair da conta</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <SwitchAccountModal
                visible={switchAccountModalVisible}
                onClose={() => setSwitchAccountModalVisible(false)}
                onLoginSuccess={() => {
                    setSwitchAccountModalVisible(false);
                    router.replace('/(tabs)');
                }}
            />
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
