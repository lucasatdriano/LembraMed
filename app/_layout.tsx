import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'login',
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null,
    );

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
            checkToken();
        }
    }, [loaded]);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Erro ao verificar o token', error);
            setIsAuthenticated(false);
        }
    };

    if (isAuthenticated === null || !loaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return <RootLayoutNav isAuthenticated={isAuthenticated} />;
}

function RootLayoutNav({ isAuthenticated }: { isAuthenticated: boolean }) {
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const isAuthRoute =
            segments[0] === 'login' || segments[0] === 'registration';

        if (!isAuthenticated && !isAuthRoute) {
            router.replace('/login');
        }
    }, [isAuthenticated, segments]);

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                    name="registration"
                    options={{ headerShown: false }}
                />
            </Stack>
        </ThemeProvider>
    );
}
