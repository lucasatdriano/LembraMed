type Params = {
    userId?: string;
    contactId?: string;
    medicationId?: string;
    deviceId?: string;
    notificationId?: string;
};

const API_ROUTES = {
    AUTH: {
        FORGOT_PASSWORD: '/auth/forgotpassword',
        RESET_PASSWORD: '/auth/resetpassword',
        REFRESH_TOKEN: '/auth/refreshtoken',
    },
    USERS: {
        REGISTER: '/users/register',
        LOGIN_MULTI: '/users/login',
        PROFILE: ({ userId }: Params) => `/users/${userId}`,
        LOGOUT: '/users/logout',
    },
    CONTACTS: {
        SEARCH_CONTACTS: ({ userId }: Params) => `/contacts/${userId}/search`,
        CONTACT: ({ userId, contactId }: Params) =>
            `/contacts/${userId}/${contactId}`,
        CREATE_CONTACT: ({ userId }: Params) => `/contacts/${userId}`,
        UPDATE_CONTACT: ({ userId, contactId }: Params) =>
            `/contacts/${userId}/${contactId}`,
        DELETE_CONTACT: ({ userId, contactId }: Params) =>
            `/contacts/${userId}/${contactId}`,
    },
    MEDICATIONS: {
        SEARCH_MEDICATIONS: ({ userId }: Params) =>
            `/medications/${userId}/search`,
        MEDICATION: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}`,
        MEDICATION_HISTORY: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}/history`,
        CREATE_MEDICATION: ({ userId }: Params) =>
            `/medications/${userId}/create`,
        MARK_AS_TAKEN: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}/taken`,
        REGISTER_MISSED_DOSE: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}/missed`,
        FORCE_DOSE_ADVANCE: ({ medicationId }: Params) =>
            `/medications/${medicationId}/advance`,
        UPDATE_MEDICATION: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}`,
        DELETE_MEDICATION: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}`,
    },
    DEVICES: {
        GET_ACCOUNTS: ({ deviceId }: Params) => `/devices/${deviceId}/accounts`,
        REGISTER_PUSH_SUBSCRIPTION: '/devices/push-subscription',
        REMOVE_DEVICE: ({ deviceId }: Params) => `/devices/${deviceId}`,
    },
    NOTIFICATIONS: {
        SEND_NOTIFICATION: '/notifications/send',
        GET_USER_NOTIFICATIONS: ({ userId }: Params) =>
            `/notifications/user/${userId}`,
        MARK_AS_READ: ({ notificationId }: Params) =>
            `/notifications/${notificationId}/read`,
    },
};

export default API_ROUTES;
