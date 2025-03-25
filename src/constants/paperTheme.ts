import {
    PaperProvider,
    configureFonts,
    MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

const fontConfig: Parameters<typeof configureFonts>[0] = {
    config: {
        default: {
            fontFamily: 'SpaceMono',
            fontWeight: 'normal',
            letterSpacing: 0,
            lineHeight: 20,
            fontSize: 14,
        },
        displaySmall: {
            fontFamily: 'SpaceMono',
            fontWeight: 'normal',
            letterSpacing: 0,
            lineHeight: 24,
            fontSize: 24,
        },
        bodyMedium: {
            fontFamily: 'SpaceMono',
            fontWeight: 'normal',
            letterSpacing: 0.15,
            lineHeight: 20,
            fontSize: 14,
        },
    },
    isV3: true,
};

export const paperTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6200ee',
        secondary: '#03dac4',
        background: '#ffffff',
        surface: '#ffffff',
        onSurface: '#000000',
    },
    fonts: configureFonts(fontConfig),
};
