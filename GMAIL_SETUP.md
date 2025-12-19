4# Gmail SMTP Setup Guide for Asterank

## Step 1: Enable 2-Step Verification on Your Gmail Account

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2-Step Verification

## Step 2: Generate an App Password

1. After enabling 2-Step Verification, go back to: https://myaccount.google.com/security
2. Under "Signing in to Google", click on "App passwords"
3. You may need to sign in again
4. Select "Mail" for the app and "Other (Custom name)" for the device
5. Enter "Asterank Laravel App" as the custom name
6. Click "Generate"
7. **Copy the 16-character password** that appears (it will look like: xxxx xxxx xxxx xxxx)

## Step 3: Update Your .env File

Open `asterank-api/.env` and update these values:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Use the 16-character App Password (no spaces)
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="Asterank"
```

**Important:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace the password with the 16-character app password (remove spaces)
- DO NOT use your regular Gmail password!

## Step 4: Test the Configuration

After updating your .env file:

1. Restart your Laravel server (if running)
2. Try the "Forgot Password" feature
3. Check your email inbox (and spam folder) for the reset code

## Troubleshooting

### Email not sending?
- Make sure you're using the App Password, not your regular Gmail password
- Check that 2-Step Verification is enabled
- Verify your .env file has no extra spaces
- Check `storage/logs/laravel.log` for error messages

### Still not working?
- Run: `php artisan config:clear`
- Restart the Laravel server
- Make sure your internet connection is working
- Check Gmail's "Less secure app access" is NOT blocking the connection

## Security Notes

⚠️ **Never commit your .env file to Git!**
- The .env file should already be in .gitignore
- Keep your App Password secret
- Rotate App Passwords periodically for security

## For Email Verification (Optional)

The same Gmail setup will work for email verification when we implement it.
The MAIL settings are used for all emails sent from Laravel.
