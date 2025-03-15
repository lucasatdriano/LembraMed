import { StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';

export const dashboardScreenStyles = StyleSheet.create({
    titleContainer: {
        position: 'relative',
        alignItems: 'flex-start',
        marginVertical: 20,
        marginHorizontal: 'auto',
        width: '95%',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        position: 'absolute',
        top: '50%',
    },
    title: {
        backgroundColor: Colors.light.background,
        paddingHorizontal: 8,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginInlineStart: 20,
    },
});
