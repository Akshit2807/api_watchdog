// API Watchdog - Main JavaScript Application
class APIWatchdog {
    constructor() {
        this.endpoints = JSON.parse(localStorage.getItem('api_endpoints') || '[]');
        this.schedules = JSON.parse(localStorage.getItem('api_schedules') || '[]');
        this.settings = JSON.parse(localStorage.getItem('api_settings') || '{}');
        this.currentPage = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        this.monitoringInterval = null;
        this.activityLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
        this.charts = {};
        this.responseTimeHistory = JSON.parse(localStorage.getItem('response_time_history') || '[]');
        this.statusCodeHistory = JSON.parse(localStorage.getItem('status_code_history') || '[]');
        this.scheduleIntervals = new Map();
        this.scheduleStats = JSON.parse(localStorage.getItem('schedule_stats') || '{}');
        this.globalRequestCounter = parseInt(localStorage.getItem('global_request_counter') || '0');
        
        this.init();
    }

    init() {
        this.requestNotificationPermission();
        this.setupEventListeners();
        this.setupTheme();
        this.initializeCharts();
        this.loadData();
        this.startMonitoring();
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Mobile menu toggle
        document.getElementById('mobileMenuToggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Add endpoint button
        document.getElementById('addEndpointBtn').addEventListener('click', () => {
            this.openEndpointModal();
        });

        // Add schedule button
        document.getElementById('addScheduleBtn').addEventListener('click', () => {
            this.openScheduleModal();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Endpoint form
        document.getElementById('saveEndpoint').addEventListener('click', () => {
            this.saveEndpoint();
        });

        document.getElementById('cancelEndpoint').addEventListener('click', () => {
            this.closeModals();
        });

        // Schedule form
        document.getElementById('saveSchedule').addEventListener('click', () => {
            this.saveSchedule();
        });

        document.getElementById('cancelSchedule').addEventListener('click', () => {
            this.closeModals();
        });

        // Input type selection
        document.querySelectorAll('.input-type-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectInputType(option);
            });
        });

        // Interval selection
        document.querySelectorAll('.interval-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectInterval(option);
            });
        });

        // API testing
        document.getElementById('sendTestRequest').addEventListener('click', () => {
            this.sendTestRequest();
        });

        // Monitoring controls
        document.getElementById('pauseMonitoring')?.addEventListener('click', () => {
            this.toggleMonitoring();
        });

        document.getElementById('clearLogs')?.addEventListener('click', () => {
            this.clearLogs();
        });

        // Settings
        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.saveSettings();
        });

        // Schedule logs modal
        document.getElementById('closeScheduleLogs')?.addEventListener('click', () => {
            this.closeModals();
        });

        document.getElementById('clearScheduleLogs')?.addEventListener('click', () => {
            this.clearScheduleLogs();
        });

        document.getElementById('exportScheduleLogs')?.addEventListener('click', () => {
            this.exportScheduleLogs();
        });

        // Custom interval input
        document.getElementById('customInterval').addEventListener('input', (e) => {
            if (e.target.value) {
                document.querySelectorAll('.interval-option').forEach(opt => opt.classList.remove('selected'));
                document.getElementById('scheduleInterval').value = e.target.value;
            }
        });
    }

    setupTheme() {
        document.body.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
        
        // Smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
        
        // Close menu when clicking outside
        if (sidebar.classList.contains('open')) {
            document.addEventListener('click', this.closeMobileMenu.bind(this));
        } else {
            document.removeEventListener('click', this.closeMobileMenu.bind(this));
        }
    }

    closeMobileMenu(e) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.getElementById('mobileMenuToggle');
        
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            document.removeEventListener('click', this.closeMobileMenu.bind(this));
        }
    }

    navigateToPage(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');

        this.currentPage = page;

        // Load page-specific data
        this.loadPageData(page);
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'endpoints':
                this.renderEndpoints();
                break;
            case 'scheduler':
                this.renderSchedules();
                break;
            case 'monitoring':
                this.renderLogs();
                break;
        }
    }

    // Dashboard functionality
    updateDashboard() {
        const stats = this.calculateStats();
        
        document.getElementById('totalEndpoints').textContent = stats.totalEndpoints;
        document.getElementById('activeEndpoints').textContent = stats.activeEndpoints;
        document.getElementById('scheduledJobsCount').textContent = stats.scheduledJobs;
        document.getElementById('failedRequests').textContent = stats.failedRequests;

        this.updateActivityList();
        this.updateCharts();
    }

    calculateStats() {
        return {
            totalEndpoints: this.endpoints.length,
            activeEndpoints: this.endpoints.filter(e => e.status === 'active').length,
            scheduledJobs: this.schedules.length,
            failedRequests: this.activityLogs.filter(log => log.level === 'error').length
        };
    }

    updateActivityList() {
        const activityList = document.getElementById('activityList');
        const recentLogs = this.activityLogs.slice(-5).reverse();

        if (recentLogs.length === 0) {
            activityList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No recent activity</p>';
            return;
        }

        activityList.innerHTML = recentLogs.map(log => {
            const jobType = log.isScheduled ? 'Cron Job' : 'Manual Test';
            const jobIcon = log.isScheduled ? '⏰' : '🔄';
            
            return `
                <div class="activity-item">
                    <div class="activity-icon ${log.level}" style="background: var(--${log.level === 'error' ? 'error' : log.level === 'success' ? 'success' : 'primary'}-color)">
                        <i class="fas fa-${log.level === 'error' ? 'exclamation-triangle' : log.level === 'success' ? 'check' : 'info-circle'}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${log.endpoint || 'System'} <span style="font-size: 0.8em; color: var(--text-muted);">${jobIcon} ${jobType}</span></h4>
                        <p>${log.message}</p>
                    </div>
                    <div class="activity-time">${this.formatTime(log.timestamp)}</div>
                </div>
            `;
        }).join('');
    }

    initializeCharts() {
        // Response Time Chart
        const responseCtx = document.getElementById('responseTimeChart');
        if (responseCtx) {
            this.charts.responseTime = new Chart(responseCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Response Time (ms)',
                        data: [],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                            }
                        },
                        x: {
                            grid: {
                            }
                        }
                    }
                }
            });
        }

        // Status Chart
        const statusCtx = document.getElementById('statusChart');
        if (statusCtx) {
            this.charts.status = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Success (2xx)', 'Client Error (4xx)', 'Server Error (5xx)'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: ['#059669', '#d97706', '#dc2626'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        // Update response time chart with real data
        if (this.charts.responseTime && this.responseTimeHistory.length > 0) {
            const recentData = this.responseTimeHistory.slice(-10);
            const labels = recentData.map(item => new Date(item.timestamp).toLocaleTimeString());
            const data = recentData.map(item => item.responseTime);
            
            this.charts.responseTime.data.labels = labels;
            this.charts.responseTime.data.datasets[0].data = data;
            this.charts.responseTime.update();
        } else if (this.charts.responseTime) {
            // Show empty state
            this.charts.responseTime.data.labels = ['No data'];
            this.charts.responseTime.data.datasets[0].data = [0];
            this.charts.responseTime.update();
        }

        // Update status code chart with real data
        if (this.charts.status && this.statusCodeHistory.length > 0) {
            const statusCounts = { success: 0, client_error: 0, server_error: 0 };
            
            this.statusCodeHistory.forEach(item => {
                if (item.status >= 200 && item.status < 300) {
                    statusCounts.success++;
                } else if (item.status >= 400 && item.status < 500) {
                    statusCounts.client_error++;
                } else if (item.status >= 500) {
                    statusCounts.server_error++;
                }
            });
            
            this.charts.status.data.datasets[0].data = [
                statusCounts.success,
                statusCounts.client_error,
                statusCounts.server_error
            ];
            this.charts.status.update();
        } else if (this.charts.status) {
            // Show empty state
            this.charts.status.data.datasets[0].data = [1, 0, 0];
            this.charts.status.update();
        }
    }

    // Endpoint management
    openEndpointModal(endpoint = null) {
        const modal = document.getElementById('endpointModal');
        const form = document.getElementById('endpointForm');
        
        if (endpoint) {
            // Edit mode
            document.getElementById('endpointName').value = endpoint.name;
            document.getElementById('endpointUrl').value = endpoint.url;
            document.getElementById('endpointMethod').value = endpoint.method;
            document.getElementById('endpointHeaders').value = JSON.stringify(endpoint.headers || {}, null, 2);
            document.getElementById('endpointBody').value = endpoint.body || '';
            document.getElementById('endpointInputType').value = endpoint.inputType || 'none';
            
            // Select input type
            document.querySelectorAll('.input-type-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.type === endpoint.inputType);
            });
            
            form.dataset.editId = endpoint.id;
        } else {
            // Add mode
            form.reset();
            document.getElementById('endpointInputType').value = 'none';
            document.querySelectorAll('.input-type-option').forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.type === 'none');
            });
            delete form.dataset.editId;
        }

        modal.classList.add('active');
    }

    selectInputType(option) {
        document.querySelectorAll('.input-type-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        document.getElementById('endpointInputType').value = option.dataset.type;
    }

    saveEndpoint() {
        const form = document.getElementById('endpointForm');
        const name = document.getElementById('endpointName').value.trim();
        const url = document.getElementById('endpointUrl').value.trim();
        const method = document.getElementById('endpointMethod').value;
        const inputType = document.getElementById('endpointInputType').value;
        const headersText = document.getElementById('endpointHeaders').value.trim();
        const body = document.getElementById('endpointBody').value.trim();

        if (!name || !url) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        let headers = {};
        if (headersText) {
            try {
                headers = JSON.parse(headersText);
            } catch (e) {
                this.showNotification('Invalid JSON in headers field', 'error');
                return;
            }
        }

        const endpoint = {
            id: form.dataset.editId || this.generateId(),
            name,
            url,
            method,
            inputType,
            headers,
            body,
            status: 'active',
            lastChecked: null,
            responseTime: null,
            createdAt: form.dataset.editId ? 
                this.endpoints.find(e => e.id === form.dataset.editId)?.createdAt : 
                new Date().toISOString()
        };

        if (form.dataset.editId) {
            const index = this.endpoints.findIndex(e => e.id === form.dataset.editId);
            this.endpoints[index] = endpoint;
        } else {
            this.endpoints.push(endpoint);
        }

        this.saveData();
        this.renderEndpoints();
        this.updateScheduleEndpoints();
        this.closeModals();
        
        this.showNotification(`Endpoint ${form.dataset.editId ? 'updated' : 'added'} successfully`, 'success');
    }

    renderEndpoints() {
        const grid = document.getElementById('endpointsGrid');
        
        if (this.endpoints.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    <i class="fas fa-plug" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No endpoints configured</h3>
                    <p>Add your first API endpoint to get started</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.endpoints.map(endpoint => `
            <div class="endpoint-card" data-id="${endpoint.id}">
                <div class="endpoint-header">
                    <div>
                        <div class="endpoint-title">${endpoint.name}</div>
                        <div class="endpoint-url">${endpoint.url}</div>
                    </div>
                    <div class="endpoint-actions">
                        <button class="endpoint-action" onclick="apiWatchdog.testEndpoint('${endpoint.id}')" title="Test endpoint">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="endpoint-action" onclick="apiWatchdog.editEndpoint('${endpoint.id}')" title="Edit endpoint">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="endpoint-action" onclick="apiWatchdog.deleteEndpoint('${endpoint.id}')" title="Delete endpoint">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="endpoint-details">
                    <span class="endpoint-method">${endpoint.method}</span>
                    <div class="endpoint-type">
                        <i class="fas fa-${this.getInputTypeIcon(endpoint.inputType)}"></i>
                        <span>${endpoint.inputType}</span>
                    </div>
                </div>
                <div class="endpoint-status">
                    <div class="status-indicator">
                        <div class="status-dot ${endpoint.status}"></div>
                        <span>${endpoint.status}</span>
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-muted);">
                        ${endpoint.responseTime ? `${endpoint.responseTime}ms` : 'Never tested'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getInputTypeIcon(type) {
        const icons = {
            none: 'ban',
            text: 'font',
            image: 'image',
            video: 'video'
        };
        return icons[type] || 'question';
    }

    editEndpoint(id) {
        const endpoint = this.endpoints.find(e => e.id === id);
        if (endpoint) {
            this.openEndpointModal(endpoint);
        }
    }

    deleteEndpoint(id) {
        if (confirm('Are you sure you want to delete this endpoint?')) {
            this.endpoints = this.endpoints.filter(e => e.id !== id);
            this.schedules = this.schedules.filter(s => s.endpointId !== id);
            this.saveData();
            this.renderEndpoints();
            this.renderSchedules();
            this.updateScheduleEndpoints();
            this.showNotification('Endpoint deleted successfully', 'success');
        }
    }

    async testEndpoint(id, isScheduled = false, scheduleId = null) {
        const endpoint = this.endpoints.find(e => e.id === id);
        if (!endpoint) return;

        // Increment global request counter
        this.globalRequestCounter++;
        localStorage.setItem('global_request_counter', this.globalRequestCounter.toString());

        // Initialize or update schedule stats
        let jobRequestNumber = null;
        if (isScheduled && scheduleId) {
            if (!this.scheduleStats[scheduleId]) {
                this.scheduleStats[scheduleId] = {
                    totalRequests: 0,
                    successCount: 0,
                    errorCount: 0,
                    lastSuccess: null,
                    lastError: null,
                    logs: []
                };
            }
            this.scheduleStats[scheduleId].totalRequests++;
            jobRequestNumber = this.scheduleStats[scheduleId].totalRequests;
        }

        const startTime = Date.now();
        let statusCode = null;
        const schedule = scheduleId ? this.schedules.find(s => s.id === scheduleId) : null;
        const scheduleInfo = schedule ? `${this.formatInterval(schedule.interval)} schedule` : null;
        
        try {
            const response = await this.makeRequest(endpoint);
            const responseTime = Date.now() - startTime;
            statusCode = response.status;
            
            // Update endpoint status
            endpoint.status = response.ok ? 'success' : 'error';
            endpoint.responseTime = responseTime;
            endpoint.lastChecked = new Date().toISOString();
            
            // Update schedule stats
            if (isScheduled && scheduleId) {
                this.scheduleStats[scheduleId].successCount++;
                this.scheduleStats[scheduleId].lastSuccess = new Date().toISOString();
                
                // Add to schedule-specific logs
                this.scheduleStats[scheduleId].logs.push({
                    timestamp: new Date().toISOString(),
                    status: response.status,
                    responseTime: responseTime,
                    level: response.ok ? 'success' : 'error',
                    message: `${response.status} - ${responseTime}ms`,
                    requestNumber: jobRequestNumber
                });
                
                // Keep only last 100 logs per schedule
                if (this.scheduleStats[scheduleId].logs.length > 100) {
                    this.scheduleStats[scheduleId].logs = this.scheduleStats[scheduleId].logs.slice(-100);
                }
            }
            
            // Store data for charts
            this.addResponseTimeData({
                timestamp: new Date().toISOString(),
                responseTime: responseTime,
                endpointName: endpoint.name
            });
            
            this.addStatusCodeData({
                timestamp: new Date().toISOString(),
                status: statusCode,
                endpointName: endpoint.name
            });
            
            this.saveData();
            this.renderEndpoints();
            
            // Create enhanced log message
            const logMessage = isScheduled ? 
                `Job #${jobRequestNumber} | Status ${response.status} - ${responseTime}ms | ${scheduleInfo}` :
                `Manual #${this.globalRequestCounter} | ${response.status} - ${responseTime}ms | Manual test`;
            
            // Add to activity log
            this.addActivityLog({
                endpoint: endpoint.name,
                message: logMessage,
                level: response.ok ? 'success' : 'error',
                timestamp: new Date(),
                requestNumber: isScheduled ? jobRequestNumber : this.globalRequestCounter,
                scheduleInfo: scheduleInfo,
                scheduleId: scheduleId,
                isScheduled: isScheduled
            });
            
            // Browser notification for failures
            if (!response.ok && this.settings.browserNotifications && isScheduled) {
                this.sendBrowserNotification(
                    'API Endpoint Failed',
                    `${endpoint.name}: ${response.status} ${response.statusText}`,
                    'error'
                );
            }
            
            if (!isScheduled) {
                this.showNotification(`Test completed: ${response.status} (${responseTime}ms)`, response.ok ? 'success' : 'error');
            }
            
        } catch (error) {
            const responseTime = Date.now() - startTime;
            endpoint.status = 'error';
            endpoint.responseTime = responseTime;
            endpoint.lastChecked = new Date().toISOString();
            
            // Update schedule stats
            if (isScheduled && scheduleId) {
                this.scheduleStats[scheduleId].errorCount++;
                this.scheduleStats[scheduleId].lastError = new Date().toISOString();
                
                // Add to schedule-specific logs
                this.scheduleStats[scheduleId].logs.push({
                    timestamp: new Date().toISOString(),
                    status: 0,
                    responseTime: responseTime,
                    level: 'error',
                    message: `Request failed: ${error.message}`,
                    requestNumber: jobRequestNumber
                });
                
                // Keep only last 100 logs per schedule
                if (this.scheduleStats[scheduleId].logs.length > 100) {
                    this.scheduleStats[scheduleId].logs = this.scheduleStats[scheduleId].logs.slice(-100);
                }
            }
            
            // Store error data for charts
            this.addResponseTimeData({
                timestamp: new Date().toISOString(),
                responseTime: responseTime,
                endpointName: endpoint.name
            });
            
            this.addStatusCodeData({
                timestamp: new Date().toISOString(),
                status: 0, // Network error
                endpointName: endpoint.name
            });
            
            this.saveData();
            this.renderEndpoints();
            
            // Create enhanced log message
            const logMessage = isScheduled ? 
                `Job #${jobRequestNumber} | Request failed: ${error.message} | ${scheduleInfo}` :
                `Manual #${this.globalRequestCounter} | Request failed: ${error.message} | Manual test`;
            
            this.addActivityLog({
                endpoint: endpoint.name,
                message: logMessage,
                level: 'error',
                timestamp: new Date(),
                requestNumber: isScheduled ? jobRequestNumber : this.globalRequestCounter,
                scheduleInfo: scheduleInfo,
                scheduleId: scheduleId,
                isScheduled: isScheduled
            });
            
            // Browser notification for failures
            if (this.settings.browserNotifications && isScheduled) {
                this.sendBrowserNotification(
                    'API Endpoint Error',
                    `${endpoint.name}: ${error.message}`,
                    'error'
                );
            }
            
            if (!isScheduled) {
                this.showNotification(`Test failed: ${error.message}`, 'error');
            }
        }
        
        // Save schedule stats
        localStorage.setItem('schedule_stats', JSON.stringify(this.scheduleStats));
    }

    // Schedule management
    openScheduleModal(schedule = null) {
        const modal = document.getElementById('scheduleModal');
        const form = document.getElementById('scheduleForm');
        this.updateScheduleEndpoints();
        
        if (schedule) {
            // Edit mode
            document.getElementById('scheduleEndpoint').value = schedule.endpointId;
            
            // Select interval option if it matches predefined values
            const intervalOption = document.querySelector(`[data-interval="${schedule.interval}"]`);
            
            if (intervalOption) {
                document.querySelectorAll('.interval-option').forEach(opt => opt.classList.remove('selected'));
                intervalOption.classList.add('selected');
                document.getElementById('scheduleInterval').value = schedule.interval;
                document.getElementById('customInterval').value = '';
            } else {
                // Custom interval
                document.querySelectorAll('.interval-option').forEach(opt => opt.classList.remove('selected'));
                document.getElementById('scheduleInterval').value = schedule.interval;
                document.getElementById('customInterval').value = schedule.interval;
            }
            
            form.dataset.editId = schedule.id;
            document.querySelector('#scheduleModal h2').textContent = 'Edit Schedule';
        } else {
            // Add mode
            document.getElementById('scheduleForm').reset();
            document.getElementById('customInterval').value = '';
            document.querySelectorAll('.interval-option').forEach(opt => opt.classList.remove('selected'));
            delete form.dataset.editId;
            document.querySelector('#scheduleModal h2').textContent = 'Schedule Endpoint';
        }
        
        modal.classList.add('active');
    }

    updateScheduleEndpoints() {
        const select = document.getElementById('scheduleEndpoint');
        select.innerHTML = '<option value="">Select an endpoint...</option>';
        
        this.endpoints.forEach(endpoint => {
            const option = document.createElement('option');
            option.value = endpoint.id;
            option.textContent = `${endpoint.name} (${endpoint.method})`;
            select.appendChild(option);
        });
    }

    selectInterval(option) {
        document.querySelectorAll('.interval-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        document.getElementById('scheduleInterval').value = option.dataset.interval;
        document.getElementById('customInterval').value = '';
    }

    saveSchedule() {
        const form = document.getElementById('scheduleForm');
        const endpointId = document.getElementById('scheduleEndpoint').value;
        const interval = document.getElementById('scheduleInterval').value || 
                        document.getElementById('customInterval').value;

        if (!endpointId || !interval) {
            this.showNotification('Please select an endpoint and interval', 'error');
            return;
        }

        const endpoint = this.endpoints.find(e => e.id === endpointId);
        const isEdit = !!form.dataset.editId;
        
        if (isEdit) {
            // Edit existing schedule
            const schedule = this.schedules.find(s => s.id === form.dataset.editId);
            if (schedule) {
                // Stop old interval
                this.stopScheduleInterval(schedule.id);
                
                // Update schedule
                schedule.endpointId = endpointId;
                schedule.endpointName = endpoint.name;
                schedule.interval = parseInt(interval);
                
                // Start new interval if active
                if (schedule.isActive) {
                    this.startScheduleInterval(schedule);
                }
            }
        } else {
            // Create new schedule
            const schedule = {
                id: this.generateId(),
                endpointId,
                endpointName: endpoint.name,
                interval: parseInt(interval),
                isActive: true,
                lastRun: null,
                createdAt: new Date().toISOString()
            };

            this.schedules.push(schedule);
            this.startScheduleInterval(schedule);
        }

        this.saveData();
        this.renderSchedules();
        this.closeModals();
        
        this.showNotification(`Schedule ${isEdit ? 'updated' : 'created'} successfully`, 'success');
    }

    renderSchedules() {
        const container = document.getElementById('scheduledJobs');
        
        if (!container) {
            console.error('scheduledJobs container not found');
            return;
        }
        
        if (this.schedules.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <i class="fas fa-clock" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No scheduled jobs</h3>
                    <p>Create your first cron job to automate API testing</p>
                    <button class="btn btn-primary" onclick="apiWatchdog.openScheduleModal()" style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i>
                        Add Your First Schedule
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.schedules.map(schedule => {
            const endpoint = this.endpoints.find(e => e.id === schedule.endpointId);
            const endpointExists = !!endpoint;
            const stats = this.scheduleStats[schedule.id] || { totalRequests: 0, successCount: 0, errorCount: 0 };
            const successRate = stats.totalRequests > 0 ? Math.round((stats.successCount / stats.totalRequests) * 100) : 0;
            
            return `
                <div class="scheduled-job ${!endpointExists ? 'job-error' : ''}" data-id="${schedule.id}">
                    <div class="job-info">
                        <div class="job-name">${schedule.endpointName}</div>
                        <div class="job-details">
                            ${!endpointExists ? '<span style="color: var(--error-color);">⚠️ Endpoint deleted</span> • ' : ''}
                            Every ${this.formatInterval(schedule.interval)} • 
                            ${schedule.lastRun ? `Last run: ${this.formatTime(schedule.lastRun)}` : 'Never run'}
                        </div>
                        <div class="job-stats">
                            <span class="stat-item">📊 This job: ${stats.totalRequests} requests</span>
                            <span class="stat-item">✅ ${stats.successCount} successful</span>
                            ${stats.errorCount > 0 ? `<span class="stat-item error">❌ ${stats.errorCount} failures</span>` : ''}
                            <span class="stat-item">🎢 ${successRate}% success rate</span>
                        </div>
                        ${endpoint ? `<div class="job-endpoint-url">${endpoint.url}</div>` : ''}
                    </div>
                    <div class="job-status">
                        <div class="status-dot ${!endpointExists ? 'error' : schedule.isActive ? 'success' : 'warning'}"></div>
                        <span>${!endpointExists ? 'Error' : schedule.isActive ? 'Active' : 'Paused'}</span>
                    </div>
                    <div class="job-actions">
                        ${endpointExists ? `
                            <button class="endpoint-action" onclick="apiWatchdog.viewScheduleLogs('${schedule.id}')" 
                                    title="View logs">
                                <i class="fas fa-file-alt"></i>
                            </button>
                            <button class="endpoint-action" onclick="apiWatchdog.runScheduleNow('${schedule.id}')" 
                                    title="Run now">
                                <i class="fas fa-play-circle"></i>
                            </button>
                            <button class="endpoint-action" onclick="apiWatchdog.toggleSchedule('${schedule.id}')" 
                                    title="${schedule.isActive ? 'Pause' : 'Resume'} schedule">
                                <i class="fas fa-${schedule.isActive ? 'pause' : 'play'}"></i>
                            </button>
                            <button class="endpoint-action" onclick="apiWatchdog.editSchedule('${schedule.id}')" 
                                    title="Edit schedule">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        <button class="endpoint-action" onclick="apiWatchdog.deleteSchedule('${schedule.id}')" title="Delete schedule">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatInterval(seconds) {
        if (seconds < 60) return `${seconds} seconds`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
        return `${Math.floor(seconds / 3600)} hours`;
    }

    toggleSchedule(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            schedule.isActive = !schedule.isActive;
            
            if (schedule.isActive) {
                this.startScheduleInterval(schedule);
            } else {
                this.stopScheduleInterval(id);
            }
            
            this.saveData();
            this.renderSchedules();
            this.showNotification(`Schedule ${schedule.isActive ? 'resumed' : 'paused'}`, 'success');
        }
    }

    deleteSchedule(id, skipConfirm = false) {
        const shouldConfirm = skipConfirm || confirm('Are you sure you want to delete this schedule?');
        
        if (shouldConfirm) {
            this.stopScheduleInterval(id);
            this.schedules = this.schedules.filter(s => s.id !== id);
            this.saveData();
            this.renderSchedules();
            
            if (!skipConfirm) {
                this.showNotification('Schedule deleted successfully', 'success');
            }
        }
    }

    // API Testing
    async sendTestRequest() {
        const method = document.getElementById('testMethod').value;
        const url = document.getElementById('testUrl').value.trim();
        const headersText = document.getElementById('testHeaders').value.trim();
        const body = document.getElementById('testBody').value.trim();

        if (!url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        let headers = {};
        if (headersText) {
            try {
                headers = JSON.parse(headersText);
            } catch (e) {
                this.showNotification('Invalid JSON in headers field', 'error');
                return;
            }
        }

        const testEndpoint = { url, method, headers, body };
        const startTime = Date.now();

        try {
            document.getElementById('sendTestRequest').innerHTML = '<div class="loading"></div> Sending...';
            
            const response = await this.makeRequest(testEndpoint);
            const responseTime = Date.now() - startTime;
            const responseBody = await response.text();

            // Update UI
            const statusElement = document.getElementById('responseStatus');
            statusElement.textContent = `Status ${response.status} ${response.statusText}`;
            statusElement.className = `status-code ${response.ok ? 'success' : 'error'}`;
            statusElement.style.background = response.ok ? 'var(--success-color)' : 'var(--error-color)';

            document.getElementById('responseTime').textContent = `${responseTime}ms`;
            document.getElementById('responseBody').textContent = responseBody || 'Empty response';

        } catch (error) {
            const responseTime = Date.now() - startTime;
            
            document.getElementById('responseStatus').textContent = 'Request Failed';
            document.getElementById('responseStatus').className = 'status-code error';
            document.getElementById('responseStatus').style.background = 'var(--error-color)';
            document.getElementById('responseTime').textContent = `${responseTime}ms`;
            document.getElementById('responseBody').textContent = error.message;
        } finally {
            document.getElementById('sendTestRequest').innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';
        }
    }

    // Monitoring
    startMonitoring() {
        // Clear any existing intervals
        this.scheduleIntervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.scheduleIntervals.clear();
        
        // Set up individual intervals for each active schedule
        this.schedules.forEach(schedule => {
            if (schedule.isActive) {
                this.startScheduleInterval(schedule);
            }
        });
        
        // Update dashboard every 30 seconds
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        this.monitoringInterval = setInterval(() => {
            if (this.currentPage === 'dashboard') {
                this.updateDashboard();
            }
        }, 30000);
    }

    startScheduleInterval(schedule) {
        const intervalMs = schedule.interval * 1000;
        
        const intervalId = setInterval(async () => {
            if (!schedule.isActive) {
                clearInterval(intervalId);
                this.scheduleIntervals.delete(schedule.id);
                return;
            }
            
            schedule.lastRun = new Date().toISOString();
            const endpoint = this.endpoints.find(e => e.id === schedule.endpointId);
            
            if (endpoint) {
                await this.testEndpoint(endpoint.id, true, schedule.id);
                this.saveData();
                
                // Update UI if we're on the scheduler page
                if (this.currentPage === 'scheduler') {
                    this.renderSchedules();
                }
            } else {
                // Endpoint was deleted, remove this schedule
                this.deleteSchedule(schedule.id, true);
            }
        }, intervalMs);
        
        this.scheduleIntervals.set(schedule.id, intervalId);
    }

    stopScheduleInterval(scheduleId) {
        const intervalId = this.scheduleIntervals.get(scheduleId);
        if (intervalId) {
            clearInterval(intervalId);
            this.scheduleIntervals.delete(scheduleId);
        }
    }

    toggleMonitoring() {
        const btn = document.getElementById('pauseMonitoring');
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            btn.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.showNotification('Monitoring paused', 'warning');
        } else {
            this.startMonitoring();
            btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.showNotification('Monitoring resumed', 'success');
        }
    }

    clearLogs() {
        if (confirm('Are you sure you want to clear all logs?')) {
            this.activityLogs = [];
            this.renderLogs();
            this.updateActivityList();
            this.showNotification('Logs cleared', 'success');
        }
    }

    renderLogs() {
        const container = document.getElementById('logsContainer');
        
        if (this.activityLogs.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No logs available</p>';
            return;
        }

        container.innerHTML = this.activityLogs.map(log => {
            const jobType = log.isScheduled ? 'CRON' : 'MANUAL';
            const jobIcon = log.isScheduled ? '⏰' : '🔄';
            
            // Extract status code from message if it exists
            let enhancedMessage = log.message;
            const statusMatch = log.message.match(/(\d{3})\s*-/);
            if (statusMatch) {
                enhancedMessage = log.message.replace(statusMatch[0], `Status ${statusMatch[1]} -`);
            }
            
            return `
                <div class="log-entry">
                    <span class="log-timestamp">${this.formatTime(log.timestamp)}</span>
                    <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
                    <span class="log-type ${log.isScheduled ? 'scheduled' : 'manual'}">${jobIcon} ${jobType}</span>
                    <span class="log-message">[${log.endpoint || 'SYSTEM'}] ${enhancedMessage}</span>
                </div>
            `;
        }).reverse().join('');
    }

    addActivityLog(log) {
        this.activityLogs.push(log);
        if (this.activityLogs.length > 1000) {
            this.activityLogs = this.activityLogs.slice(-1000);
        }
        
        // Save to localStorage
        localStorage.setItem('activity_logs', JSON.stringify(this.activityLogs));
        
        if (this.currentPage === 'monitoring') {
            this.renderLogs();
        }
        this.updateActivityList();
    }

    addResponseTimeData(data) {
        this.responseTimeHistory.push(data);
        if (this.responseTimeHistory.length > 100) {
            this.responseTimeHistory = this.responseTimeHistory.slice(-100);
        }
        localStorage.setItem('response_time_history', JSON.stringify(this.responseTimeHistory));
    }

    addStatusCodeData(data) {
        this.statusCodeHistory.push(data);
        if (this.statusCodeHistory.length > 100) {
            this.statusCodeHistory = this.statusCodeHistory.slice(-100);
        }
        localStorage.setItem('status_code_history', JSON.stringify(this.statusCodeHistory));
    }

    sendBrowserNotification(title, message, type = 'info') {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️',
                badge: '🛡️',
                requireInteraction: type === 'error',
                silent: false
            });
            
            // Auto close after 5 seconds for non-error notifications
            if (type !== 'error') {
                setTimeout(() => {
                    notification.close();
                }, 5000);
            }
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    // Settings
    saveSettings() {
        const settings = {
            defaultTimeout: document.getElementById('defaultTimeout').value,
            retryAttempts: document.getElementById('retryAttempts').value,
            emailNotifications: document.getElementById('emailNotifications').checked,
            browserNotifications: document.getElementById('browserNotifications').checked
        };

        this.settings = settings;
        localStorage.setItem('api_settings', JSON.stringify(settings));
        this.showNotification('Settings saved successfully', 'success');
    }

    loadSettings() {
        if (this.settings.defaultTimeout) {
            document.getElementById('defaultTimeout').value = this.settings.defaultTimeout;
        }
        if (this.settings.retryAttempts) {
            document.getElementById('retryAttempts').value = this.settings.retryAttempts;
        }
        if (this.settings.emailNotifications !== undefined) {
            document.getElementById('emailNotifications').checked = this.settings.emailNotifications;
        }
        if (this.settings.browserNotifications !== undefined) {
            document.getElementById('browserNotifications').checked = this.settings.browserNotifications;
        }
    }

    // Utility methods
    async makeRequest(endpoint) {
        const options = {
            method: endpoint.method,
            headers: endpoint.headers || {}
        };

        if (endpoint.body && endpoint.method !== 'GET') {
            options.body = endpoint.body;
        }

        return fetch(endpoint.url, options);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    editSchedule(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            this.openScheduleModal(schedule);
        }
    }

    runScheduleNow(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            const endpoint = this.endpoints.find(e => e.id === schedule.endpointId);
            if (endpoint) {
                this.testEndpoint(endpoint.id, true, schedule.id);
                schedule.lastRun = new Date().toISOString();
                this.saveData();
                this.renderSchedules();
                this.showNotification(`Running ${schedule.endpointName} now...`, 'info');
            }
        }
    }

    viewScheduleLogs(scheduleId) {
        const schedule = this.schedules.find(s => s.id === scheduleId);
        const stats = this.scheduleStats[scheduleId];
        
        if (!schedule) {
            this.showNotification('Schedule not found', 'error');
            return;
        }

        if (!stats || !stats.logs || stats.logs.length === 0) {
            this.showNotification('No logs found for this schedule', 'warning');
            return;
        }

        this.openScheduleLogsModal(schedule, stats);
    }

    openScheduleLogsModal(schedule, stats) {
        const modal = document.getElementById('scheduleLogsModal');
        const title = document.getElementById('scheduleLogsTitle');
        const statsContainer = document.getElementById('scheduleLogsStats');
        const logsContainer = document.getElementById('scheduleLogsContainer');
        
        // Set title
        title.textContent = `${schedule.endpointName} - Individual Job Tracking`;
        
        // Calculate stats
        const successRate = stats.totalRequests > 0 ? Math.round((stats.successCount / stats.totalRequests) * 100) : 0;
        const avgResponseTime = stats.logs.length > 0 ? 
            Math.round(stats.logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / stats.logs.length) : 0;
        
        // Render stats
        statsContainer.innerHTML = `
            <div class="schedule-stat">
                <div class="schedule-stat-value">${stats.totalRequests}</div>
                <div class="schedule-stat-label">This Job's Requests</div>
            </div>
            <div class="schedule-stat">
                <div class="schedule-stat-value" style="color: var(--success-color)">${stats.successCount}</div>
                <div class="schedule-stat-label">Successful</div>
            </div>
            <div class="schedule-stat">
                <div class="schedule-stat-value" style="color: var(--error-color)">${stats.errorCount}</div>
                <div class="schedule-stat-label">Errors</div>
            </div>
            <div class="schedule-stat">
                <div class="schedule-stat-value" style="color: var(--warning-color)">${successRate}%</div>
                <div class="schedule-stat-label">Success Rate</div>
            </div>
            <div class="schedule-stat">
                <div class="schedule-stat-value">${avgResponseTime}ms</div>
                <div class="schedule-stat-label">Avg Response</div>
            </div>
            <div class="schedule-stat">
                <div class="schedule-stat-value" style="font-size: 1rem; color: var(--text-secondary)">${this.formatInterval(schedule.interval)}</div>
                <div class="schedule-stat-label">Interval</div>
            </div>
        `;
        
        // Render logs (most recent first)
        const logs = [...stats.logs].reverse();
        logsContainer.innerHTML = logs.map(log => `
            <div class="schedule-log-entry">
                <span class="schedule-log-number">Job #${log.requestNumber}</span>
                <span class="schedule-log-timestamp">${this.formatTime(log.timestamp)}</span>
                <span class="schedule-log-status ${log.level}">Status ${log.status || 'ERR'}</span>
                <span class="schedule-log-message">${log.message} • ${schedule.endpointName}</span>
            </div>
        `).join('');
        
        // Store current schedule ID for export/clear functions
        modal.dataset.scheduleId = schedule.id;
        
        modal.classList.add('active');
    }

    clearScheduleLogs() {
        const modal = document.getElementById('scheduleLogsModal');
        const scheduleId = modal.dataset.scheduleId;
        
        if (!scheduleId || !confirm('Are you sure you want to clear all logs for this schedule?')) {
            return;
        }
        
        if (this.scheduleStats[scheduleId]) {
            this.scheduleStats[scheduleId].logs = [];
            this.scheduleStats[scheduleId].totalRequests = 0;
            this.scheduleStats[scheduleId].successCount = 0;
            this.scheduleStats[scheduleId].errorCount = 0;
            this.scheduleStats[scheduleId].lastSuccess = null;
            this.scheduleStats[scheduleId].lastError = null;
            
            localStorage.setItem('schedule_stats', JSON.stringify(this.scheduleStats));
            
            // Refresh the modal and scheduler page
            const schedule = this.schedules.find(s => s.id === scheduleId);
            if (schedule && this.scheduleStats[scheduleId]) {
                this.openScheduleLogsModal(schedule, this.scheduleStats[scheduleId]);
            }
            this.renderSchedules();
            
            this.showNotification('Schedule logs cleared successfully', 'success');
        }
    }

    exportScheduleLogs() {
        const modal = document.getElementById('scheduleLogsModal');
        const scheduleId = modal.dataset.scheduleId;
        
        if (!scheduleId || !this.scheduleStats[scheduleId] || !this.scheduleStats[scheduleId].logs) {
            this.showNotification('No logs to export', 'warning');
            return;
        }
        
        const schedule = this.schedules.find(s => s.id === scheduleId);
        const stats = this.scheduleStats[scheduleId];
        
        // Create CSV content
        const csvHeaders = ['Request Number', 'Timestamp', 'Status Code', 'Response Time (ms)', 'Level', 'Message'];
        const csvRows = [csvHeaders.join(',')];
        
        stats.logs.forEach(log => {
            const row = [
                log.requestNumber || '',
                new Date(log.timestamp).toISOString(),
                log.status || 'ERROR',
                log.responseTime || '',
                log.level || '',
                `"${log.message.replace(/"/g, '""')}"` // Escape quotes in message
            ];
            csvRows.push(row.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const fileName = `${schedule.endpointName.replace(/[^a-z0-9]/gi, '_')}_logs_${new Date().toISOString().slice(0, 10)}.csv`;
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Logs exported successfully', 'success');
        } else {
            this.showNotification('Export not supported in this browser', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary'}-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    saveData() {
        localStorage.setItem('api_endpoints', JSON.stringify(this.endpoints));
        localStorage.setItem('api_schedules', JSON.stringify(this.schedules));
    }

    loadData() {
        this.updateDashboard();
        this.renderEndpoints();
        this.renderSchedules();
        this.loadSettings();
        
        // Force initial render of scheduler page if we have schedules
        if (this.schedules.length > 0) {
            console.log('Initial schedules found:', this.schedules.length);
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
let apiWatchdog;

document.addEventListener('DOMContentLoaded', () => {
    apiWatchdog = new APIWatchdog();
});