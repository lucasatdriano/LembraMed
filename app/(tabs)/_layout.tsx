import Colors from '@/src/constants/colors';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

function TabBarIcon({ name, color }: { name: FeatherIconName; color: string }) {
    return <Feather name={name} size={24} color={color} />;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.tabIconSelected,
                tabBarInactiveTintColor: Colors.light.tabIconDefault,
                tabBarStyle: styles.tabBar,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Lista Telefônica',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="phone" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="medicationSchedule"
                options={{
                    title: 'Cronograma de Remédios',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="calendar" color={color} />
                    ),
                    tabBarButton: (props: PressableProps) => (
                        <View style={styles.tabBarButtonContainer}>
                            <View style={styles.divider} />
                            <Pressable {...props} style={props.style} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.light.colorPrimary,
        borderTopColor: Colors.light.tabIconDefault,
        borderTopWidth: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 55,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    tabBarButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 35,
        backgroundColor: Colors.light.tabIconDefault,
    },
});
