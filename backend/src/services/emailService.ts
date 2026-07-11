import nodemailer from "nodemailer";

const transporter =
    nodemailer.createTransport({

        host: process.env.SMTP_HOST,

        port: Number(
            process.env.SMTP_PORT
        ),

        secure: false,

        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

export async function sendInvoiceEmail(
    email: string,
    invoiceNumber: string,
    pdfPath: string
) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,

        to: email,

        subject: `Invoice ${invoiceNumber}`,

        html: `
            <h2>Payment Received</h2>

            <p>Your payment has been received successfully.</p>

            <p>Invoice Number: <b>${invoiceNumber}</b></p>

            <p>Please find attached invoice.</p>
        `,

        attachments: [
            {
                filename: `${invoiceNumber}.pdf`,
                path: pdfPath,
            },
        ],
    });
}