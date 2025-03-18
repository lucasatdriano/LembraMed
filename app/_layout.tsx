import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { localStorageUtil } from '@/src/util/localStorageUtil';

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
    const router = useRouter();

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await localStorageUtil.get('token');
                setIsAuthenticated(!!token);
            } catch (err) {
                console.error('Erro ao verificar o token', err);
                setIsAuthenticated(false);
            }
        };

        if (loaded) {
            SplashScreen.hideAsync();
            checkToken();
        }
    }, [loaded]);

    if (isAuthenticated === null || !loaded) return null;

    return <RootLayoutNav isAuthenticated={isAuthenticated} />;
}

function RootLayoutNav({ isAuthenticated }: { isAuthenticated: boolean }) {
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const inAuthGroup =
            segments[0] === 'login' || segments[0] === 'registration';
        if (isAuthenticated && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!isAuthenticated && !inAuthGroup) {
            router.replace('/login');
        }
    }, [isAuthenticated]);

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
