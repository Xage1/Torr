import dotenv from "dotenv";

dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: Number(process.env.PORT || 4000),

    DATABASE_URL: process.env.DATABASE_URL || "",

    JWT_SECRET: process.env.JWT_SECRET || "",

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",

    REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET || "",

    REFRESH_TOKEN_EXPIRES_IN:
        process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",

    SESSION_SECRET:
        process.env.SESSION_SECRET || "",

    FRONTEND_URL:
        process.env.FRONTEND_URL || "http://localhost:5173",

    API_URL:
        process.env.API_URL || "http://localhost:4000",

    SMTP_HOST:
        process.env.SMTP_HOST || "",

    SMTP_PORT:
        Number(process.env.SMTP_PORT || 587),

    SMTP_USER:
        process.env.SMTP_USER || "",

    SMTP_PASS:
        process.env.SMTP_PASS || "",

    SMTP_FROM:
        process.env.SMTP_FROM || "",

    REDIS_HOST:
        process.env.REDIS_HOST || "127.0.0.1",

    REDIS_PORT:
        Number(process.env.REDIS_PORT || 6379),

    REDIS_PASSWORD:
        process.env.REDIS_PASSWORD || "",

    MPESA_ENV:
        process.env.MPESA_ENV || "sandbox",

    MPESA_CONSUMER_KEY:
        process.env.MPESA_CONSUMER_KEY || "",

    MPESA_CONSUMER_SECRET:
        process.env.MPESA_CONSUMER_SECRET || "",

    MPESA_SHORTCODE:
        process.env.MPESA_SHORTCODE || "",

    MPESA_PASSKEY:
        process.env.MPESA_PASSKEY || "",

    MPESA_CALLBACK_URL:
        process.env.MPESA_CALLBACK_URL || "",

    MPESA_TIMEOUT_URL:
        process.env.MPESA_TIMEOUT_URL || "",

    MPESA_RESULT_URL:
        process.env.MPESA_RESULT_URL || "",

    MPESA_INITIATOR:
        process.env.MPESA_INITIATOR || "",

    MPESA_SECURITY_CREDENTIAL:
        process.env.MPESA_SECURITY_CREDENTIAL || "",

    CLOUDINARY_CLOUD_NAME:
        process.env.CLOUDINARY_CLOUD_NAME || "",

    CLOUDINARY_API_KEY:
        process.env.CLOUDINARY_API_KEY || "",

    CLOUDINARY_API_SECRET:
        process.env.CLOUDINARY_API_SECRET || "",

    COMPANY_NAME:
        process.env.COMPANY_NAME || "Torra",

    COMPANY_EMAIL:
        process.env.COMPANY_EMAIL || "",

    COMPANY_PHONE:
        process.env.COMPANY_PHONE || "",

    COMPANY_ADDRESS:
        process.env.COMPANY_ADDRESS || "",

    COMPANY_WEBSITE:
        process.env.COMPANY_WEBSITE || "",

    COMPANY_LOGO:
        process.env.COMPANY_LOGO || "",
};

export default env;