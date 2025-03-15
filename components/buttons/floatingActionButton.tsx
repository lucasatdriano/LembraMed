import { StyleSheet, TouchableOpacity } from 'react-native';

import { View } from '@/components/ui/Themed';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import CreateContactModal from '@/components/modals/createContactModal';
import CreateMedicationModal from '@/components/modals/createMedicationModal';

interface FloatingActionButtonProps {
    type: 'contactScreen' | 'medicationScreen';
}

export default function FloatingActionButton({
    type,
}: FloatingActionButtonProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Plus color={Colors.light.text} />
            </TouchableOpacity>

            {type === 'contactScreen' ? (
                <CreateContactModal
                    isVisible={isModalVisible}
                    setVisible={setIsModalVisible}
                />
            ) : (
                <CreateMedicationModal
                    isVisible={isModalVisible}
                    setVisible={setIsModalVisible}
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
