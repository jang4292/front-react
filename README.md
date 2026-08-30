# Admin Panel - React + Vite + TypeScript

A modern, responsive admin panel built with React, Vite, and TypeScript. This application features protected routes, authentication with JWT tokens, and a mobile-responsive layout with Material-UI.

## Features

- ✅ **React 19** with **Vite** for fast development
- ✅ **TypeScript** for type safety
- ✅ **React Router DOM** for routing with protected routes
- ✅ **Zustand** with persist middleware for state management
- ✅ **Material-UI (MUI)** for UI components
- ✅ **Tailwind CSS** for utility-first styling
- ✅ **Axios** with API base `/api` and automatic 401 handling
- ✅ **Responsive Layout** - Drawer is temporary on mobile, permanent on desktop
- ✅ **JWT Authentication** with automatic logout on 401 errors
- ✅ **Environment Variables** support

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout with responsive drawer
│   └── ProtectedRoute.tsx  # Protected route wrapper
├── pages/
│   ├── Login.tsx           # Login page
│   ├── Dashboard.tsx       # Main dashboard
│   └── Settings.tsx        # Settings page
├── store/
│   └── authStore.ts        # Zustand auth store with persist
├── lib/
│   └── apiClient.ts        # Axios instance with interceptors
├── App.tsx                 # Main app component with routing
└── main.tsx               # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jang4292/front-admin-react.git
cd front-admin-react
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Admin Panel
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### EC2 with Nginx

1. **Build the application:**
```bash
npm run build
```

2. **Upload to EC2:**
```bash
# Example using scp
scp -r dist/* user@your-ec2-ip:/var/www/admin-panel/
```

3. **Configure Nginx:**

Copy the example nginx configuration:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/admin-panel
sudo ln -s /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/
```

Update the configuration with:
- Your domain name
- SSL certificate paths
- API backend URL (default: `http://localhost:8080`)

4. **Test and Reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Key Features Explained

### Protected Routes

Routes are protected using the `ProtectedRoute` component. If a user is not authenticated (no token in store), they are redirected to the login page.

### Authentication Flow

1. User logs in via `/login`
2. JWT token is stored in Zustand with persist (localStorage)
3. Token is automatically added to all API requests via Axios interceptor
4. On 401 response, user is automatically logged out and redirected to login

### API Configuration

All API calls use the base URL `/api`, which is proxied to your backend in development and handled by Nginx in production.

Example API call:
```typescript
import apiClient from './lib/apiClient';

// This will call /api/users
const response = await apiClient.get('/users');
```

### Responsive Drawer

- **Mobile (< 960px):** Drawer is temporary and toggled via hamburger menu
- **Desktop (≥ 960px):** Drawer is permanent and always visible

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (used in nginx proxy configuration)
- `VITE_APP_NAME`: Application name

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **Zustand** - State management
- **Material-UI (MUI)** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Nginx** - Web server for production

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

