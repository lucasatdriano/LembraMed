import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '@/src/components/ui/Themed';
import { Plus } from 'lucide-react-native';
import Colors from '@/src/constants/Colors';
import { useState, useEffect } from 'react';
import CreateContactModal from '@/src/components/modals/createContactModal';
import CreateMedicationModal from '@/src/components/modals/createMedicationModal';
import { localStorageUtil } from '@/src/util/localStorageUtil';

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
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    return (
        <View>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Plus color={Colors.light.text} />
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
        backgroundColor: Colors.light.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        position: 'fixed',
        right: 20,
        bottom: 70,
        borderRadius: 50,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
});
