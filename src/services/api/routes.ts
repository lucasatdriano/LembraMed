type Params = {
    contactId?: string;
    medicationId?: string;
    deviceId?: string;
    notificationId?: string;
};

const API_ROUTES = {
    AUTH: {
        REFRESH_TOKEN: '/auth/refreshtoken',
        TOKEN_STATUS: '/auth/tokenstatus',
        FORGOT_PASSWORD: '/auth/forgotpassword',
        RESET_PASSWORD: '/auth/resetpassword',
    },
    USERS: {
        REGISTER: '/users/register',
        LOGIN_MULTI: '/users/login',
        PROFILE: `/users`,
        LOGOUT: '/users/logout',
    },
    CONTACTS: {
        SEARCH_CONTACTS: `/contacts/search`,
        CONTACT: ({ contactId }: Params) => `/contacts/${contactId}`,
        CREATE_CONTACT: `/contacts/`,
        UPDATE_CONTACT: ({ contactId }: Params) => `/contacts/${contactId}`,
        DELETE_CONTACT: ({ contactId }: Params) => `/contacts/${contactId}`,
    },
    MEDICATIONS: {
        SEARCH_MEDICATIONS: `/medications/search`,
        MEDICATION: ({ medicationId }: Params) =>
            `/medications/${medicationId}`,
        MEDICATION_HISTORY: ({ medicationId }: Params) =>
            `/medications/${medicationId}/history`,
        CREATE_MEDICATION: `/medications/create`,
        REGISTER_PENDING_CONFIRMATION: ({ medicationId }: Params) =>
            `/medications/${medicationId}/pending`,
        CANCEL_PENDING_DOSE: ({ medicationId }: Params) =>
            `/medications/${medicationId}/cancel`,
        UPDATE_MEDICATION: ({ medicationId }: Params) =>
            `/medications/${medicationId}`,
        DELETE_MEDICATION: ({ medicationId }: Params) =>
            `/medications/${medicationId}`,
    },
    DEVICES: {
        GET_ACCOUNTS: ({ deviceId }: Params) => `/devices/${deviceId}/accounts`,
        REGISTER_PUSH_SUBSCRIPTION: '/devices/push-subscription',
        REMOVE_DEVICE: ({ deviceId }: Params) => `/devices/${deviceId}`,
    },
    NOTIFICATIONS: {
        SEND_NOTIFICATION: '/notifications/send',
        GET_USER_NOTIFICATIONS: '/notifications/user/',
        MARK_AS_READ: ({ notificationId }: Params) =>
            `/notifications/${notificationId}/read`,
    },
};

export default API_ROUTES;
