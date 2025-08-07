import * as SecureStore from 'expo-secure-store';

export const secureStorageUtil = {
    get: async (key: string) => {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('SecureStore get error:', e);
            return null;
        }
    },
    set: async (key: string, value: any) => {
        try {
            await SecureStore.setItemAsync(key, JSON.stringify(value));
        } catch (e) {
            console.error('SecureStore set error:', e);
        }
    },
    remove: async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (e) {
            console.error('SecureStore remove error:', e);
        }
    },
};
