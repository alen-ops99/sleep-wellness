# Sleep Wellness Portal - Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Firebase project created at https://console.firebase.google.com

## Setup Steps

### 1. Login to Firebase

```bash
firebase login
```

### 2. Initialize Firebase (if not already done)

```bash
cd "/Users/alenjuginovic/Documents/Projects_claude/projects/Sleep wellness - website"
firebase init
```

Select:
- Firestore
- Functions
- Hosting

### 3. Install Cloud Functions Dependencies

```bash
cd functions
npm install
```

### 4. Set the Anthropic API Key

```bash
firebase functions:config:set anthropic.key="YOUR_ANTHROPIC_API_KEY"
```

Replace `YOUR_ANTHROPIC_API_KEY` with your actual API key.

### 5. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### 7. Deploy Hosting (Optional)

```bash
firebase deploy --only hosting
```

### 8. Deploy Everything

```bash
firebase deploy
```

## Cloud Function URL

After deployment, your chatbot API will be available at:
```
https://us-central1-sleep-wellness-48d57.cloudfunctions.net/chatWithClaude
```

## Local Development

To test functions locally:

```bash
cd functions
npm run serve
```

The local URL will be:
```
http://localhost:5001/sleep-wellness-48d57/us-central1/chatWithClaude
```

Update `CHAT_API_URL` in `assessment/account.html` to use the local URL during development.

## Security Notes

- The Anthropic API key is stored securely in Firebase Functions config
- Never commit API keys to version control
- Firestore rules ensure users can only access their own data
- Admin role has elevated access to all data

## Troubleshooting

### CORS Issues
The Cloud Function includes CORS handling. If you still see CORS errors, ensure your domain is listed in Firebase Hosting or add it to the `cors` configuration in `functions/index.js`.

### Function Deployment Errors
- Ensure Node.js version matches `engines.node` in `functions/package.json`
- Check Firebase project billing (Blaze plan required for external API calls)

### Missing Indexes
If you see "requires an index" errors, run:
```bash
firebase deploy --only firestore:indexes
```

Or click the link in the error message to create the index manually.
