# MITC Store - Architecture Documentation

## Overview

MITC Store is a modern single-store showcase web application built with React, Firebase, and Tailwind CSS. The architecture follows a role-based access control (RBAC) pattern with three distinct user roles.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Public     │  │   Auth       │  │   Admin      │     │
│  │   Pages      │  │   Pages      │  │   Dashboard  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                     React + TypeScript                       │
│                     Tailwind CSS + Framer Motion             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Authentication│  │  Firestore   │  │   Realtime   │     │
│  │   (Auth)     │  │   (Products, │  │   Database   │     │
│  │              │  │   Users, etc)│  │   (Chats)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Cloud      │  │   Hosting    │  │  Analytics   │     │
│  │  Functions   │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐                                           │
│  │  Cloudinary  │  (Image Storage & Optimization)          │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure

```
src/
├── components/          # Reusable React components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat UI components
│   ├── common/         # Shared components
│   └── products/       # Product display components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   └── public/         # Public-facing pages
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useProducts.ts  # Product data hook
│   ├── useChat.ts      # Real-time chat hook
│   └── useReviews.ts   # Reviews hook
├── lib/                # Core utilities
│   ├── firebase.ts     # Firebase initialization
│   ├── rtdb.ts         # Realtime DB utilities
│   ├── api.ts          # Cloud Functions API
│   └── imageCompression.ts
├── store/              # Zustand state management
│   ├── authStore.ts    # Auth state
│   └── uiStore.ts      # UI state
├── types/              # TypeScript definitions
│   ├── product.ts
│   ├── user.ts
│   ├── chat.ts
│   └── ...
└── styles/             # Global styles
    └── index.css       # Tailwind + custom CSS
```

### Component Hierarchy

```
App
├── PublicLayout
│   ├── Navigation
│   ├── Outlet (public pages)
│   └── Footer
└── AdminLayout
    ├── Sidebar
    ├── Header
    └── Content (admin pages)
```

## Backend Architecture

### Firebase Services

#### 1. Authentication
- Email/Password authentication
- Custom claims for admin role (optional)
- User document creation on sign-up

#### 2. Firestore (Document Database)

**Collections:**

```
/products/{productId}
  - Product catalog with specs, pricing, images
  - Public read, admin write

/users/{uid}
  - User profiles and roles
  - User can read/write own, admin can read/write all

/reviews/{reviewId}
  - Store reviews
  - Public read, authenticated write, admin approve/delete

/leads/{leadId}
  - Contact form submissions
  - Public write, admin read

/images/{imageId}
  - Image metadata and URLs
  - Public read, admin write

/visitors/{date}/{visitId}
  - Analytics data
  - Admin read only
```

#### 3. Realtime Database (Chat)

```
/chats/{chatId}
  - Chat metadata and participants
  - Participant and admin access

/chats/{chatId}/messages/{messageId}
  - Chat messages
  - Real-time synchronization
```

#### 4. Cloud Functions

**Authentication Triggers:**
- `onUserCreate`: Create user document
- `onUserDelete`: Cleanup user data

**Callable Functions:**
- `uploadImageToCloudinary`: Upload images
- `deleteImageFromCloudinary`: Delete images
- `incrementProductView`: Track views
- `trackVisitor`: Analytics
- `requestAccountDeletion`: User data deletion
- `adminDeleteUser`: Admin delete user
- `changeUserRole`: Admin change roles

## Data Flow

### Product View Flow

```
User → Product Page → incrementProductView() → Cloud Function
  ↓
Firestore: Update view count
  ↓
Visitor collection: Log visit
  ↓
UI: Display product
```

### Chat Message Flow

```
User → Chat Input → sendMessage()
  ↓
RTDB: /chats/{chatId}/messages/{msgId}
  ↓
Real-time Listener → Update UI
  ↓
Other participants see message
```

### Image Upload Flow

```
Admin → Select Image → Compress (<700KB)
  ↓
uploadImageToCloudinary() → Cloud Function
  ↓
Cloudinary: Upload & optimize
  ↓
Firestore: Save metadata
  ↓
Return URL → Update product
```

## Security Architecture

### Role-Based Access Control

**Guest (Unauthenticated):**
- Read products, reviews
- Submit contact forms
- Start guest chat

**User (Authenticated):**
- All guest permissions
- Write reviews
- Like/save products
- Authenticated chat
- Request account deletion

**Admin:**
- All user permissions
- Create/edit/delete products
- Manage reviews (approve/hide/delete)
- View analytics
- Manage users and roles
- Upload images
- Access all chats

### Security Rules

**Firestore:**
```javascript
// Role-based access via users/{uid}.role
// Products: public read, admin write
// Reviews: public read, user write, admin moderate
// Users: self read/write, admin full access
```

**RTDB:**
```javascript
// Chat participants can read/write
// Admins can access all chats
// Message validation enforced
```

## State Management

### Zustand Stores

**Auth Store:**
- User data
- Loading states
- Role checks

**UI Store:**
- Sidebar state
- Theme (light/dark)
- Modal states

### React Query (Future Enhancement)

Consider adding React Query for:
- Automatic cache management
- Optimistic updates
- Background refetching

## Performance Optimizations

### Frontend

1. **Code Splitting**
   - Vendor chunks separated
   - Route-based lazy loading

2. **Image Optimization**
   - Client-side compression
   - Cloudinary auto-format
   - Lazy loading images

3. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Gzip compression

### Backend

1. **Firestore Indexing**
   - Composite indexes for queries
   - Single-field indexes automatic

2. **RTDB Denormalization**
   - Last message stored in chat doc
   - Avoid deep queries

3. **Cloud Functions**
   - Cold start mitigation
   - Function timeout optimization

## Scalability Considerations

### Current Limits

- **Firestore**: 1M document reads/day (free tier)
- **RTDB**: 100 concurrent connections (Spark plan)
- **Functions**: 125K invocations/month (free tier)
- **Hosting**: 10 GB storage, 360 MB/day transfer

### Scaling Strategy

1. **Upgrade to Blaze Plan** (pay-as-you-go)
2. **Implement Caching** (Redis/Memcache)
3. **CDN Integration** (automatic with Firebase Hosting)
4. **Database Sharding** (if needed)
5. **Read Replicas** (Firestore supports multiple regions)

## Development Workflow

### Local Development

```bash
# Frontend dev server
npm run dev

# Firebase emulators
firebase emulators:start

# Functions development
cd functions && npm run build:watch
```

### Testing Strategy

1. **Unit Tests**: Components, utilities
2. **Integration Tests**: Firestore rules, functions
3. **E2E Tests**: Critical user flows
4. **Security Rules Testing**: Firebase emulator

### CI/CD Pipeline (Recommended)

```
GitHub Actions:
  1. Lint & Format Check
  2. TypeScript Compilation
  3. Unit Tests
  4. Build Production Bundle
  5. Deploy to Firebase (on main branch)
```

## Monitoring & Analytics

### Firebase Console

- **Performance Monitoring**: Page load times
- **Crashlytics**: Error tracking
- **Analytics**: User engagement
- **Usage Dashboard**: Quota monitoring

### Custom Analytics

- Product view tracking
- Popular brands
- User behavior patterns
- Conversion funnels

## Future Enhancements

### Planned Features

1. **Progressive Web App (PWA)**
   - Offline support
   - Install prompts
   - Background sync

2. **Advanced Search**
   - Algolia integration
   - Fuzzy search
   - Filters and facets

3. **Notifications**
   - Push notifications
   - Email notifications
   - In-app notifications

4. **Multi-language Support**
   - i18n implementation
   - RTL support

5. **Advanced Analytics**
   - Heat maps
   - User journey tracking
   - A/B testing

## Technology Choices

### Why React?
- Component reusability
- Large ecosystem
- Performance (Virtual DOM)
- Developer experience

### Why Firebase?
- Serverless architecture
- Real-time capabilities
- Built-in security rules
- Scalable infrastructure
- Quick development

### Why Tailwind CSS?
- Utility-first approach
- Consistent design system
- Small bundle size
- Dark mode support
- Responsive design

### Why TypeScript?
- Type safety
- Better IDE support
- Reduced runtime errors
- Self-documenting code

## Best Practices

### Code Quality

- ESLint for linting
- Prettier for formatting
- Conventional commits
- Code reviews

### Security

- Never commit secrets
- Use environment variables
- Regular dependency updates
- Security rule audits

### Performance

- Lazy load routes
- Optimize images
- Minimize bundle size
- Use production builds

---

**Last Updated:** 2024-11-20  
**Maintained by:** Burhan Sheikh