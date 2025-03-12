import React from 'react';
import { View, Pressable } from 'react-native';
import { Phone, Calendar, Info } from 'lucide-react-native';
import { Link, Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

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
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:
                    Colors[colorScheme ?? 'light'].tabIconSelected,
                tabBarInactiveTintColor:
                    Colors[colorScheme ?? 'light'].tabIconDefault,
                tabBarStyle: {
                    backgroundColor:
                        colorScheme === 'dark' ? '#222' : '#E0E8EB',
                    borderTopWidth: 1,
                    borderTopColor:
                        Colors[colorScheme ?? 'light'].tabIconDefault,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 55,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 2, height: -2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 8,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Lista Telefonica',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={Phone} color={color} />
                    ),
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <Info
                                        size={25}
                                        color={
                                            Colors[colorScheme ?? 'light'].text
                                        }
                                        style={{
                                            marginRight: 15,
                                            opacity: pressed ? 0.5 : 1,
                                        }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />

            <Tabs.Screen
                name="two"
                options={{
                    title: 'Cronograma de Remédios',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon Icon={Calendar} color={color} />
                    ),
                    tabBarButton: (props) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 1,
                                    height: 35,
                                    backgroundColor:
                                        Colors[colorScheme ?? 'light']
                                            .tabIconDefault,
                                }}
                            />
                            <Pressable {...props} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
