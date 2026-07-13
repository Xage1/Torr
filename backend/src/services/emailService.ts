import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
) => {
    await transporter.sendMail({
        from: `"Torra" <${env.SMTP_FROM}>`,
        to,
        subject,
        html,
    });
};

export default transporter;