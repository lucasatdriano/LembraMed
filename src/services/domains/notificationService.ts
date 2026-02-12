import { api } from '../api';
import API_ROUTES from '../api/routes';

export interface SendNotificationRequest {
    userid: string;
    title: string;
    message?: string;
    tag?: string;
}

export interface SendNotificationResponse {
    success: boolean;
    message: string;
    details: {
        total: number;
        successful: number;
        failed: number;
    };
}

export interface Notification {
    id: string;
    userid: string;
    title: string;
    message?: string;
    sentat: string;
    readat?: string;
}

export interface NotificationsResponse {
    success: boolean;
    notifications: Notification[];
}

const notificationService = {
    sendNotification: async (data: SendNotificationRequest) => {
        try {
            const response = await api.post<SendNotificationResponse>(
                API_ROUTES.NOTIFICATIONS.SEND_NOTIFICATION,
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserNotifications: async (limit: number = 50, offset: number = 0) => {
        try {
            const response = await api.get<NotificationsResponse>(
                API_ROUTES.NOTIFICATIONS.GET_USER_NOTIFICATIONS,
                { params: { limit, offset } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async (notificationId: string) => {
        try {
            const response = await api.patch<{
                success: boolean;
                message: string;
            }>(API_ROUTES.NOTIFICATIONS.MARK_AS_READ({ notificationId }));
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default notificationService;
