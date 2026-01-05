# Firebase Admin SDK Setup Guide

To enable staff and admin account creation, you need to set up Firebase Admin SDK credentials.

## Steps:

1. **Go to Firebase Console**
   - URL: https://console.firebase.google.com/project/tech-product-eb904/settings/serviceaccounts/adminsdk

2. **Generate Service Account Key**
   - Click the "Generate new private key" button
   - A JSON file will be downloaded automatically

3. **Save the JSON file**
   - Place the downloaded JSON file in your project root directory
   - Name it: `service-account-key.json`
   - ⚠️ **Important**: This file contains sensitive credentials - never commit it to version control!

4. **Update .env.local**
   - Open `.env.local` in your project root
   - Add this line:
     ```
     GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
     ```

5. **Restart the dev server**
   - Stop the current dev server (Ctrl+C)
   - Run: `npm run dev`

## Verify It Works

Once set up, you should see in the console:
```
✅ Firebase Admin SDK initialized successfully
```

When creating a staff account, you should see:
```
✅ Firebase user created: [user-id]
```

## Troubleshooting

If you still get credential errors:
- Make sure the `service-account-key.json` file exists in the project root
- Make sure the path in `.env.local` is correct
- Check that the file contains valid JSON credentials
- Restart the dev server after making changes
