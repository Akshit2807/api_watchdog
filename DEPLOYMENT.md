# 🚀 API Watchdog Deployment Guide

Complete guide for deploying API Watchdog to various hosting platforms.

## 🌟 Render (Recommended)

Render provides excellent static hosting with automatic HTTPS and global CDN.

### Method 1: One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Method 2: Manual Deployment

#### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial API Watchdog deployment"

# Add remote origin (replace with your GitHub repo)
git remote add origin https://github.com/yourusername/api-watchdog.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Deploy to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up or log in with GitHub

2. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub account if not already connected
   - Select your `api-watchdog` repository

3. **Configure Deployment Settings**
   ```
   Name: api-watchdog
   Branch: main
   Build Command: echo "No build required"
   Publish Directory: ./
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete (~2-3 minutes)
   - Your site will be available at: `https://your-app-name.onrender.com`

#### Step 3: Custom Domain (Optional)

1. **In Render Dashboard:**
   - Go to your static site settings
   - Click "Custom Domains"
   - Add your domain (e.g., `api-watchdog.yourdomain.com`)

2. **DNS Configuration:**
   ```
   Type: CNAME
   Name: api-watchdog (or your subdomain)
   Value: your-app-name.onrender.com
   ```

## 🚀 Alternative Deployment Options

### Netlify

**Method 1: Drag & Drop**
1. Zip your project folder
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop your zip file
4. Get instant deployment URL

**Method 2: Git Integration**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project directory
netlify deploy --prod --dir ./
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel

# Follow the prompts to configure
```

### GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Enable Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: `main` / `/ (root)`
   - Save

3. **Access:** `https://yourusername.github.io/api-watchdog`

### AWS S3 + CloudFront

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://your-api-watchdog-bucket
   ```

2. **Upload Files:**
   ```bash
   aws s3 sync . s3://your-api-watchdog-bucket --exclude ".git/*"
   ```

3. **Configure Static Website:**
   ```bash
   aws s3 website s3://your-api-watchdog-bucket --index-document index.html
   ```

4. **Set Up CloudFront** (optional for CDN and HTTPS)

## ⚙️ Environment Configuration

### HTTPS Requirements

API Watchdog requires HTTPS for:
- ✅ Browser notifications
- ✅ Secure API calls
- ✅ Modern web features

**All recommended platforms provide automatic HTTPS.**

### CORS Configuration

If your APIs are on different domains, configure CORS headers:

```javascript
// Example CORS headers your API should return
Access-Control-Allow-Origin: https://your-api-watchdog-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Custom Domain Setup

**For Professional Use:**
1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Configure DNS to point to your hosting provider
3. Enable SSL certificate (usually automatic)

**Example DNS Configuration:**
```
Type    Name              Value
CNAME   api-watchdog      your-app.onrender.com
CNAME   www.api-watchdog  your-app.onrender.com
```

## 🔧 Post-Deployment Checklist

### ✅ Functionality Test
- [ ] Application loads without errors
- [ ] Dark/light theme toggle works
- [ ] Can add and edit API endpoints
- [ ] Cron jobs can be created and scheduled
- [ ] Manual API testing works
- [ ] Data persists in localStorage
- [ ] Charts and dashboard display correctly

### ✅ Performance Test
- [ ] Page loads in < 3 seconds
- [ ] Responsive design works on mobile
- [ ] Animations are smooth
- [ ] No console errors

### ✅ Security Test
- [ ] HTTPS is enforced
- [ ] API calls work from deployed domain
- [ ] Browser notifications request permission
- [ ] No mixed content warnings

### ✅ Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)  
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## 🛠️ Troubleshooting

### Common Issues

**API Calls Failing:**
```
Problem: CORS errors when calling APIs
Solution: Configure CORS headers on your API server
```

**Notifications Not Working:**
```
Problem: Browser notifications don't appear
Solution: Ensure site is served over HTTPS
```

**Data Not Persisting:**
```
Problem: Settings/schedules disappear on refresh
Solution: Check if localStorage is enabled in browser
```

**Build Errors on Render:**
```
Problem: Deployment fails with build errors
Solution: Ensure build command is set to: echo "No build required"
```

### Debug Steps

1. **Check Browser Console:**
   - Press F12
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify File Structure:**
   ```
   api_watchdog/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── render.yaml
   ├── _redirects
   ├── package.json
   └── README.md
   ```

3. **Test Locally First:**
   ```bash
   python -m http.server 8000
   open http://localhost:8000
   ```

## 📊 Monitoring Your Deployment

### Render Analytics
- Visit your Render dashboard
- Check deployment logs
- Monitor bandwidth usage
- View performance metrics

### Google Analytics (Optional)
Add to `index.html` before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Production Optimization

### Performance Tips
1. **Enable Compression** (automatic on most platforms)
2. **Set Cache Headers** for static assets
3. **Use CDN** for faster global access
4. **Monitor Lighthouse Score** for performance metrics

### Security Headers
Add to `_headers` file for enhanced security:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: notifications=(), geolocation=()
```

---

**🎉 Congratulations!** Your API Watchdog is now deployed and ready to monitor APIs professionally.

For support, check the [main README](README.md) or create an issue in the repository.