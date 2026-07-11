import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export async function generateInvoicePDF(invoice: any) {
    const invoicesDir = path.join(process.cwd(), "uploads", "invoices");

    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filename = `${invoice.invoiceNumber}.pdf`;
    const filepath = path.join(invoicesDir, filename);

    const doc = new PDFDocument({
        size: "A4",
        margin: 50,
    });

    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // COMPANY HEADER

    doc.fontSize(24)
        .text("TORRA STORE", {
            align: "center",
        });

    doc.moveDown();

    doc.fontSize(12)
        .text("Nairobi, Kenya")
        .text("support@torra.co.ke")
        .text("+254700000000", {
            align: "center",
        });

    doc.moveDown(2);

    // INVOICE DETAILS

    doc.fontSize(18)
        .text("TAX INVOICE");

    doc.moveDown();

    doc.fontSize(12)
        .text(`Invoice #: ${invoice.invoiceNumber}`)
        .text(`Order #: ${invoice.order.orderNumber}`)
        .text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`);

    doc.moveDown();

    doc.text(`Customer: ${invoice.order.user?.name || "Customer"}`);
    doc.text(`Email: ${invoice.order.user?.email || "-"}`);

    doc.moveDown(2);

    // TABLE HEADER

    doc.fontSize(12);

    doc.text("Product", 50);
    doc.text("Qty", 300);
    doc.text("Price", 350);
    doc.text("Total", 450);

    doc.moveDown();

    doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

    doc.moveDown();

    invoice.order.OrderItem.forEach((item: any) => {

        const total =
            Number(item.price) *
            item.quantity;

        doc.text(item.product.title, 50);

        doc.text(
            String(item.quantity),
            300
        );

        doc.text(
            Number(item.price).toFixed(2),
            350
        );

        doc.text(
            total.toFixed(2),
            450
        );

        doc.moveDown();
    });

    doc.moveDown();

    doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

    doc.moveDown();

    doc.text(
        `Subtotal: KES ${Number(invoice.subtotal).toFixed(2)}`,
        {
            align: "right",
        }
    );

    doc.text(
        `VAT (16%): KES ${Number(invoice.tax).toFixed(2)}`,
        {
            align: "right",
        }
    );

    doc.fontSize(14)
        .text(
            `TOTAL: KES ${Number(invoice.total).toFixed(2)}`,
            {
                align: "right",
            }
        );

    doc.moveDown(2);

    // QR CODE

    const qrData = JSON.stringify({
        invoiceNumber: invoice.invoiceNumber,
        orderNumber: invoice.order.orderNumber,
        total: invoice.total,
    });

    const qrImage = await QRCode.toDataURL(qrData);

    const base64 = qrImage.replace(
        /^data:image\/png;base64,/,
        ""
    );

    const qrBuffer = Buffer.from(
        base64,
        "base64"
    );

    doc.image(
        qrBuffer,
        50,
        doc.y,
        {
            fit: [120, 120],
        }
    );

    doc.text(
        "Scan to verify invoice",
        200,
        doc.y + 30
    );

    doc.moveDown(8);

    doc.text(
        "Thank you for shopping with Torra Store.",
        {
            align: "center",
        }
    );

    doc.end();

    return new Promise<string>((resolve) => {
        stream.on("finish", () => {
            resolve(filepath);
        });
    });
}