// backend/src/templates/email/components/footer.ts

import { emailSocial } from "./social.js";

export function emailFooter() {
    return `
        ${emailSocial()}

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
                margin-top:30px;
                border-top:1px solid #eeeeee;
                padding-top:25px;
            "
        >
            <tr>

                <td
                    align="center"
                    style="
                        color:#888888;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:13px;
                        line-height:24px;
                    "
                >

                    <strong style="color:#111111;">
                        Torra Electrical Services
                    </strong>

                    <br>

                    Premium Electrical & Industrial Supplies

                    <br>

                    Nairobi, Kenya

                    <br><br>

                    support@torra.co.ke

                    <br>

                    +254 XXX XXX XXX

                    <br><br>

                    © ${new Date().getFullYear()} Torra.
                    All Rights Reserved.

                </td>

            </tr>
        </table>
    `;
}