import CreateContactModal from '@/src/components/modals/createContactModal';
import CreateMedicationModal from '@/src/components/modals/createMedicationModal';
import { View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import { secureStorageUtil } from '@/src/util/secureStorageUtil';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FloatingActionButtonProps {
    screen: 'contactScreen' | 'medicationScreen';
    onContactCreated?: () => void;
    onMedicationCreated?: () => void;
}

export default function FloatingActionButton({
    screen,
    onContactCreated,
    onMedicationCreated,
}: FloatingActionButtonProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await secureStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    return (
        <View>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsModalVisible(true)}
                activeOpacity={0.7}
            >
                <Feather name="plus" size={24} color={Colors.light.text} />
            </TouchableOpacity>

            {screen === 'contactScreen' ? (
                <CreateContactModal
                    isVisible={isModalVisible}
                    setVisible={setIsModalVisible}
                    userId={userId || ''}
                    onContactCreated={onContactCreated}
                />
            ) : (
                <CreateMedicationModal
                    isVisible={isModalVisible}
                    setVisible={setIsModalVisible}
                    userId={userId || ''}
                    onMedicationCreated={onMedicationCreated}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        height: 65,
        width: 65,
        backgroundColor: Colors.light.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        position: 'absolute',
        right: 20,
        bottom: 30,
        borderRadius: 50,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
});
