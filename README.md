# 🛡️ API Watchdog

**Professional API Monitoring & Testing Platform**

A beautiful, modern web application for monitoring API endpoints with automated cron job scheduling, real-time analytics, and comprehensive logging. Built with vanilla HTML, CSS, and JavaScript - no frameworks required.

![API Watchdog Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎯 **Core Functionality**
- **API Endpoint Management** - Add, edit, delete, and organize your API endpoints
- **Automated Cron Scheduling** - Set up recurring tests with custom intervals
- **Real-time Monitoring** - Live dashboard with charts and activity logs
- **Manual API Testing** - Interactive request/response testing interface
- **Individual Job Tracking** - Each cron job maintains its own request counter
- **Comprehensive Analytics** - Response times, status codes, success rates

### 📊 **Advanced Monitoring**
- **Live Dashboard** with real-time charts and statistics
- **Individual Cron Job Logs** with dedicated tracking per schedule
- **Response Time Trends** using actual API performance data
- **Status Code Distribution** with success/error breakdowns
- **Browser Notifications** for failed API requests
- **Data Export** to CSV for analysis

### 🎨 **Modern UI/UX**
- **Dark/Light Theme Toggle** with smooth transitions
- **Fully Responsive Design** - works on desktop, tablet, and mobile
- **Beautiful Animations** and hover effects throughout
- **Professional Corporate Design** suitable for enterprise use
- **Touch-friendly Interface** optimized for mobile devices

### 🔧 **Technical Features**
- **No Dependencies** - Pure vanilla JavaScript, HTML, CSS
- **Local Storage** - All data persists in browser storage
- **Real-time Updates** - Live refresh of monitoring data
- **Export Functionality** - Download logs and data as CSV files
- **Mobile Menu** - Responsive navigation for small screens

## 🚀 Quick Start

### Local Installation

1. **Clone or Download** the project files
2. **Open `index.html`** in any modern web browser
3. **Start monitoring** your APIs immediately!

```bash
# Clone the repository
git clone <repository-url>

# Navigate to directory
cd api_watchdog

# Open in browser (or use a local server)
open index.html
```

### 🌐 Deploy to Render (Recommended)

**One-Click Deployment:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Manual Deployment Steps:**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/api-watchdog.git
   git push -u origin main
   ```

2. **Connect to Render:**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `api-watchdog` repository

3. **Configure Deployment:**
   - **Name:** `api-watchdog` (or your preferred name)
   - **Branch:** `main`
   - **Build Command:** `echo "No build required"`
   - **Publish Directory:** `./`
   - Click "Create Static Site"

4. **Your site will be live at:**
   ```
   https://your-app-name.onrender.com
   ```

**Alternative Deployment Platforms:**
- **Netlify:** Drag & drop the folder to [netlify.com/drop](https://app.netlify.com/drop)
- **Vercel:** Run `npx vercel` in the project directory
- **GitHub Pages:** Push to GitHub and enable Pages in repository settings

### First Steps

1. **Add an API Endpoint:**
   - Click "Add Endpoint" on the Endpoints page
   - Enter endpoint name, URL, method, and input type
   - Save and test your endpoint

2. **Create a Cron Schedule:**
   - Go to Cron Scheduler page
   - Click "Add Schedule"
   - Select endpoint and interval (30s, 1m, 5m, etc.)
   - Watch your API get monitored automatically

3. **Monitor Performance:**
   - View real-time dashboard with charts
   - Check individual job logs and statistics
   - Export data for further analysis

## 📱 Usage Guide

### Managing API Endpoints

**Supported Input Types:**
- 🚫 **None** - No input required
- 📝 **Text** - Text-based input
- 🖼️ **Image** - Image file input
- 🎥 **Video** - Video file input

**Endpoint Configuration:**
```javascript
{
  name: "User API",
  url: "https://api.example.com/users",
  method: "GET",
  inputType: "none",
  headers: {"Authorization": "Bearer token"},
  body: "{\"key\": \"value\"}"
}
```

### Cron Job Scheduling

**Predefined Intervals:**
- 30 seconds
- 1 minute  
- 5 minutes
- 15 minutes
- 30 minutes
- 1 hour
- Custom interval (minimum 10 seconds)

**Individual Job Tracking:**
Each cron job maintains:
- ✅ Individual request counter (Job #1, #2, #3...)
- 📊 Success/failure statistics
- ⏱️ Response time history
- 📈 Success rate percentage
- 📝 Dedicated log history (last 100 requests)

### Monitoring & Analytics

**Dashboard Metrics:**
- Total endpoints configured
- Active monitoring jobs
- Scheduled cron jobs count
- Failed request statistics

**Real-time Charts:**
- **Response Time Trends** - Live performance data
- **Status Code Distribution** - Success/error breakdown

**Activity Tracking:**
- Recent API test results
- Cron job execution logs
- Manual test history

## 🎛️ Advanced Features

### Individual Cron Job Logs

Each scheduled job has dedicated tracking:

```
📊 Job Statistics:
- This Job's Requests: 156
- Successful: 143  
- Failures: 13
- Success Rate: 92%

📝 Request History:
Job #156 | 2m ago | Status 200 | 200 - 245ms
Job #155 | 4m ago | Status 200 | 200 - 198ms  
Job #154 | 6m ago | Status 404 | 404 - 156ms
```

### Log Format Examples

**Cron Job Logs:**
```
🕐 CRON  | [User API] Job #15 | Status 200 - 234ms | 30 seconds schedule
```

**Manual Test Logs:**
```
🔄 MANUAL | [Order API] Manual #67 | Status 404 - 156ms | Manual test
```

### Export Capabilities

**CSV Export includes:**
- Request Number
- Timestamp (ISO format)
- Status Code
- Response Time (ms)
- Success/Error Level
- Detailed Message

## 🎨 Customization

### Theme Configuration

The application supports both light and dark themes with CSS custom properties:

```css
:root {
  --primary-color: #2563eb;
  --success-color: #059669;
  --error-color: #dc2626;
  --warning-color: #d97706;
}
```

### Responsive Breakpoints

- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px  
- **Mobile:** 480px - 767px
- **Small Mobile:** <480px

## ⚙️ Configuration

### Browser Notifications

Enable notifications in settings to receive alerts for:
- Failed API requests during scheduled monitoring
- Connection timeouts and errors
- Critical endpoint failures

### Storage Management

Data is stored in browser's localStorage:
- `api_endpoints` - Endpoint configurations
- `api_schedules` - Cron job schedules  
- `activity_logs` - Activity history
- `response_time_history` - Performance data
- `status_code_history` - Status tracking
- `schedule_stats` - Individual job statistics

## 🔧 Technical Details

### Deployment Files

**For Render deployment, the following files are included:**
- `render.yaml` - Render configuration
- `_redirects` - Routing rules for SPA behavior
- `package.json` - Project metadata for hosting platforms

### Browser Compatibility

- ✅ **Chrome** 80+
- ✅ **Firefox** 75+
- ✅ **Safari** 13+
- ✅ **Edge** 80+

### Performance

- **Lightweight** - No external dependencies
- **Fast Loading** - Optimized CSS and JavaScript
- **Efficient Storage** - Smart data management
- **Smooth Animations** - Hardware-accelerated transitions

### Architecture

```
api_watchdog/
├── index.html          # Main application structure
├── styles.css          # Complete styling system
├── script.js           # Full application logic
└── README.md          # Documentation
```

## 🚨 Troubleshooting

### Common Issues

**Cron jobs not running:**
- Check if schedules are marked as "Active"
- Verify endpoints still exist
- Check browser console for errors

**Data not persisting:**
- Ensure localStorage is enabled in browser
- Check available storage space
- Clear browser cache if needed

**Notifications not working:**
- Grant notification permissions when prompted
- Check browser notification settings
- Verify notifications are enabled in app settings

### Browser Console

Open developer tools (F12) to see detailed logs and any error messages.

## 📈 Roadmap

**Planned Features:**
- 🔌 Webhook integrations
- 📧 Email notifications  
- 🌐 Team collaboration features
- 📱 Progressive Web App (PWA) support
- 🔄 API response validation rules
- 📊 Advanced analytics and reporting

## 🤝 Contributing

Contributions are welcome! This project uses:
- **HTML5** for structure
- **CSS3** with custom properties for styling  
- **Vanilla JavaScript** (ES6+) for functionality
- **Chart.js** for data visualization

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🛠️ Development

### Local Development

```bash
# Serve locally (optional)
python -m http.server 8000
# or
npx http-server

# Open browser
open http://localhost:8000
```

### Production Deployment

**Environment Considerations:**
- ✅ **HTTPS Required** - For browser notifications and secure API calls
- ✅ **CORS Handling** - Configure your APIs to allow requests from your domain
- ✅ **Static Hosting** - No server-side processing required
- ✅ **CDN Ready** - All assets can be cached by CDN

**Post-Deployment Checklist:**
1. ✅ Test all API endpoints from the deployed URL
2. ✅ Verify browser notifications work (HTTPS required)
3. ✅ Check localStorage persistence across page reloads
4. ✅ Test responsive design on mobile devices
5. ✅ Confirm cron jobs execute properly

### Code Structure

- **Modular Design** - Clear separation of concerns
- **Event-driven Architecture** - Responsive user interactions  
- **Data Persistence** - localStorage integration
- **Real-time Updates** - Live dashboard refreshing

---

**Made with ❤️ for API monitoring and testing**

*Professional, reliable, and beautiful API monitoring that works everywhere.*