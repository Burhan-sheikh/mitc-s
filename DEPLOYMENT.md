# MITC Store Deployment Guide

## Prerequisites

1. **Node.js 18+** installed
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
3. **Firebase Project** created at [console.firebase.google.com](https://console.firebase.google.com)
4. **Cloudinary Account** (optional but recommended) at [cloudinary.com](https://cloudinary.com)

## Initial Setup

### 1. Clone and Install

```bash
git clone https://github.com/Burhan-sheikh/mitc-s.git
cd mitc-s
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Project Configuration

```bash
# Login to Firebase
firebase login

# Link to your Firebase project
firebase use --add
# Select your project and give it an alias (e.g., 'production')

# Update .firebaserc with your project ID
```

Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 3. Environment Variables

Create `.env` file in the root directory:

```env
# Get these from Firebase Console > Project Settings > General
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Store Information
VITE_APP_NAME="MITC Store"
VITE_STORE_NAME="Mateen IT Corp."
VITE_STORE_ADDRESS="Maisuma, Srinagar"
VITE_STORE_PHONE="+91-XXXXXXXXXX"
VITE_STORE_EMAIL="contact@mateenit.com"
```

### 4. Enable Firebase Services

In Firebase Console:

1. **Authentication**
   - Enable Email/Password provider
   - Enable Google provider (optional)

2. **Firestore Database**
   - Create database in production mode
   - Choose region closest to your users

3. **Realtime Database**
   - Create database
   - Start in locked mode (rules will be deployed)

4. **Cloud Functions**
   - Enable billing (required for Cloud Functions)
   - Upgrade to Blaze plan

### 5. Configure Cloudinary (Optional)

If using Cloudinary for image storage:

```bash
# Set Cloudinary credentials in Firebase Functions config
firebase functions:config:set \
  cloudinary.name="your-cloud-name" \
  cloudinary.key="your-api-key" \
  cloudinary.secret="your-api-secret"
```

## Deployment

### Deploy Everything

```bash
# Deploy all Firebase services
firebase deploy
```

### Deploy Specific Services

```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Realtime Database rules
firebase deploy --only database

# Deploy only Functions
firebase deploy --only functions

# Deploy only Hosting
firebase deploy --only hosting

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

### First-Time Deployment Steps

```bash
# 1. Deploy Firestore rules and indexes
firebase deploy --only firestore

# 2. Deploy Realtime Database rules
firebase deploy --only database

# 3. Deploy Cloud Functions
cd functions
npm run build
cd ..
firebase deploy --only functions

# 4. Build and deploy frontend
npm run build
firebase deploy --only hosting
```

## Create First Admin User

After deployment:

1. **Sign up** through the web app
2. **Manually update** the user's role in Firestore:
   ```
   Firestore > users > [your-uid] > role: "admin"
   ```
3. **Optionally set custom claim** using Firebase CLI:
   ```bash
   firebase auth:export users.json
   # Find your UID, then:
   firebase functions:shell
   > admin.auth().setCustomUserClaims('YOUR_UID', {admin: true})
   ```

## Local Development

### Using Production Firebase

```bash
npm run dev
```

### Using Firebase Emulators

```bash
# Start emulators
firebase emulators:start

# In another terminal, start dev server with emulator flag
VITE_USE_EMULATORS=true npm run dev
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Firebase services enabled (Auth, Firestore, RTDB, Functions)
- [ ] Cloudinary configured (if using)
- [ ] Firestore rules deployed
- [ ] RTDB rules deployed
- [ ] Firestore indexes deployed
- [ ] Cloud Functions deployed
- [ ] Frontend built and deployed
- [ ] First admin user created
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Security rules tested
- [ ] Performance monitoring enabled

## Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning (automatic)

## Monitoring

### Firebase Console

- **Hosting**: Check deployment status and traffic
- **Functions**: Monitor function executions and errors
- **Firestore**: Check database usage
- **RTDB**: Monitor realtime connections
- **Analytics**: View user engagement (if enabled)

### Cloud Functions Logs

```bash
# View recent logs
firebase functions:log

# Follow logs in real-time
firebase functions:log --follow

# View specific function logs
firebase functions:log --only uploadImageToCloudinary
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

### Functions Deployment Fails

```bash
# Check functions build
cd functions
npm run build

# Check for TypeScript errors
npm run build

# Deploy with debug output
firebase deploy --only functions --debug
```

### Firestore Rules Errors

```bash
# Validate rules before deploying
firebase firestore:rules:validate firestore.rules
```

### Permission Denied Errors

- Check Firestore security rules
- Verify user role in Firestore users collection
- Check custom claims if using them

## Performance Optimization

### Image Optimization

- Use Cloudinary auto-format and auto-quality
- Compress images before upload (<700KB target)
- Use WebP format when possible

### Code Splitting

- Already configured in `vite.config.ts`
- Vendors split into separate chunks
- Lazy load routes if needed

### Caching

- Firebase Hosting automatically caches static assets
- Configure cache headers in `firebase.json`
- Use Firestore caching for offline support

## Security Best Practices

1. **Never commit `.env` file**
2. **Rotate Firebase API keys** if exposed
3. **Review Firestore rules** regularly
4. **Monitor function execution** for abuse
5. **Set up billing alerts** in GCP Console
6. **Enable App Check** for additional security (optional)
7. **Use custom claims** for role-based access
8. **Audit user actions** in admin panel

## Backup Strategy

### Firestore Backup

```bash
# Export Firestore data
firebase firestore:export gs://your-bucket/backup-$(date +%Y%m%d)
```

### RTDB Backup

- Enable automated backups in Firebase Console
- Or manually export via REST API

## Support

For issues:
- Check [Firebase Status](https://status.firebase.google.com/)
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Open issue on GitHub repository

---

**Deployed with ❤️ by Burhan Sheikh for Mateen IT Corp.**