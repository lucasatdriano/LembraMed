import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import path from 'path';

const pwaConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    dynamicStartUrl: true,
    sw: 'custom-worker.js',
    buildExcludes: [
        /middleware-manifest\.json$/,
        /_buildManifest\.js$/,
        /_ssgManifest\.js$/,
        /app-build-manifest\.json$/,
    ],
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
                },
            },
        },
    ],
});

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/components': path.resolve(__dirname, 'src/components'),
            '@/services': path.resolve(__dirname, 'src/services'),
            '@/validations': path.resolve(__dirname, 'src/validations'),
            '@/modals': path.resolve(__dirname, 'src/components/modals'),
        };
        return config;
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qzlcjbvacfvkxfwiuodo.supabase.co',
                port: '',
                pathname: '/storage/v1/object/sign/**',
            },
        ],
    },

    reactStrictMode: false,
    productionBrowserSourceMaps: true,

    experimental: {
        optimizeCss: true,
    },
};

export default pwaConfig(nextConfig);
