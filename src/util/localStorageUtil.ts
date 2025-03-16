import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorageUtil = {
    get: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Erro ao recuperar dados do AsyncStorage:', e);
            return null;
        }
    },
    set: async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Erro ao salvar dados no AsyncStorage:', e);
        }
    },
    remove: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Erro ao remover dados do AsyncStorage:', e);
        }
    },
};
