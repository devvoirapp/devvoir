import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "**", // Allow all HTTPS domains (not recommended for production)
        },],
    }
};

export default nextConfig;
