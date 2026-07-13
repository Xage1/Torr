import transporter from "../config/mail.js";

interface MailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
}

export async function sendMail({
    to,
    subject,
    html,
    text,
    attachments = [],
}: MailOptions) {
    return transporter.sendMail({
        from: `"Torra Electrical" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        html,
        text,
        attachments,
    });
}