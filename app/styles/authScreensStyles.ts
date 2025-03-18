import { StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';

const authScreenStyles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.light.colorPrimary,
        borderRadius: 15,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        gap: 20,
        width: '80%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.light.text,
        marginBottom: 10,
    },
    buttonsContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.colorPrimary,
        gap: 10,
        width: '100%',
    },
    separatorContainer: {
        backgroundColor: Colors.light.colorPrimary,
        position: 'relative',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 'auto',
        width: '100%',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        position: 'absolute',
        top: '50%',
    },
    separatorText: {
        backgroundColor: Colors.light.colorPrimary,
        paddingHorizontal: 8,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default authScreenStyles;
