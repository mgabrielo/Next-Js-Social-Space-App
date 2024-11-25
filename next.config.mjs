/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 30,
        }
    },
    serverExternalPackages: ['@node-rs/argon2'],
    rewrites: () => {
        return [
            {
                source: '/hashtag/:tag',
                destination: '/search?q=%23:tag'
            }
        ]
    }
};

export default nextConfig;
