<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
                    <tr>
                        <td style="padding:28px 24px 12px 24px;">
                            <p style="margin:0 0 8px 0; color:#111827; font-size:22px; font-weight:700;">
                                {{ $title }}
                            </p>
                            <p style="margin:0; color:#4b5563; font-size:15px; line-height:1.55;">
                                {{ $description }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 24px;">
                            <div style="background:#111827; color:#ffffff; border-radius:12px; text-align:center; padding:18px 16px;">
                                <p style="margin:0 0 8px 0; font-size:13px; color:#d1d5db;">Tu código OTP</p>
                                <p style="margin:0; font-size:34px; font-weight:700; letter-spacing:8px;">{{ $code }}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:4px 24px 24px 24px;">
                            <p style="margin:0; color:#4b5563; font-size:14px; line-height:1.6;">
                                Este código expira en <strong>{{ $expiresInMinutes }} minutos</strong>.
                            </p>
                            <p style="margin:12px 0 0 0; color:#6b7280; font-size:13px; line-height:1.6;">
                                Si no solicitaste este código, puedes ignorar este correo.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
