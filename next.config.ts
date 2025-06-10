import config from './package.json' with {type: 'json'};
import {NextConfig} from "next";
import { withSentryConfig } from "@sentry/nextjs"
import path from "path";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**',
            },
        ],
    },
    serverExternalPackages: ['mjml'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10MB',
        },
    },
    output: 'standalone',
    publicRuntimeConfig: {
        version: config.version,
        author: config.author,
    },
    turbopack: {
        resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    }
};

export default withSentryConfig(nextConfig, {
    org: 'vzjx-artcc',
    project: 'website',
    silent: !process.env.CI,
    disableLogger: true,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
        enabled: true
    }
})