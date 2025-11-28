export interface Account {
    userId: string;
    username: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    deviceId: string;
    lastUsed: Date;
}
