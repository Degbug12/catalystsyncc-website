// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initPortfolioFilters();
    initContactForm();
    initAnimationsOnScroll();
    initNavbarScrollEffect();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('light-theme', savedTheme === 'light');
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-theme');
        
        // Save theme preference
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Add a small animation effect
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Link Highlighting
function initNavbarScrollEffect() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call
}

// Portfolio Filter Functionality
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Track form submission
            trackEvent('contact_form_submit', formObject.service || 'general');
            
            // WhatsApp integration option
            const whatsappOption = confirm('Would you like to continue this conversation on WhatsApp for faster response?');
            if (whatsappOption) {
                sendToWhatsApp(formObject);
            } else {
                // Simulate form submission
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                // Reset form
                this.reset();
            }
        });
    }
    
    // Newsletter form submissions
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-green);
        color: var(--primary-bg);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    if (type === 'error') {
        notification.style.background = '#ff4757';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Scroll Animations
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature, .portfolio-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Button Click Effects
document.addEventListener('click', function(e) {
    // Add ripple effect to buttons
    if (e.target.matches('.btn-primary, .btn-secondary, .cta-button, .filter-btn, .view-project')) {
        createRipple(e);
    }
    
    // CTA Button actions
    if (e.target.matches('.cta-button')) {
        document.querySelector('#contact').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Hero action buttons
    if (e.target.textContent === 'Learn More About Us') {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    if (e.target.textContent === 'View Our Work') {
        document.querySelector('#portfolio').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Ripple Effect for Buttons
function createRipple(event) {
    const button = event.target;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Statistics Counter Animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                animateCounter(target, 0, finalNumber, 2000);
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        const current = Math.floor(start + (range * easeProgress));
        
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Initialize stat counters when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initStatCounters, 500); // Delay to ensure elements are rendered
});

// Loading Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add CSS for loading state
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        body:not(.loaded) {
            overflow: hidden;
        }
        
        body:not(.loaded)::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-bg);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        body:not(.loaded)::after {
            content: 'Loading...';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--accent-green);
            font-size: 1.5rem;
            font-weight: 600;
            z-index: 10001;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(loadingStyles);
});

// Scroll to Top Functionality
function addScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-green);
        color: var(--primary-bg);
        border: none;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(154, 205, 50, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based functionality can be added here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Visitor Tracking System
class VisitorTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageViews = 0;
        this.events = [];
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    init() {
        this.trackPageView();
        this.trackTimeOnSite();
        this.trackScroll();
        this.updateVisitorCounter();
        this.trackUserAgent();
    }
    
    trackPageView() {
        this.pageViews++;
        this.trackEvent('page_view', {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString()
        });
    }
    
    trackEvent(eventName, data = {}) {
        const event = {
            sessionId: this.sessionId,
            eventName,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        this.events.push(event);
        this.saveToLocalStorage();
        
        // Log to console for development (remove in production)
        console.log('Event tracked:', event);
        
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }
    
    trackTimeOnSite() {
        setInterval(() => {
            const timeOnSite = Math.floor((Date.now() - this.startTime) / 1000);
            if (timeOnSite % 30 === 0) { // Track every 30 seconds
                this.trackEvent('time_on_site', { seconds: timeOnSite });
            }
        }, 1000);
    }
    
    trackScroll() {
        let maxScroll = 0;
        const debouncedScrollTracker = debounce(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (scrollPercent >= 25 && scrollPercent < 50) {
                    this.trackEvent('scroll_depth', { percent: 25 });
                } else if (scrollPercent >= 50 && scrollPercent < 75) {
                    this.trackEvent('scroll_depth', { percent: 50 });
                } else if (scrollPercent >= 75 && scrollPercent < 100) {
                    this.trackEvent('scroll_depth', { percent: 75 });
                } else if (scrollPercent >= 100) {
                    this.trackEvent('scroll_depth', { percent: 100 });
                }
            }
        }, 500);
        
        window.addEventListener('scroll', debouncedScrollTracker);
    }
    
    trackUserAgent() {
        const ua = navigator.userAgent;
        const data = {
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.trackEvent('user_info', data);
    }
    
    updateVisitorCounter() {
        // Get or initialize visitor data
        const visitorData = this.getStoredVisitorData();
        
        // Check if this is a new unique visitor (based on longer timeframe)
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // If last visit was more than 24 hours ago, count as new visitor
        if (!visitorData.lastVisit || (now - visitorData.lastVisit) > oneDay) {
            visitorData.totalVisitors += 1;
            visitorData.uniqueVisitors += 1;
        }
        
        // Always increment page views
        visitorData.totalPageViews += 1;
        
        // Update session data
        visitorData.lastVisit = now;
        visitorData.currentSession = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            pageViews: this.pageViews
        };
        
        // Save updated data
        localStorage.setItem('true_visitor_analytics', JSON.stringify(visitorData));
        
        // Update counter display
        const counterElement = document.getElementById('visitorCount');
        if (counterElement) {
            counterElement.textContent = visitorData.totalVisitors;
        }
        
        // Update analytics display if dashboard is open
        this.updateAnalyticsDashboard(visitorData);
    }
    
    getStoredVisitorData() {
        try {
            const stored = localStorage.getItem('true_visitor_analytics');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Could not parse stored visitor data:', e);
        }
        
        // Return default structure for new visitors
        return {
            totalVisitors: 0,
            uniqueVisitors: 0,
            totalPageViews: 0,
            firstVisit: Date.now(),
            lastVisit: null,
            sessions: [],
            topPages: {},
            referrers: {},
            devices: {},
            locations: {}
        };
    }
    
    updateAnalyticsDashboard(visitorData) {
        // Store analytics for dashboard
        const analytics = {
            ...visitorData,
            currentSession: {
                sessionId: this.sessionId,
                startTime: this.startTime,
                duration: Math.floor((Date.now() - this.startTime) / 1000),
                pageViews: this.pageViews,
                events: this.events.length
            },
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screenResolution: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        // Store for dashboard access
        window._visitorAnalytics = analytics;
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem('visitor_data', JSON.stringify({
                sessionId: this.sessionId,
                events: this.events.slice(-50), // Keep only last 50 events
                lastUpdate: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save visitor data to localStorage:', e);
        }
    }
    
    getVisitorStats() {
        return {
            sessionId: this.sessionId,
            pageViews: this.pageViews,
            timeOnSite: Math.floor((Date.now() - this.startTime) / 1000),
            eventsCount: this.events.length,
            lastEvent: this.events[this.events.length - 1]
        };
    }
}

// WhatsApp Integration Functions
function sendToWhatsApp(formData) {
    const phoneNumber = '919579091333'; // Replace with your actual WhatsApp number
    
    let message = `Hi! I'm interested in your services.\n\n`;
    message += `Name: ${formData.name}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Service Needed: ${formData.service}\n`;
    message += `Message: ${formData.message}\n\n`;
    message += `I filled out the contact form on your website and would like to discuss further.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Track WhatsApp click
    trackEvent('whatsapp_contact', {
        service: formData.service,
        method: 'form_integration'
    });
    
    window.open(whatsappUrl, '_blank');
}

function createWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-button');
    if (whatsappBtn) {
        // Update with your actual WhatsApp number
        const phoneNumber = '919579091333';
        const defaultMessage = 'Hi! I found your website and I\'m interested in your digital services. Can we discuss my project?';
        
        whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
        
        whatsappBtn.addEventListener('click', () => {
            trackEvent('whatsapp_contact', {
                method: 'floating_button',
                source: 'website'
            });
        });
    }
}

// Analytics Dashboard (for admin use)
function showVisitorDashboard() {
    const stats = visitorTracker.getVisitorStats();
    const data = JSON.parse(localStorage.getItem('visitor_data') || '{}');
    
    console.group('📊 Visitor Analytics Dashboard');
    console.log('Current Session:', stats);
    console.log('Stored Data:', data);
    console.log('Recent Events:', data.events?.slice(-10) || []);
    console.groupEnd();
    
    return { stats, data };
}

// Global tracking function
function trackEvent(eventName, data = {}) {
    if (window.visitorTracker) {
        window.visitorTracker.trackEvent(eventName, data);
    }
}

// Initialize visitor tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize visitor tracker
    window.visitorTracker = new VisitorTracker();
    
    // Set up WhatsApp button
    createWhatsAppButton();
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.matches('.btn-primary, .btn-secondary, .cta-button')) {
            trackEvent('button_click', {
                buttonText: target.textContent.trim(),
                buttonClass: target.className
            });
        }
        
        if (target.matches('.nav-link')) {
            trackEvent('navigation_click', {
                section: target.getAttribute('href'),
                linkText: target.textContent.trim()
            });
        }
        
        if (target.matches('.service-card, .portfolio-item')) {
            trackEvent('content_interaction', {
                type: target.matches('.service-card') ? 'service' : 'portfolio',
                content: target.querySelector('h3')?.textContent || 'unknown'
            });
        }
    });
});

// Enhanced Analytics Dashboard Functions
function updateAnalyticsDisplay() {
    const analytics = window._visitorAnalytics;
    if (!analytics) return;
    
    // Update live counters
    document.getElementById('visitorCount').textContent = analytics.totalVisitors;
    document.getElementById('pageViewCount').textContent = analytics.totalPageViews;
    
    // Update time on site
    const timeOnSite = Math.floor((Date.now() - analytics.currentSession.startTime) / 1000);
    const minutes = Math.floor(timeOnSite / 60);
    const seconds = timeOnSite % 60;
    document.getElementById('timeOnSite').textContent = `${minutes}m ${seconds}s`;
}

function toggleAnalyticsDashboard() {
    const dashboard = document.getElementById('analyticsDashboard');
    const isVisible = dashboard.style.display !== 'none';
    
    if (isVisible) {
        dashboard.style.display = 'none';
    } else {
        dashboard.style.display = 'block';
        refreshDashboard();
    }
}

function closeAnalyticsDashboard() {
    document.getElementById('analyticsDashboard').style.display = 'none';
}

function refreshDashboard() {
    const analytics = window._visitorAnalytics;
    if (!analytics) return;
    
    // Session Stats
    const sessionStats = document.getElementById('sessionStats');
    if (sessionStats) {
        const sessionDuration = Math.floor((Date.now() - analytics.currentSession.startTime) / 1000);
        sessionStats.innerHTML = `
            <p>Session ID: <span class="stat-highlight">${analytics.currentSession.sessionId}</span></p>
            <p>Duration: <span class="stat-highlight">${Math.floor(sessionDuration/60)}m ${sessionDuration%60}s</span></p>
            <p>Page Views: <span class="stat-highlight">${analytics.currentSession.pageViews}</span></p>
            <p>Events: <span class="stat-highlight">${analytics.currentSession.events}</span></p>
        `;
    }
    
    // Visitor Stats
    const visitorStats = document.getElementById('visitorStats');
    if (visitorStats) {
        visitorStats.innerHTML = `
            <p>Total Visitors: <span class="stat-highlight">${analytics.totalVisitors}</span></p>
            <p>Unique Visitors: <span class="stat-highlight">${analytics.uniqueVisitors}</span></p>
            <p>Total Page Views: <span class="stat-highlight">${analytics.totalPageViews}</span></p>
            <p>First Visit: <span class="stat-highlight">${new Date(analytics.firstVisit).toLocaleDateString()}</span></p>
        `;
    }
    
    // Interaction Stats
    const interactionStats = document.getElementById('interactionStats');
    if (interactionStats && window.visitorTracker) {
        const events = window.visitorTracker.events;
        const buttonClicks = events.filter(e => e.eventName === 'button_click').length;
        const navClicks = events.filter(e => e.eventName === 'navigation_click').length;
        const whatsappClicks = events.filter(e => e.eventName === 'whatsapp_contact').length;
        const formSubmits = events.filter(e => e.eventName === 'contact_form_submit').length;
        
        interactionStats.innerHTML = `
            <p>Button Clicks: <span class="stat-highlight">${buttonClicks}</span></p>
            <p>Navigation: <span class="stat-highlight">${navClicks}</span></p>
            <p>WhatsApp: <span class="stat-highlight">${whatsappClicks}</span></p>
            <p>Form Submits: <span class="stat-highlight">${formSubmits}</span></p>
        `;
    }
    
    // Device Stats
    const deviceStats = document.getElementById('deviceStats');
    if (deviceStats) {
        deviceStats.innerHTML = `
            <p>Platform: <span class="stat-highlight">${analytics.browserInfo.platform}</span></p>
            <p>Language: <span class="stat-highlight">${analytics.browserInfo.language}</span></p>
            <p>Screen: <span class="stat-highlight">${analytics.browserInfo.screenResolution}</span></p>
            <p>Viewport: <span class="stat-highlight">${analytics.browserInfo.viewportSize}</span></p>
        `;
    }
}

function exportAnalytics() {
    const analytics = window._visitorAnalytics;
    const visitorData = JSON.parse(localStorage.getItem('true_visitor_analytics') || '{}');
    const eventData = JSON.parse(localStorage.getItem('visitor_data') || '{}');
    
    const exportData = {
        timestamp: new Date().toISOString(),
        currentAnalytics: analytics,
        storedVisitorData: visitorData,
        eventHistory: eventData,
        summary: {
            totalVisitors: analytics?.totalVisitors || 0,
            totalPageViews: analytics?.totalPageViews || 0,
            sessionDuration: Math.floor((Date.now() - (analytics?.currentSession?.startTime || Date.now())) / 1000),
            eventsTracked: eventData.events?.length || 0
        }
    };
    
    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    trackEvent('analytics_export', {
        totalVisitors: exportData.summary.totalVisitors,
        totalEvents: exportData.summary.eventsTracked
    });
}

function clearAnalytics() {
    if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
        localStorage.removeItem('true_visitor_analytics');
        localStorage.removeItem('visitor_data');
        
        // Reset current session
        if (window.visitorTracker) {
            window.visitorTracker.events = [];
        }
        
        trackEvent('analytics_cleared', { timestamp: new Date().toISOString() });
        
        // Refresh dashboard
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Update analytics display every second
setInterval(updateAnalyticsDisplay, 1000);

// Export functions for console access
window.showVisitorDashboard = showVisitorDashboard;
window.trackEvent = trackEvent;
window.toggleAnalyticsDashboard = toggleAnalyticsDashboard;
window.closeAnalyticsDashboard = closeAnalyticsDashboard;
window.refreshDashboard = refreshDashboard;
window.exportAnalytics = exportAnalytics;
window.clearAnalytics = clearAnalytics;
