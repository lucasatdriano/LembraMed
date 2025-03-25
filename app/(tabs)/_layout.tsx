import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Phone, CalendarDays } from 'lucide-react-native';
import { Tabs } from 'expo-router';

import Colors from '@/src/constants/colors';

function TabBarIcon({
    Icon,
    color,
}: {
    Icon: React.ElementType;
    color: string;
}) {
    return <Icon size={28} color={color} />;
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
                        <TabBarIcon Icon={Phone} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="medicationSchedule"
                options={{
                    title: 'Cronograma de Remédios',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={CalendarDays} color={color} />
                    ),
                    tabBarButton: (props) => (
                        <View style={styles.tabBarButtonContainer}>
                            <View style={styles.divider} />
                            <Pressable {...props} />
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
