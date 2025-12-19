<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 30px;
            color: white;
        }
        .logo {
            text-align: center;
            font-size: 40px;
            margin-bottom: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            background: white;
            color: #333;
            padding: 30px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .reset-code {
            background: #f7fafc;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #667eea;
            font-family: 'Courier New', monospace;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 20px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>

        <div class="content">
            <p>Hello {{ $userName }},</p>
            
            <p>We received a request to reset your password for your <strong>Asterank</strong> account.</p>
            
            <p>Your password reset code is:</p>
            
            <div class="reset-code">
                <div class="code">{{ $resetCode }}</div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> This code will expire in 60 minutes. If you didn't request this password reset, please ignore this email.
            </div>
            
            <p>To reset your password:</p>
            <ol>
                <li>Return to the password reset page</li>
                <li>Enter this 6-digit code</li>
                <li>Create your new password</li>
            </ol>
            
            <p>If you have any questions or didn't request this reset, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>The Asterank Team</strong></p>
        </div>

        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; {{ date('Y') }} Asterank. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
