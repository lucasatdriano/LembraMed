import { StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';

const dashboardScreenStyles = StyleSheet.create({
    containerPage: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 15,
        marginTop: 10,
    },
    titleContainer: {
        position: 'relative',
        alignItems: 'flex-start',
        marginVertical: 10,
        marginHorizontal: 'auto',
        width: '95%',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.light.text,
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
    containerCards: {
        gap: 10,
    },
});

export default dashboardScreenStyles;
