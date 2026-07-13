// backend/src/templates/email/components/social.ts

export function emailSocial() {
    return `
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding-top:20px;"
        >
            <tr>

                <td align="center">

                    <a
                        href="https://facebook.com"
                        style="
                            color:#D71920;
                            text-decoration:none;
                            margin:0 8px;
                            font-weight:bold;
                            font-family:Arial;
                        "
                    >
                        Facebook
                    </a>

                    |

                    <a
                        href="https://instagram.com"
                        style="
                            color:#D71920;
                            text-decoration:none;
                            margin:0 8px;
                            font-weight:bold;
                            font-family:Arial;
                        "
                    >
                        Instagram
                    </a>

                    |

                    <a
                        href="https://x.com"
                        style="
                            color:#D71920;
                            text-decoration:none;
                            margin:0 8px;
                            font-weight:bold;
                            font-family:Arial;
                        "
                    >
                        X
                    </a>

                </td>

            </tr>
        </table>
    `;
}