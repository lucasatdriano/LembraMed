import { Account } from '@/interfaces/account';
import { setCookie, destroyCookie } from 'nookies';

export interface LoginResponse {
    success: boolean;
    user: {
        id: string;
        name: string;
        username: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    deviceId: string;
}

class AccountManager {
    private accounts: Record<string, Account> = {};
    private currentAccountId: string | null = null;

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem('accounts');
        if (stored) {
            this.accounts = JSON.parse(stored);
        }

        this.currentAccountId = localStorage.getItem('currentAccount');
    }

    private saveToStorage() {
        localStorage.setItem('accounts', JSON.stringify(this.accounts));
        if (this.currentAccountId) {
            localStorage.setItem('currentAccount', this.currentAccountId);
        } else {
            localStorage.removeItem('currentAccount');
        }
    }

    addAccount(loginResponse: LoginResponse): Account {
        const account: Account = {
            userId: loginResponse.user.id,
            username: loginResponse.user.username,
            name: loginResponse.user.name,
            accessToken: loginResponse.tokens.accessToken,
            refreshToken: loginResponse.tokens.refreshToken,
            deviceId: loginResponse.deviceId,
            lastUsed: new Date(),
        };

        this.accounts[account.userId] = account;
        this.saveToStorage();

        return account;
    }

    switchAccount(userId: string): Account {
        const account = this.accounts[userId];
        if (!account) {
            throw new Error('Conta não encontrada');
        }

        setCookie(null, 'accessToken', account.accessToken, {
            maxAge: 60 * 60, // 1h
            path: '/',
        });
        setCookie(null, 'refreshToken', account.refreshToken, {
            maxAge: 60 * 24 * 60 * 60, // 60d
            path: '/',
        });
        setCookie(null, 'userId', account.userId, {
            maxAge: 60 * 24 * 60 * 60,
            path: '/',
        });
        setCookie(null, 'deviceId', account.deviceId, {
            maxAge: 60 * 24 * 60 * 60,
            path: '/',
        });

        this.currentAccountId = userId;
        account.lastUsed = new Date();
        this.accounts[userId] = account;
        this.saveToStorage();

        return account;
    }

    getCurrentAccount(): Account | null {
        return this.currentAccountId
            ? this.accounts[this.currentAccountId]
            : null;
    }

    getAllAccounts(): Account[] {
        return Object.values(this.accounts).sort(
            (a, b) =>
                new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime(),
        );
    }

    logoutAccount(userId: string) {
        if (userId === this.currentAccountId) {
            destroyCookie(null, 'accessToken');
            destroyCookie(null, 'refreshToken');
            destroyCookie(null, 'userId');
            destroyCookie(null, 'deviceId');
            this.currentAccountId = null;
        }
        delete this.accounts[userId];
        this.saveToStorage();
    }
}

export const accountManager = new AccountManager();
