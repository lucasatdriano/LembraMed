import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    index: undefined;
    medicationSchedule: undefined;
    registration: undefined;
    login: undefined;
};

export type RootStackNavigationProp =
    NativeStackNavigationProp<RootStackParamList>;
