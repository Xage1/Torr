import { baseTemplate } from "./baseTemplate.js";

export function orderStatusEmail(
    name: string,
    orderNumber: string,
    status: string
) {
    return baseTemplate({
        title: "Order Update",
        heading: "Your Order Has Been Updated",
        body: `
            <p>Hello ${name},</p>

            <h2>Order ${orderNumber}</h2>

            <h1 style="color:#d71920">
                ${status}
            </h1>

            <p>
                Log in to your Torra account to view more details.
            </p>
        `
    });
}