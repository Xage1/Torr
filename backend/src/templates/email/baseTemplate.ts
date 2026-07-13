interface EmailOptions {
    title: string;
    heading: string;
    preheader?: string;
    content: string;
    buttonText?: string;
    buttonUrl?: string;
}

export default function baseTemplate({
    title,
    heading,
    preheader = "",
    content,
    buttonText,
    buttonUrl
}: EmailOptions) {

    return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>${title}</title>

</head>

<body
style="
margin:0;
padding:0;
background:#0b0b0b;
font-family:Arial,Helvetica,sans-serif;
">

<div style="display:none;max-height:0;overflow:hidden;">
${preheader}
</div>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#0b0b0b;
padding:40px 0;
">

<tr>

<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 25px 80px rgba(0,0,0,.35);
">

<!-- Header -->

<tr>

<td
align="center"
style="
background:#101010;
padding:45px;
">

<img

src="cid:torra-logo"

width="150"

style="
display:block;
margin-bottom:20px;
"/>

<div
style="
color:#ffffff;
font-size:30px;
font-weight:700;
letter-spacing:3px;
">

TORRA

</div>

<div
style="
margin-top:8px;
font-size:14px;
color:#ff2a2a;
letter-spacing:4px;
">

ELECTRICAL SERVICES

</div>

</td>

</tr>

<!-- Title -->

<tr>

<td
style="
padding:50px 60px 10px;
">

<h1
style="
margin:0;
font-size:34px;
font-weight:700;
color:#111111;
">

${heading}

</h1>

</td>

</tr>

<!-- Content -->

<tr>

<td
style="
padding:20px 60px;
font-size:16px;
line-height:30px;
color:#444;
">

${content}

</td>

</tr>

${
buttonText && buttonUrl

?

`

<tr>

<td
align="center"
style="padding:25px 60px 50px;">

<a

href="${buttonUrl}"

style="

display:inline-block;

background:#ff0000;

padding:18px 42px;

color:#fff;

text-decoration:none;

font-size:16px;

font-weight:700;

border-radius:8px;

">

${buttonText}

</a>

</td>

</tr>

`

:

""

}

<!-- Divider -->

<tr>

<td>

<hr
style="
border:none;
height:1px;
background:#eeeeee;
"/>

</td>

</tr>

<!-- Support -->

<tr>

<td
style="
padding:35px 60px;
">

<h3
style="
margin:0;
color:#111;
">

Need Help?

</h3>

<p
style="
color:#666;
line-height:28px;
">

Email:
support@torra.co.ke

<br>

Phone:
+254 XXX XXX XXX

<br>

Website:
https://torraelectricalservices.com/

</p>

</td>

</tr>

<!-- Footer -->

<tr>

<td
align="center"
style="
background:#101010;
padding:35px;
">

<div
style="
font-size:13px;
color:#999;
">

© ${new Date().getFullYear()} Torra Electrical Services

</div>

<div
style="
margin-top:15px;
">

<a
href="#"
style="
color:#ff0000;
text-decoration:none;
margin:0 10px;
">
Facebook
</a>

<a
href="#"
style="
color:#ff0000;
text-decoration:none;
margin:0 10px;
">
Instagram
</a>

<a
href="#"
style="
color:#ff0000;
text-decoration:none;
margin:0 10px;
">
LinkedIn
</a>

</div>

<div
style="
margin-top:20px;
font-size:11px;
color:#777;
line-height:22px;
">

This is an automated email.

Please do not reply directly to this message.

</div>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>

`;

}