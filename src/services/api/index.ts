'use client';

import { api, extractAxiosError } from './api';
import { setupRequestInterceptor } from './interceptors/request';
import { setupResponseInterceptor } from './interceptors/response';

setupRequestInterceptor(api);
setupResponseInterceptor(api);

export { api, extractAxiosError };
