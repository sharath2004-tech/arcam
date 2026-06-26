# AR Memories - Augmented Reality Photo Preservation Platform

AR Memories is a premium SaaS platform for capturing, preserving, and sharing memories in stunning augmented reality. The platform supports multiple user roles including customers, photographers, studio owners, and administrators.

## Features

### Core Features
- **AR Camera**: Capture photos with advanced AR overlays and real-time effects
- **Album Management**: Organize and manage photo collections with custom metadata
- **QR Code Generation**: Generate shareable QR codes for instant album access
- **Real-time Chat**: Communicate directly with photographers and studios
- **Subscription Management**: Flexible billing plans with payment integration
- **Secure Storage**: High-resolution photos with secure cloud storage

### User Roles
- **Customer**: Browse portfolios, book photographers, purchase subscriptions
- **Photographer**: Manage portfolio, accept bookings, upload photos, communicate with clients
- **Studio Owner**: Manage team, analytics, client relationships, billing
- **Admin**: System administration, user management, content moderation, platform monitoring

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Authentication**: Custom auth context with mock implementation (Ready for backend integration)
- **State Management**: Zustand (prepared for real-time state)
- **UI Components**: shadcn/ui + custom glassmorphic components
- **Icons**: lucide-react
- **Database**: Ready for integration with Neon/Supabase

## Project Structure

```
/app
  /(auth)          # Authentication pages
    /login
    /signup
    /verify-otp
  /(dashboard)     # Dashboard area
    /dashboard     # Main dashboard
      /albums      # Photo albums
      /ar-camera   # AR camera interface
      /messages    # Chat system
      /billing     # Subscription management
      /qr-codes    # QR code management
      /portfolio   # Photographer portfolio
      /team        # Studio team management
      /analytics   # Analytics dashboard
      /admin       # Admin panel
      /settings    # User settings
  /page.tsx        # Landing page
  /layout.tsx      # Root layout

/components
  /ui              # Reusable UI components
    /button-glass.tsx
    /form-field.tsx
  /dashboard       # Dashboard components
    /sidebar.tsx
    /card.tsx

/lib
  /auth-context.tsx  # Authentication context
  /utils.ts          # Utility functions

/app/globals.css    # Global styles with design tokens
```

## Design System

### Color Palette
- **Primary**: `#6C63FF` (Vibrant purple) - Main brand color
- **Accent**: `#D946EF` (Hot pink) - Call-to-action elements
- **Secondary**: `#F59E0B` (Warm orange) - Secondary actions
- **Neutrals**: Dark backgrounds with white text (Dark mode optimized)

### Components
- **Glassmorphic Design**: `.glass-effect` for frosted glass appearance
- **Gradient Text**: `.text-gradient` for branded headings
- **Button Variants**: Primary, secondary, ghost, outline, destructive
- **Border Radius**: 18-24px for modern rounded corners

## Authentication

The app includes a complete authentication flow with:
- Email/password login and signup
- OTP verification (mock implementation)
- Role-based access control (RBAC)
- Session management
- Protected dashboard routes

### Demo Credentials
```
Email: demo@example.com
Password: password123
```

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Pages

**Public Pages:**
- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/verify-otp` - OTP verification

**Protected Pages (Dashboard):**
- `/dashboard` - Main dashboard
- `/dashboard/albums` - Photo albums (Customer)
- `/dashboard/ar-camera` - AR camera (Customer, Photographer)
- `/dashboard/messages` - Chat system
- `/dashboard/billing` - Subscription management
- `/dashboard/qr-codes` - QR code generation
- `/dashboard/portfolio` - Portfolio management (Photographer)
- `/dashboard/team` - Team management (Studio Owner, Admin)
- `/dashboard/analytics` - Analytics (Studio Owner, Admin)
- `/dashboard/admin` - Admin panel (Admin only)
- `/dashboard/settings` - User settings

## Customization

### Adding New Features

1. Create pages in `/app/(dashboard)/dashboard/[feature-name]/`
2. Create components in `/components/dashboard/`
3. Use the design system utilities for styling
4. Implement role-based visibility in the sidebar

### Styling

All styles use Tailwind CSS with custom design tokens defined in `globals.css`. The design system includes:
- Custom color variables in oklch format
- Predefined border radius values
- Glass effect utilities
- Gradient utilities

## Building for Production

```bash
pnpm build
```

## Database Integration

The app is ready for backend integration. Mock APIs are prepared for:
- User authentication
- Album management
- Photo uploads
- Messaging
- Billing

To integrate with a real database:

1. Install database client (Prisma, Drizzle ORM, etc.)
2. Replace mock auth context with real authentication
3. Create API routes for backend operations
4. Update components to use real data

## Deployment

The application is optimized for deployment on Vercel:

```bash
vercel deploy
```

## Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
# Add database and auth credentials as needed
```

## API Endpoints (Ready for Implementation)

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/albums` - Fetch user albums
- `POST /api/albums` - Create album
- `GET /api/albums/:id` - Get album details
- `POST /api/qr-codes` - Generate QR code
- `GET /api/messages` - Fetch conversations
- `POST /api/messages` - Send message

## Performance Optimizations

- Server-side rendering (RSC) for landing pages
- Client-side rendering for interactive dashboards
- Image optimization with Next.js Image component
- CSS-in-JS minimization with Tailwind
- Code splitting for route-based chunks

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Security Considerations

- HTTPS enforcement in production
- CSRF protection for form submissions
- XSS prevention with React's built-in sanitization
- SQL injection prevention (when using ORM)
- Rate limiting on API endpoints
- Session timeout management

## Support

For issues and feature requests, please create an issue in the repository.

## License

This project is proprietary and confidential.

---

Built with [v0](https://v0.app) by Vercel
