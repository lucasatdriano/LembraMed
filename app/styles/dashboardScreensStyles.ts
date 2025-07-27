import { StyleSheet } from 'react-native';
import Colors from '@/src/constants/colors';

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
    loadingIndicator: {
        marginTop: 20,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: Colors.light.text,
    },
});

export default dashboardScreenStyles;
