import { baseTemplate } from "./baseTemplate.js";

export const twoFactorTemplate = (
    name: string,
    code: string
) =>
    baseTemplate({
        title: "Two-Factor Authentication",
        preheader: "Your verification code",
        content: `
            <h2>Hello ${name}</h2>

            <p>
                Use the code below to complete sign in.
            </p>

            <div
                style="
                    background:#111;
                    color:#fff;
                    font-size:42px;
                    text-align:center;
                    padding:25px;
                    letter-spacing:10px;
                    border-radius:10px;
                    margin:35px 0;
                "
            >
                ${code}
            </div>

            <p>
                This code expires in 5 minutes.
            </p>
        `
    });