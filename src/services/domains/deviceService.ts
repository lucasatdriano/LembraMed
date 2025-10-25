import { api } from '../api';
import API_ROUTES from '../api/routes';

export interface DeviceAccount {
    userid: string;
    name: string;
    username: string;
    lastused: string;
    createdat: string;
}

export interface PushSubscriptionRequest {
    userid: string;
    deviceid: string;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
}

export interface PushSubscriptionResponse {
    success: boolean;
    message: string;
    subscriptionId: string;
}

const deviceService = {
    getDeviceAccounts: async (deviceId: string) => {
        try {
            const response = await api.get<{
                success: boolean;
                accounts: DeviceAccount[];
            }>(API_ROUTES.DEVICES.GET_ACCOUNTS({ deviceId }));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    registerPushSubscription: async (data: PushSubscriptionRequest) => {
        try {
            const response = await api.post<PushSubscriptionResponse>(
                API_ROUTES.DEVICES.REGISTER_PUSH_SUBSCRIPTION,
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removeDevice: async (deviceId: string) => {
        try {
            const response = await api.delete<{
                success: boolean;
                message: string;
            }>(API_ROUTES.DEVICES.REMOVE_DEVICE({ deviceId }));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default deviceService;
