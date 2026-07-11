import dayjs from "dayjs";

export interface MpesaMetadata {
    amount: number;
    receipt: string;
    phone: string;
    transactionDate: Date | null;
}

export function extractMpesaMetadata(callback: any): MpesaMetadata {
    const metadata =
        callback?.Body?.stkCallback?.CallbackMetadata?.Item || [];

    const get = (name: string) =>
        metadata.find((x: any) => x.Name === name)?.Value;

    const transactionDate = get("TransactionDate");

    return {
        amount: Number(get("Amount") || 0),

        receipt: String(get("MpesaReceiptNumber") || ""),

        phone: String(get("PhoneNumber") || ""),

        transactionDate: transactionDate
            ? dayjs(String(transactionDate), "YYYYMMDDHHmmss").toDate()
            : null,
    };
}