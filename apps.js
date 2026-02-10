// ====================================================
// YOUTH ADVOCATES NETWORK (YAN) - MAIN APPLICATION
// ====================================================
// This file handles all frontend logic including:
// - Authentication (simulated)
// - Navigation
// - Role-based rendering
// - Form handling
// - Data management via localStorage
// - Gallery interactions
// ====================================================

// ====================================================
// GLOBAL STATE & DATA STRUCTURES
// ====================================================

// Simulated user database
const USERS_DB = {
    admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    member: { username: 'member', password: 'member123', role: 'member', name: 'John Doe' },
    applicant: { username: 'applicant', password: 'applicant123', role: 'applicant', name: 'Jane Smith' }
};

// Gallery images
const GALLERY_IMAGES = [
    {
        title: 'YAN Logo',
        description: 'Youth Advocates Network logo',
        url: 'https://pbs.twimg.com/profile_images/1708766292289748992/XF_JMfRL_400x400.jpg',
        alt: 'Youth Advocates Network logo'
    },
    {
        title: 'UNICEF Rwanda',
        description: 'UNICEF Rwanda program activity',
        url: 'https://www.unicef.org/rwanda/sites/unicef.org.rwanda/files/styles/large/public/576A7795.jpg.webp?itok=4OMf9Gxi',
        alt: 'UNICEF Rwanda program activity'
    },
    {
        title: 'Youth Advocacy Event',
        description: 'Youth advocates in action',
        url: 'https://pbs.twimg.com/media/GfFrE4JXUAALcZX.jpg',
        alt: 'Youth advocates participating in an event'
    }
];

// Sample opportunities data
const OPPORTUNITIES_DATA = [
    {
        id: 1,
        title: 'Youth Innovation Grant 2026',
        type: 'funding',
        description: 'Up to $10,000 for innovative youth-led projects addressing community challenges.',
        deadline: '2026-03-15',
        organization: 'Rwanda Innovation Fund',
        details: 'Full details about the grant...'
    },
    {
        id: 2,
        title: 'Digital Skills Bootcamp',
        type: 'training',
        description: 'Free 6-week intensive training on web development, digital marketing, and design.',
        deadline: '2026-02-25',
        organization: 'Tech Academy Rwanda',
        details: 'Full details about the bootcamp...'
    },
    // Add more opportunities as needed
];

// Sample events data
const EVENTS_DATA = [
    {
        id: 1,
        title: 'Monthly Networking Meetup',
        date: '2026-02-15',
        time: '14:00',
        location: 'Kigali Innovation Hub',
        description: 'Connect with fellow youth advocates',
        type: 'networking'
    },
    {
        id: 2,
        title: 'Proposal Writing Workshop',
        date: '2026-02-22',
        time: '10:00',
        location: 'Online (Zoom)',
        description: 'Learn to write winning project proposals',
        type: 'training'
    },
    // Add more events as needed
];

// Sample resources data
const RESOURCES_DATA = [
    {
        id: 1,
        title: 'Project Management Guide',
        category: 'Documentation',
        type: 'PDF',
        size: '2.5 MB',
        description: 'Comprehensive guide to managing youth-led projects',
        uploadDate: '2026-01-15'
    },
    {
        id: 2,
        title: 'Fundraising Toolkit',
        category: 'Tools',
        type: 'PDF',
        size: '1.8 MB',
        description: 'Templates and strategies for successful fundraising',
        uploadDate: '2026-01-20'
    },
    // Add more resources as needed
];

// ====================================================
// UTILITY FUNCTIONS
// ====================================================

// Initialize localStorage with sample data if not exists
function initializeLocalStorage() {
    if (!localStorage.getItem('yan_applications')) {
        localStorage.setItem('yan_applications', JSON.stringify([]));
    }
    if (!localStorage.getItem('yan_opportunities')) {
        localStorage.setItem('yan_opportunities', JSON.stringify(OPPORTUNITIES_DATA));
    }
    if (!localStorage.getItem('yan_events')) {
        localStorage.setItem('yan_events', JSON.stringify(EVENTS_DATA));
    }
    if (!localStorage.getItem('yan_resources')) {
        localStorage.setItem('yan_resources', JSON.stringify(RESOURCES_DATA));
    }
}

// Get current logged-in user
function getCurrentUser() {
    const userStr = localStorage.getItem('yan_current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('yan_current_user', JSON.stringify(user));
}

// Logout user
function logout() {
    localStorage.removeItem('yan_current_user');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ====================================================
// NAVIGATION & MOBILE MENU
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#home') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    if (navMenu) navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        initializeLandingPage();
    } else if (currentPage === 'dashboard.html') {
        initializeDashboard();
    } else if (currentPage === 'applications.html') {
        initializeApplicationsPage();
    } else if (currentPage === 'resources.html') {
        initializeResourcesPage();
    } else if (currentPage === 'opportunities.html') {
        initializeOpportunitiesPage();
    } else if (currentPage === 'events.html') {
        initializeEventsPage();
    }
});

// ====================================================
// LANDING PAGE FUNCTIONALITY
// ====================================================

function initializeLandingPage() {
    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const loginForm = document.getElementById('loginForm');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
        });
    }
    
    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Application modal
    const applyBtn = document.getElementById('applyBtn');
    const applyModal = document.getElementById('applyModal');
    const closeApply = document.getElementById('closeApply');
    const showApplyModal = document.getElementById('showApplyModal');
    const applicationForm = document.getElementById('applicationForm');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyModal.classList.add('active');
        });
    }
    
    if (showApplyModal) {
        showApplyModal.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            applyModal.classList.add('active');
        });
    }
    
    if (closeApply) {
        closeApply.addEventListener('click', () => {
            applyModal.classList.remove('active');
        });
    }
    
    // Handle application form submission
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmit);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === applyModal) {
            applyModal.classList.remove('active');
        }
    });
    
    // Initialize gallery
    initializeGallery();
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showAlert('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
    
    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showAlert('Successfully subscribed to our newsletter!', 'success');
            form.reset();
        });
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    // Simulate authentication
    const user = USERS_DB[role];
    
    if (user && user.username === username && user.password === password) {
        setCurrentUser(user);
        
        // Redirect based on role
        if (role === 'admin' || role === 'member') {
            window.location.href = 'dashboard.html';
        } else if (role === 'applicant') {
            window.location.href = 'applications.html';
        }
    } else {
        showAlert('Invalid credentials. Please try again.', 'error');
    }
}

// Handle application submission
function handleApplicationSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const application = {
        id: generateId(),
        fullName: document.getElementById('appFullName').value,
        email: document.getElementById('appEmail').value,
        phone: document.getElementById('appPhone').value,
        dob: document.getElementById('appDOB').value,
        gender: document.getElementById('appGender').value,
        orgName: document.getElementById('appOrgName').value,
        role: document.getElementById('appRole').value,
        orgType: document.getElementById('appOrgType').value,
        focusAreas: Array.from(document.querySelectorAll('input[name="focusAreas"]:checked'))
            .map(cb => cb.value),
        motivation: document.getElementById('appMotivation').value,
        impact: document.getElementById('appImpact').value,
        contribution: document.getElementById('appContribution').value,
        status: 'pending',
        submittedDate: new Date().toISOString(),
    };
    
    // Save to localStorage
    const applications = JSON.parse(localStorage.getItem('yan_applications')) || [];
    applications.push(application);
    localStorage.setItem('yan_applications', JSON.stringify(applications));
    
    // Close modal and show success message
    document.getElementById('applyModal').classList.remove('active');
    showAlert('Application submitted successfully! We will review it and get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
    resetApplicationSteps();
}

// Multi-step form navigation
let currentStep = 1;

function nextStep(step) {
    // Validate current step before proceeding
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show next step
    currentStep = step;
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
}

function prevStep(step) {
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep = step;
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
}

function resetApplicationSteps() {
    currentStep = 1;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.form-step[data-step="1"]').classList.add('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');
}

// Make functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;

// ====================================================
// GALLERY FUNCTIONALITY
// ====================================================

function initializeGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightbox = document.getElementById('closeLightbox');
    
    if (!galleryGrid) return;
    
    // Generate gallery items
    GALLERY_IMAGES.forEach((image) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${image.url}" alt="${image.alt}" loading="lazy">
            <div class="gallery-overlay">
                <p>${image.title}</p>
            </div>
        `;
        item.addEventListener('click', () => {
            openLightbox(image);
        });
        galleryGrid.appendChild(item);
    });
    
    // Lightbox functionality
    function openLightbox(image) {
        if (lightboxImage) {
            lightboxImage.src = image.url;
            lightboxImage.alt = image.alt || image.title;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = image.description || image.title;
        }
        if (lightboxModal) {
            lightboxModal.classList.add('active');
        }
    }
    
    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });
}

// ====================================================
// DASHBOARD FUNCTIONALITY
// ====================================================

function initializeDashboard() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // Render dashboard based on role
    if (user.role === 'admin') {
        renderAdminDashboard(user);
    } else if (user.role === 'member') {
        renderMemberDashboard(user);
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function renderAdminDashboard(user) {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = 'Administrator';
    
    if (!dashboardContent) return;
    
    const applications = JSON.parse(localStorage.getItem('yan_applications')) || [];
    const pendingCount = applications.filter(app => app.status === 'pending').length;
    const approvedCount = applications.filter(app => app.status === 'approved').length;
    
    dashboardContent.innerHTML = `
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Total Applications</h3>
                <div class="metric-value">${applications.length}</div>
                <p>All time submissions</p>
            </div>
            <div class="metric-card warning">
                <h3>Pending Reviews</h3>
                <div class="metric-value">${pendingCount}</div>
                <p>Awaiting decision</p>
            </div>
            <div class="metric-card success">
                <h3>Approved Members</h3>
                <div class="metric-value">${approvedCount}</div>
                <p>Active members</p>
            </div>
            <div class="metric-card primary">
                <h3>Active Projects</h3>
                <div class="metric-value">24</div>
                <p>Ongoing initiatives</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Recent Applications</h2>
                <a href="applications.html" class="btn btn-primary btn-sm">View All</a>
            </div>
            <div class="card-body">
                ${renderApplicationsTable(applications.slice(0, 5))}
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Quick Actions</h2>
            </div>
            <div class="card-body">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="applications.html" class="btn btn-primary">Review Applications</a>
                    <a href="events.html" class="btn btn-primary">Manage Events</a>
                    <a href="opportunities.html" class="btn btn-primary">Post Opportunity</a>
                    <a href="resources.html" class="btn btn-primary">Upload Resource</a>
                </div>
            </div>
        </div>
    `;
}

function renderMemberDashboard(user) {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = 'Member';
    
    if (!dashboardContent) return;
    
    dashboardContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Welcome back, ${user.name}!</h2>
            </div>
            <div class="card-body">
                <p>Your membership is active. Explore resources, opportunities, and events below.</p>
            </div>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card primary">
                <h3>My Projects</h3>
                <div class="metric-value">3</div>
                <p>Active projects</p>
            </div>
            <div class="metric-card success">
                <h3>Resources Accessed</h3>
                <div class="metric-value">12</div>
                <p>This month</p>
            </div>
            <div class="metric-card">
                <h3>Events Attended</h3>
                <div class="metric-value">5</div>
                <p>This year</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Recent Notifications</h2>
            </div>
            <div class="card-body">
                <div class="notification-item unread">
                    <div class="notification-title">New Training Opportunity Available</div>
                    <p>Digital Skills Bootcamp registration is now open</p>
                    <div class="notification-time">2 hours ago</div>
                </div>
                <div class="notification-item">
                    <div class="notification-title">Event Reminder</div>
                    <p>Monthly Networking Meetup tomorrow at 2:00 PM</p>
                    <div class="notification-time">1 day ago</div>
                </div>
                <div class="notification-item">
                    <div class="notification-title">New Resource Added</div>
                    <p>Fundraising Toolkit now available in Resources section</p>
                    <div class="notification-time">3 days ago</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Quick Links</h2>
            </div>
            <div class="card-body">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="resources.html" class="btn btn-primary">Browse Resources</a>
                    <a href="opportunities.html" class="btn btn-primary">View Opportunities</a>
                    <a href="events.html" class="btn btn-primary">Upcoming Events</a>
                </div>
            </div>
        </div>
    `;
}

function renderApplicationsTable(applications) {
    if (applications.length === 0) {
        return '<p>No applications found.</p>';
    }
    
    return `
        <div class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Applicant Name</th>
                        <th>Organization</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${applications.map(app => `
                        <tr>
                            <td>${app.fullName}</td>
                            <td>${app.orgName}</td>
                            <td>${app.email}</td>
                            <td><span class="status-badge ${app.status}">${app.status}</span></td>
                            <td>${formatDate(app.submittedDate)}</td>
                            <td class="table-actions">
                                <button class="btn btn-primary btn-sm" onclick="viewApplication('${app.id}')">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ====================================================
// APPLICATIONS PAGE
// ====================================================

function initializeApplicationsPage() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const applicationsContainer = document.getElementById('applicationsContainer');
    const applications = JSON.parse(localStorage.getItem('yan_applications')) || [];
    
    if (user.role === 'admin') {
        renderAdminApplicationsView(applicationsContainer, applications);
    } else if (user.role === 'applicant') {
        renderApplicantView(applicationsContainer, applications, user);
    }
}

function renderAdminApplicationsView(container, applications) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="filters-bar">
            <div class="search-box">
                <input type="text" id="searchApplications" placeholder="Search applications...">
            </div>
            <select class="filter-select" id="filterStatus">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
        
        ${renderApplicationsTable(applications)}
    `;
    
    // Add filter functionality
    const searchInput = document.getElementById('searchApplications');
    const statusFilter = document.getElementById('filterStatus');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => filterApplications(applications));
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => filterApplications(applications));
    }
}

function renderApplicantView(container, applications, user) {
    if (!container) return;
    
    // Find user's application (simulated - would match by email in real scenario)
    const userApp = applications.find(app => app.email === user.username + '@example.com') || applications[0];
    
    if (!userApp) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p>You haven't submitted an application yet.</p>
                    <a href="index.html#apply" class="btn btn-primary">Apply Now</a>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Your Application Status</h2>
            </div>
            <div class="card-body">
                <div style="margin-bottom: 2rem;">
                    <h3>Current Status: <span class="status-badge ${userApp.status}">${userApp.status}</span></h3>
                    <p>Submitted on: ${formatDate(userApp.submittedDate)}</p>
                </div>
                
                <h3>Application Details</h3>
                <div style="margin-top: 1rem;">
                    <p><strong>Full Name:</strong> ${userApp.fullName}</p>
                    <p><strong>Email:</strong> ${userApp.email}</p>
                    <p><strong>Phone:</strong> ${userApp.phone}</p>
                    <p><strong>Organization:</strong> ${userApp.orgName}</p>
                    <p><strong>Role:</strong> ${userApp.role}</p>
                    <p><strong>Organization Type:</strong> ${userApp.orgType}</p>
                    <p><strong>Focus Areas:</strong> ${userApp.focusAreas.join(', ')}</p>
                </div>
                
                ${userApp.status === 'pending' ? `
                    <div class="alert alert-info" style="margin-top: 2rem;">
                        Your application is being reviewed. We'll notify you once a decision is made.
                    </div>
                ` : ''}
                
                ${userApp.status === 'approved' ? `
                    <div class="alert alert-success" style="margin-top: 2rem;">
                        Congratulations! Your application has been approved. Welcome to YAN!
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function filterApplications(applications) {
    const searchTerm = document.getElementById('searchApplications').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    
    let filtered = applications.filter(app => {
        const matchesSearch = app.fullName.toLowerCase().includes(searchTerm) || 
                            app.orgName.toLowerCase().includes(searchTerm) ||
                            app.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tableContainer = document.querySelector('.data-table-container');
    if (tableContainer) {
        tableContainer.outerHTML = renderApplicationsTable(filtered);
    }
}

function viewApplication(id) {
    const applications = JSON.parse(localStorage.getItem('yan_applications')) || [];
    const app = applications.find(a => a.id === id);
    
    if (!app) return;
    
    const user = getCurrentUser();
    
    // Create modal for viewing application details
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Application Details</h2>
            
            <div style="margin-top: 2rem;">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> ${app.fullName}</p>
                <p><strong>Email:</strong> ${app.email}</p>
                <p><strong>Phone:</strong> ${app.phone}</p>
                <p><strong>Date of Birth:</strong> ${app.dob}</p>
                <p><strong>Gender:</strong> ${app.gender}</p>
            </div>
            
            <div style="margin-top: 2rem;">
                <h3>Organization Information</h3>
                <p><strong>Organization:</strong> ${app.orgName}</p>
                <p><strong>Role:</strong> ${app.role}</p>
                <p><strong>Organization Type:</strong> ${app.orgType}</p>
                <p><strong>Focus Areas:</strong> ${app.focusAreas.join(', ')}</p>
            </div>
            
            <div style="margin-top: 2rem;">
                <h3>Motivation & Experience</h3>
                <p><strong>Why join YAN:</strong></p>
                <p>${app.motivation}</p>
                <p><strong>Organization Impact:</strong></p>
                <p>${app.impact}</p>
                <p><strong>Contribution to Network:</strong></p>
                <p>${app.contribution}</p>
            </div>
            
            <div style="margin-top: 2rem;">
                <p><strong>Status:</strong> <span class="status-badge ${app.status}">${app.status}</span></p>
                <p><strong>Submitted:</strong> ${formatDate(app.submittedDate)}</p>
            </div>
            
            ${user.role === 'admin' ? `
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="updateApplicationStatus('${app.id}', 'approved')">Approve</button>
                    <button class="btn btn-secondary" onclick="updateApplicationStatus('${app.id}', 'under-review')">Mark Under Review</button>
                    <button class="btn" style="background-color: var(--danger-color); color: white;" onclick="updateApplicationStatus('${app.id}', 'rejected')">Reject</button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function updateApplicationStatus(id, status) {
    const applications = JSON.parse(localStorage.getItem('yan_applications')) || [];
    const appIndex = applications.findIndex(a => a.id === id);
    
    if (appIndex !== -1) {
        applications[appIndex].status = status;
        localStorage.setItem('yan_applications', JSON.stringify(applications));
        showAlert(`Application ${status} successfully!`, 'success');
        
        // Close modal and refresh
        document.querySelector('.modal').remove();
        location.reload();
    }
}

// Make functions globally available
window.viewApplication = viewApplication;
window.updateApplicationStatus = updateApplicationStatus;

// ====================================================
// RESOURCES PAGE
// ====================================================

function initializeResourcesPage() {
    const resourcesContainer = document.getElementById('resourcesContainer');
    const resources = JSON.parse(localStorage.getItem('yan_resources')) || RESOURCES_DATA;
    
    if (!resourcesContainer) return;
    
    resourcesContainer.innerHTML = `
        <div class="filters-bar">
            <div class="search-box">
                <input type="text" id="searchResources" placeholder="Search resources...">
            </div>
            <select class="filter-select" id="filterCategory">
                <option value="">All Categories</option>
                <option value="Documentation">Documentation</option>
                <option value="Tools">Tools</option>
                <option value="Templates">Templates</option>
                <option value="Guides">Guides</option>
            </select>
        </div>
        
        <div class="resource-grid" id="resourceGrid">
            ${renderResources(resources)}
        </div>
    `;
    
    // Add filter functionality
    const searchInput = document.getElementById('searchResources');
    const categoryFilter = document.getElementById('filterCategory');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => filterResources(resources));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => filterResources(resources));
    }
}

function renderResources(resources) {
    return resources.map(resource => `
        <div class="resource-card">
            <div class="resource-icon">📄</div>
            <div class="resource-content">
                <span class="resource-category">${resource.category}</span>
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <div class="resource-meta">
                    <span>${resource.type} • ${resource.size}</span>
                    <span>Uploaded: ${formatDate(resource.uploadDate)}</span>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewResource(${resource.id})">View</button>
                    <button class="btn btn-secondary btn-sm" onclick="downloadResource(${resource.id})">Download</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterResources(resources) {
    const searchTerm = document.getElementById('searchResources').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    
    let filtered = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm) || 
                            resource.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || resource.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const resourceGrid = document.getElementById('resourceGrid');
    if (resourceGrid) {
        resourceGrid.innerHTML = renderResources(filtered);
    }
}

function viewResource(id) {
    const resources = JSON.parse(localStorage.getItem('yan_resources')) || RESOURCES_DATA;
    const resource = resources.find(r => r.id === id);
    
    if (!resource) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>${resource.title}</h2>
            <p style="margin-top: 1rem;">${resource.description}</p>
            <div style="margin-top: 1.5rem;">
                <p><strong>Category:</strong> ${resource.category}</p>
                <p><strong>Type:</strong> ${resource.type}</p>
                <p><strong>Size:</strong> ${resource.size}</p>
                <p><strong>Uploaded:</strong> ${formatDate(resource.uploadDate)}</p>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="downloadResource(${resource.id})">Download</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function downloadResource(id) {
    const resources = JSON.parse(localStorage.getItem('yan_resources')) || RESOURCES_DATA;
    const resource = resources.find(r => r.id === id);
    
    if (!resource) return;
    
    showAlert(`Download started for: ${resource.title}`, 'success');
}

// Make functions globally available
window.viewResource = viewResource;
window.downloadResource = downloadResource;

// ====================================================
// OPPORTUNITIES PAGE
// ====================================================

function initializeOpportunitiesPage() {
    const opportunities = JSON.parse(localStorage.getItem('yan_opportunities')) || OPPORTUNITIES_DATA;
    const container = document.getElementById('opportunitiesContainer') || document.querySelector('.opportunities-grid');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="filters-bar">
            <div class="search-box">
                <input type="text" id="searchOpportunities" placeholder="Search opportunities...">
            </div>
            <select class="filter-select" id="filterOpportunityType">
                <option value="">All Types</option>
                <option value="funding">Funding</option>
                <option value="training">Training</option>
                <option value="partnership">Partnership</option>
            </select>
        </div>
        <div class="opportunity-grid" id="opportunityGrid">
            ${renderOpportunities(opportunities)}
        </div>
    `;
    
    const searchInput = document.getElementById('searchOpportunities');
    const typeFilter = document.getElementById('filterOpportunityType');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => filterOpportunities(opportunities));
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', () => filterOpportunities(opportunities));
    }
}

function renderOpportunities(opportunities) {
    if (!opportunities.length) {
        return '<p>No opportunities available at the moment.</p>';
    }
    
    return opportunities.map(opportunity => `
        <div class="opportunity-card">
            <span class="opportunity-badge ${opportunity.type}">${capitalizeFirst(opportunity.type)}</span>
            <h3>${opportunity.title}</h3>
            <p>${opportunity.description}</p>
            <div class="opportunity-footer">
                <span class="deadline">Deadline: ${formatDate(opportunity.deadline)}</span>
                <div class="opportunity-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewOpportunity(${opportunity.id})">View</button>
                    <button class="btn btn-secondary btn-sm" onclick="applyOpportunity(${opportunity.id})">Apply</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterOpportunities(opportunities) {
    const searchTerm = document.getElementById('searchOpportunities').value.toLowerCase();
    const typeFilter = document.getElementById('filterOpportunityType').value;
    
    let filtered = opportunities.filter(opportunity => {
        const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm) ||
                            opportunity.description.toLowerCase().includes(searchTerm) ||
                            opportunity.organization.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || opportunity.type === typeFilter;
        return matchesSearch && matchesType;
    });
    
    const opportunityGrid = document.getElementById('opportunityGrid');
    if (opportunityGrid) {
        opportunityGrid.innerHTML = renderOpportunities(filtered);
    }
}

function viewOpportunity(id) {
    const opportunities = JSON.parse(localStorage.getItem('yan_opportunities')) || OPPORTUNITIES_DATA;
    const opportunity = opportunities.find(o => o.id === id);
    
    if (!opportunity) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>${opportunity.title}</h2>
            <p style="margin-top: 1rem;">${opportunity.description}</p>
            <div style="margin-top: 1.5rem;">
                <p><strong>Organization:</strong> ${opportunity.organization}</p>
                <p><strong>Type:</strong> ${capitalizeFirst(opportunity.type)}</p>
                <p><strong>Deadline:</strong> ${formatDate(opportunity.deadline)}</p>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="applyOpportunity(${opportunity.id})">Apply</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function applyOpportunity(id) {
    const opportunities = JSON.parse(localStorage.getItem('yan_opportunities')) || OPPORTUNITIES_DATA;
    const opportunity = opportunities.find(o => o.id === id);
    
    if (!opportunity) return;
    
    showAlert(`Application submitted for: ${opportunity.title}`, 'success');
}

window.viewOpportunity = viewOpportunity;
window.applyOpportunity = applyOpportunity;

// ====================================================
// EVENTS PAGE
// ====================================================

function initializeEventsPage() {
    const events = JSON.parse(localStorage.getItem('yan_events')) || EVENTS_DATA;
    const container = document.getElementById('eventsContainer') || document.querySelector('.events-grid');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="filters-bar">
            <div class="search-box">
                <input type="text" id="searchEvents" placeholder="Search events...">
            </div>
            <select class="filter-select" id="filterEventType">
                <option value="">All Types</option>
                <option value="networking">Networking</option>
                <option value="training">Training</option>
                <option value="workshop">Workshop</option>
            </select>
        </div>
        <div class="event-grid" id="eventGrid">
            ${renderEvents(events)}
        </div>
    `;
    
    const searchInput = document.getElementById('searchEvents');
    const typeFilter = document.getElementById('filterEventType');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => filterEvents(events));
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', () => filterEvents(events));
    }
}

function renderEvents(events) {
    if (!events.length) {
        return '<p>No events scheduled at the moment.</p>';
    }
    
    return events.map(event => {
        const eventDate = new Date(event.date);
        const day = String(eventDate.getDate()).padStart(2, '0');
        const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        
        return `
            <div class="event-card">
                <div class="event-date">
                    <span class="date-day">${day}</span>
                    <span class="date-month">${month}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p class="event-location">📍 ${event.location}</p>
                    <p class="event-time">⏰ ${event.time}</p>
                    <div class="event-actions" style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary btn-sm" onclick="viewEvent(${event.id})">View</button>
                        <button class="btn btn-secondary btn-sm" onclick="registerEvent(${event.id})">Register</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterEvents(events) {
    const searchTerm = document.getElementById('searchEvents').value.toLowerCase();
    const typeFilter = document.getElementById('filterEventType').value;
    
    let filtered = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                            event.description.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || event.type === typeFilter;
        return matchesSearch && matchesType;
    });
    
    const eventGrid = document.getElementById('eventGrid');
    if (eventGrid) {
        eventGrid.innerHTML = renderEvents(filtered);
    }
}

function viewEvent(id) {
    const events = JSON.parse(localStorage.getItem('yan_events')) || EVENTS_DATA;
    const event = events.find(e => e.id === id);
    
    if (!event) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>${event.title}</h2>
            <p style="margin-top: 1rem;">${event.description}</p>
            <div style="margin-top: 1.5rem;">
                <p><strong>Date:</strong> ${formatDate(event.date)}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Type:</strong> ${capitalizeFirst(event.type)}</p>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="registerEvent(${event.id})">Register</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function registerEvent(id) {
    const events = JSON.parse(localStorage.getItem('yan_events')) || EVENTS_DATA;
    const event = events.find(e => e.id === id);
    
    if (!event) return;
    
    showAlert(`Registered for: ${event.title}`, 'success');
}

window.viewEvent = viewEvent;
window.registerEvent = registerEvent;