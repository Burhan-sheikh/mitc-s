# MITC Store (mitc-s)

**Professional single-store showcase web application for Mateen IT Corp., Maisuma, Srinagar**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

MITC Store is a premium web application showcasing products from Mateen IT Corp. with a professional glassmorphism UI, admin dashboard, and role-based access control. Built with React, Firebase, and Tailwind CSS.

**Budget:** ₹18,00,000 UI Quality Investment

### Key Features

- 🎨 **Professional Glassmorphism Design** - Modern, premium UI with design system
- 🔐 **Role-Based Access Control** - Guest / User / Admin permissions
- 📦 **Product Management** - Complete admin dashboard for inventory
- 💬 **Real-time Chat** - Firebase RTDB powered live messaging
- ⭐ **Reviews System** - Store-level reviews with approval workflow
- 📊 **Analytics Dashboard** - Track views, popular items, visitor data
- 🖼️ **Cloudinary Integration** - Optimized image handling (<700KB)
- 👤 **User Account Management** - Self-service account deletion
- 📱 **Mobile Responsive** - Optimized for all devices

## 🏗️ Architecture

### Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Firebase (Firestore, Realtime Database, Cloud Functions, Auth)
- **Image Storage:** Cloudinary (with compression pipeline)
- **Deployment:** Firebase Hosting / Netlify

### Data Model

#### Firestore Collections

- **products** - Product catalog with specs, pricing, stock
- **users** - User profiles with roles and preferences
- **reviews** - Store reviews with approval status
- **leads** - Contact form submissions
- **images** - Image metadata and URLs
- **visitors** - Analytics and tracking data

#### Realtime Database

- **chats** - Live chat conversations
- **messages** - Chat message history

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project with Firestore, RTDB, Auth, Functions enabled
- Cloudinary account (optional but recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Burhan-sheikh/mitc-s.git
cd mitc-s

# Install dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and Cloudinary credentials
```

### Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase use --add

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Realtime Database rules
firebase deploy --only database

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Cloud Functions
cd functions
firebase functions:config:set cloudinary.name="YOUR_CLOUD_NAME" \
  cloudinary.key="YOUR_API_KEY" \
  cloudinary.secret="YOUR_API_SECRET"
firebase deploy --only functions
```

### Development

```bash
# Start development server
npm run dev

# Run Firebase emulators (optional)
firebase emulators:start

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 👥 User Roles

### Guest
- View products and reviews
- Start guest chat sessions
- Submit contact forms

### User (Authenticated)
- All guest permissions
- Write store reviews
- Like/save favorite products
- Participate in authenticated chats
- Request account deletion

### Admin
- Manage products (add/edit/duplicate/delete)
- Monitor and respond to chats
- Approve/hide/delete reviews
- View analytics and insights
- Manage users and roles
- Upload images to Cloudinary
- Configure store settings

## 🔒 Security

### Firestore Rules

- Role-based access enforced at database level
- Guests: read-only access to public data
- Users: write access to owned data only
- Admins: full CRUD access to all collections

### Realtime Database Rules

- Chat participants can read/write their own chats
- Admins can access all chats
- Message validation ensures required fields

### Image Handling

- Client-side compression to <700KB before upload
- Server-side validation of admin role
- Cloudinary API secrets stored in Cloud Functions config
- No direct Firebase Storage uploads (security by design)

## 📁 Project Structure

```
mitc-s/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # Chat UI components
│   │   ├── common/         # Shared components
│   │   └── products/       # Product display components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── public/         # Public pages
│   ├── lib/                # Utilities and configs
│   │   ├── firebase.ts     # Firebase initialization
│   │   ├── rtdb.ts         # Realtime DB utilities
│   │   └── api.ts          # Cloud Functions API
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles and theme
│   └── types/              # TypeScript types
├── functions/              # Cloud Functions
│   ├── src/
│   │   ├── index.ts        # Main functions entry
│   │   ├── auth.ts         # Auth triggers
│   │   ├── cloudinary.ts   # Image upload
│   │   └── cleanup.ts      # Data cleanup
│   └── package.json
├── public/                 # Static assets
├── firestore.rules         # Firestore security rules
├── database.rules.json     # RTDB security rules
├── firestore.indexes.json  # Composite indexes
├── firebase.json           # Firebase config
└── package.json
```

## 🎨 Design System

- **Colors:** Glassmorphism palette with blur effects
- **Typography:** Professional font hierarchy
- **Spacing:** Consistent 8px grid system
- **Components:** Reusable button, card, form elements
- **Motion:** Framer Motion microinteractions
- **Responsive:** Mobile-first approach

## 📊 Admin Dashboard

### Dashboard Home
- Summary tiles (products, chats, low stock alerts)
- Top viewed products and brands
- Recent activity feed

### Sections
1. **Stocks** - Product inventory management
2. **Chats** - Real-time customer support
3. **Analytics** - Visitor and product insights
4. **Reviews** - Moderation and approval
5. **Users** - User management and roles
6. **Settings** - Store configuration and integrations

## 🌐 Cloudinary Integration

### Setup
1. Create Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Configure in Firebase Functions:
   ```bash
   firebase functions:config:set \
     cloudinary.name="YOUR_CLOUD_NAME" \
     cloudinary.key="YOUR_API_KEY" \
     cloudinary.secret="YOUR_API_SECRET"
   ```

### Usage
- Admin uploads compressed images (<700KB)
- Cloud Function validates and uploads to Cloudinary
- URL stored in Firestore for product galleries
- Automatic format optimization (WebP, AVIF)

## 🗑️ Account Deletion

Users can request full account deletion:

1. Navigate to Account Settings
2. Click "Delete Account"
3. Choose to delete all associated data
4. Confirm with re-authentication
5. Cloud Function processes deletion:
   - Removes user reviews
   - Clears chat participation
   - Deletes user document
   - Optionally removes Auth account

## 📈 Analytics Features

- **Product Views** - Track most viewed items
- **Brand Popularity** - Trending brands and categories
- **Visitor Tracking** - IP-based analytics (privacy-safe)
- **Stock Alerts** - Low inventory notifications
- **Chat Metrics** - Response times and volume

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

## 🚢 Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Netlify

```bash
npm run build
# Connect GitHub repo to Netlify
# Build command: npm run build
# Publish directory: dist
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Developer

**Burhan Sheikh**
- GitHub: [@Burhan-sheikh](https://github.com/Burhan-sheikh)

## 🙏 Acknowledgments

- Mateen IT Corp., Maisuma, Srinagar
- React and Firebase communities
- Cloudinary for image optimization

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: Mateen IT Corp., Maisuma, Srinagar

---

**Built with ❤️ for Mateen IT Corp.**
