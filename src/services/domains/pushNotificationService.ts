import { api } from '../api';
import API_ROUTES from '../api/routes';
import { parseCookies } from 'nookies';

class PushNotificationService {
    private swRegistration: ServiceWorkerRegistration | null = null;
    private vapidPublicKey: string | null = null;

    private getToken(): string | null {
        const cookies = parseCookies();
        return cookies.authToken || cookies.accessToken || null;
    }

    private getDeviceId(): string | null {
        const cookies = parseCookies();
        return cookies.deviceId || null;
    }

    urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    isSupported(): boolean {
        return (
            'Notification' in window &&
            'serviceWorker' in navigator &&
            'PushManager' in window
        );
    }

    async getVapidPublicKey(): Promise<string> {
        try {
            const response = await api.get<{ publicKey: string }>(
                API_ROUTES.NOTIFICATIONS.VAPID_PUBLIC_KEY,
            );
            this.vapidPublicKey = response.data.publicKey;
            return this.vapidPublicKey;
        } catch (error) {
            console.error('Erro ao buscar chave VAPID:', error);
            throw error;
        }
    }

    async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
        try {
            this.swRegistration =
                await navigator.serviceWorker.register('/sw.js');
            return this.swRegistration;
        } catch (error) {
            console.error('❌ Erro ao registrar Service Worker:', error);
            throw error;
        }
    }

    async requestPermission(): Promise<boolean> {
        try {
            const permission = await Notification.requestPermission();

            return permission === 'granted';
        } catch (error) {
            console.error('❌ Erro ao pedir permissão:', error);
            return false;
        }
    }

    async subscribe(): Promise<PushSubscription> {
        try {
            if (!this.swRegistration) {
                await this.registerServiceWorker();
            }

            if (!this.vapidPublicKey) {
                await this.getVapidPublicKey();
            }

            let subscription =
                await this.swRegistration!.pushManager.getSubscription();

            if (!subscription) {
                const applicationServerKey = this.urlBase64ToUint8Array(
                    this.vapidPublicKey!,
                ).buffer as ArrayBuffer;

                subscription = await this.swRegistration!.pushManager.subscribe(
                    {
                        userVisibleOnly: true,
                        applicationServerKey,
                    },
                );
            } else {
                console.error('Subscription já existente:', subscription);
            }

            const token = this.getToken();
            const deviceId = this.getDeviceId();

            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            if (!deviceId) {
                throw new Error('Device ID não encontrado');
            }

            const subscriptionData = subscription.toJSON();

            const payload = {
                ...subscriptionData,
                deviceId: deviceId,
            };

            await api.post(API_ROUTES.NOTIFICATIONS.SUBSCRIBE, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return subscription;
        } catch (error) {
            console.error('❌ Erro ao inscrever:', error);
            throw error;
        }
    }

    async unsubscribe(): Promise<boolean> {
        try {
            if (!this.swRegistration) {
                await this.registerServiceWorker();
            }

            const subscription =
                await this.swRegistration!.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();

                const token = this.getToken();

                await api.post(
                    API_ROUTES.NOTIFICATIONS.UNSUBSCRIBE,
                    { endpoint: subscription.endpoint },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao desinscrever:', error);
            throw error;
        }
    }

    async getStatus(): Promise<
        'unsupported' | 'denied' | 'granted' | 'subscribed' | 'default'
    > {
        if (!this.isSupported()) {
            return 'unsupported';
        }

        const permission = Notification.permission;

        if (permission === 'denied') return 'denied';
        if (permission === 'granted') {
            try {
                if (!this.swRegistration) {
                    await this.registerServiceWorker();
                }
                const subscription =
                    await this.swRegistration!.pushManager.getSubscription();
                return subscription ? 'subscribed' : 'granted';
            } catch {
                return 'granted';
            }
        }

        return 'default';
    }

    async initialize(): Promise<boolean> {
        if (!this.isSupported()) {
            return false;
        }

        try {
            const token = this.getToken();
            const deviceId = this.getDeviceId();

            if (!token) {
                return false;
            }

            if (!deviceId) {
                return false;
            }

            const granted = await this.requestPermission();
            if (!granted) return false;

            await this.registerServiceWorker();
            await this.getVapidPublicKey();
            await this.subscribe();

            return true;
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            return false;
        }
    }
}

const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
