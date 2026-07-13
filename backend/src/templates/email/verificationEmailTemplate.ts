import { baseTemplate } from "./baseTemplate.js";

export const verificationEmailTemplate = (
    name: string,
    verificationUrl: string
) =>
    baseTemplate({
        title: "Verify Your Email",
        preheader: "Verify your Torra account",
        content: `
            <h2 style="margin:0 0 20px;color:#111;">
                Welcome to Torra, ${name}
            </h2>

            <p style="font-size:16px;line-height:28px;color:#555;">
                Thank you for creating your account.
                Please verify your email address to activate your account.
            </p>

            <div style="text-align:center;margin:40px 0;">
                <a href="${verificationUrl}"
                    style="
                        background:#D71920;
                        color:#fff;
                        padding:16px 36px;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:bold;
                        display:inline-block;
                    ">
                    Verify Email
                </a>
            </div>

            <p style="color:#777;">
                If the button doesn't work:
            </p>

            <p>
                <a href="${verificationUrl}">
                    ${verificationUrl}
                </a>
            </p>

            <p style="color:#999;">
                This verification link expires in 24 hours.
            </p>
        `
    });