import { baseTemplate } from "./baseTemplate.js";

export const invoiceTemplate = (
    name: string,
    invoiceNumber: string,
    amount: string,
    downloadUrl: string
) =>
    baseTemplate({
        title: "Invoice",
        preheader: "Your Torra invoice",
        content: `
            <h2>Hello ${name}</h2>

            <p>
                Thank you for shopping with Torra.
            </p>

            <table style="width:100%;margin:30px 0;">
                <tr>
                    <td><strong>Invoice</strong></td>
                    <td>${invoiceNumber}</td>
                </tr>

                <tr>
                    <td><strong>Amount</strong></td>
                    <td>KES ${amount}</td>
                </tr>
            </table>

            <div style="text-align:center;margin:40px 0;">
                <a
                    href="${downloadUrl}"
                    style="
                        background:#D71920;
                        color:white;
                        text-decoration:none;
                        padding:16px 40px;
                        border-radius:8px;
                        display:inline-block;
                        font-weight:bold;
                    "
                >
                    Download Invoice
                </a>
            </div>

            <p>
                We appreciate your business.
            </p>
        `
    });