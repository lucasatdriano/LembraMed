type Params = {
    userId?: string;
    contactId?: string;
    medicationId?: string;
};

const API_ROUTES = {
    AUTH: {
        FORGOT_PASSWORD: '/auth/forgotPassword',
        RESET_PASSWORD: '/auth/resetPassword',
        REFRESH_TOKEN: '/auth/refreshToken',
    },
    USERS: {
        REGISTER: '/users/register',
        LOGIN: '/users/login',
        PROFILE: ({ userId }: Params) => `/users/${userId}`,
        LOGOUT: ({ userId }: Params) => `/users/${userId}/logout`,
    },
    CONTACTS: {
        CONTACTS: ({ userId }: Params) => `/contacts/${userId}`,
        CREATE_CONTACT: ({ userId }: Params) => `/contacts/${userId}`,
        CONTACT: ({ userId, contactId }: Params) =>
            `/contacts/${userId}/${contactId}`,
        UPDATE_CONTACT: ({ userId, contactId }: Params) =>
            `/contacts/${userId}/${contactId}`,
        DELETE_CONTACT: ({ userId, contactId }: Params) =>
            `/contacts/${userId}/${contactId}`,
    },
    MEDICATIONS: {
        MEDICATIONS: ({ userId }: Params) => `/medications/${userId}`,
        CREATE_MEDICATION: ({ userId }: Params) => `/medications/${userId}`,
        MEDICATION: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}`,
        UPDATE_MEDICATION: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}`,
        DELETE_MEDICATION: ({ userId, medicationId }: Params) =>
            `/medications/${userId}/${medicationId}`,
    },
};

export default API_ROUTES;
