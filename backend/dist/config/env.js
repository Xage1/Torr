import dotenv from "dotenv";
dotenv.config();
export default {
    JWT_SECRET: process.env.JWT_SECRET || "supersecret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    PORT: Number(process.env.PORT) || 4000,
    NODE_ENV: process.env.NODE_ENV || "development",
};
//# sourceMappingURL=env.js.map