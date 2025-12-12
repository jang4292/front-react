# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

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

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Testing Authentication

The app includes a mock login feature for testing. Click the "Demo Login (Mock)" button on the login page to access the dashboard without a backend API.

For real authentication, implement your API endpoint at `/api/auth/login` that returns:
```json
{
  "token": "your-jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Production Deployment on EC2 with Nginx

### Step 1: Build the Application

```bash
npm run build
```

This creates a `dist` folder with optimized static files.

### Step 2: Upload to EC2

```bash
# Using SCP
scp -r dist/* ec2-user@your-ec2-ip:/var/www/admin-panel/

# Or using rsync
rsync -avz dist/ ec2-user@your-ec2-ip:/var/www/admin-panel/
```

### Step 3: Configure Nginx

1. Copy the nginx configuration:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/admin-panel
```

2. Edit the configuration file:
```bash
sudo nano /etc/nginx/sites-available/admin-panel
```

Update the following:
- `server_name` - Your domain name
- SSL certificate paths (if using HTTPS)
- Backend API URL in the proxy_pass directive (default: `http://localhost:8080`)

3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/
```

4. Test nginx configuration:
```bash
sudo nginx -t
```

5. Reload nginx:
```bash
sudo systemctl reload nginx
```

### Step 4: SSL Configuration (Optional but Recommended)

Using Let's Encrypt:
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## API Proxy Configuration

The app is configured to proxy all `/api/*` requests to your backend server. In development, this is handled by Vite's dev server. In production, Nginx handles the proxy.

### Development Proxy
Configured in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Production Proxy
Configured in `nginx.conf.example`:
```nginx
location /api/ {
    proxy_pass http://localhost:8080/api/;
    # ... other proxy settings
}
```

## Environment Variables

Create a `.env` file in the project root:

```env
# API Base URL (used for nginx proxy configuration)
VITE_API_BASE_URL=https://your-api-domain.com

# Application Name
VITE_APP_NAME=Admin Panel
```

**Note:** Environment variables in Vite must be prefixed with `VITE_` to be exposed to the client-side code.

## Troubleshooting

### Issue: White screen after deployment
- Check browser console for errors
- Verify nginx is serving files from the correct directory
- Check file permissions: `sudo chown -R www-data:www-data /var/www/admin-panel`

### Issue: API calls failing
- Verify the backend API is running
- Check nginx proxy configuration
- Review nginx error logs: `sudo tail -f /var/nginx/error.log`

### Issue: 404 on page refresh
- Ensure nginx is configured to serve `index.html` for all routes
- The `try_files $uri $uri/ /index.html;` directive should be present

## Performance Optimization

### Code Splitting
The current bundle size warning can be addressed by implementing dynamic imports:

```typescript
// Instead of
import Dashboard from './pages/Dashboard';

// Use
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Caching
Nginx is configured to cache static assets for 1 year. Vite automatically adds content hashes to filenames for cache busting.

## Security Considerations

1. **HTTPS Only:** Always use HTTPS in production
2. **Environment Variables:** Never commit `.env` files
3. **Token Storage:** Tokens are stored in localStorage via Zustand persist
4. **CORS:** Configure your backend API to only allow requests from your domain
5. **Security Headers:** The nginx configuration includes security headers

## Monitoring

Add logging and monitoring:

```bash
# View nginx access logs
sudo tail -f /var/log/nginx/access.log

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## Updates and Maintenance

To deploy updates:

1. Pull latest changes
2. Build: `npm run build`
3. Upload to server
4. Clear browser cache or update service worker

Consider setting up CI/CD with GitHub Actions for automated deployments.
