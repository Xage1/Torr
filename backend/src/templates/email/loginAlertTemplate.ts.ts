import { baseTemplate } from "./baseTemplate.js";

export const loginAlertTemplate = (
    name: string,
    device: string,
    ip: string,
    location: string,
    time: string
) =>
    baseTemplate({
        title: "New Login",
        preheader: "New login detected",
        content: `
            <h2>Hello ${name}</h2>

            <p>
                We detected a new login to your Torra account.
            </p>

            <table style="width:100%;margin-top:25px;">
                <tr>
                    <td><strong>Device</strong></td>
                    <td>${device}</td>
                </tr>

                <tr>
                    <td><strong>IP</strong></td>
                    <td>${ip}</td>
                </tr>

                <tr>
                    <td><strong>Location</strong></td>
                    <td>${location}</td>
                </tr>

                <tr>
                    <td><strong>Time</strong></td>
                    <td>${time}</td>
                </tr>
            </table>

            <p style="margin-top:30px;">
                If this wasn't you, immediately change your password.
            </p>
        `
    });