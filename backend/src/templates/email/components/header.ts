// backend/src/templates/email/components/header.ts

export function emailHeader(title: string) {
    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:30px 40px;">
            <tr>
                <td align="left">
                    <img
                        src="cid:torra-logo"
                        alt="Torra"
                        width="160"
                        style="display:block;border:0;"
                    />
                </td>

                <td align="right">
                    <span
                        style="
                            color:#ffffff;
                            font-size:26px;
                            font-family:Arial,Helvetica,sans-serif;
                            font-weight:bold;
                        "
                    >
                        ${title}
                    </span>
                </td>
            </tr>
        </table>
    `;
}