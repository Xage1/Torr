// backend/src/templates/email/components/button.ts

export function emailButton(
    text: string,
    url: string
) {
    return `
        <table
            cellpadding="0"
            cellspacing="0"
            align="center"
            style="margin:35px auto;"
        >
            <tr>
                <td
                    align="center"
                    bgcolor="#D71920"
                    style="
                        border-radius:8px;
                    "
                >
                    <a
                        href="${url}"
                        style="
                            display:inline-block;
                            padding:16px 34px;
                            color:#ffffff;
                            text-decoration:none;
                            font-family:Arial,Helvetica,sans-serif;
                            font-size:16px;
                            font-weight:bold;
                        "
                    >
                        ${text}
                    </a>
                </td>
            </tr>
        </table>
    `;
}