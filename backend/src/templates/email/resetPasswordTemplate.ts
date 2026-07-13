import { baseTemplate } from "./baseTemplate.js";

export const resetPasswordTemplate = (
    name: string,
    resetUrl: string
) =>
    baseTemplate({
        title: "Reset Password",
        preheader: "Password reset request",
        content: `
            <h2>Hello ${name}</h2>

            <p>
                We received a request to reset your password.
            </p>

            <div style="text-align:center;margin:40px 0;">
                <a href="${resetUrl}"
                style="
                    background:#D71920;
                    color:#fff;
                    padding:16px 36px;
                    text-decoration:none;
                    border-radius:8px;
                    display:inline-block;
                    font-weight:bold;
                ">
                    Reset Password
                </a>
            </div>

            <p>
                If you did not request this, simply ignore this email.
            </p>

            <p>
                This link expires in 30 minutes.
            </p>
        `
    });