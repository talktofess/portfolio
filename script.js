// Portfolio App - Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initAppLanding();
    initNavigation();
    initDownloadDropdown();
    initContactForm();
    initScrollAnimations();
    initWorksGallery();
    initSmoothScrolling();
});

// ----------------------- App Landing Page -----------------------
function initAppLanding() {
    const landingPage = document.getElementById('app-landing');
    const portfolioMain = document.getElementById('portfolio-main');
    const enterButton = document.getElementById('enter-portfolio');

    console.log('Landing page elements:', { landingPage, portfolioMain, enterButton });

    if (!enterButton || !landingPage || !portfolioMain) {
        console.error('Missing landing page elements');
        return;
    }

    enterButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Enter portfolio button clicked');
        
        // Add exit animation to landing page
        landingPage.classList.add('hidden');
        
        // Show portfolio after animation
        setTimeout(() => {
            landingPage.style.display = 'none';
            portfolioMain.style.display = 'block';
            portfolioMain.classList.add('visible');
            console.log('Portfolio main shown');
        }, 500);
    });

    // Also add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            if (landingPage && !landingPage.classList.contains('hidden')) {
                e.preventDefault();
                enterButton.click();
            }
        }
    });

    // Fallback: Show fallback link after 3 seconds if user is still on landing page
    setTimeout(() => {
        if (landingPage && !landingPage.classList.contains('hidden')) {
            const fallbackLink = document.getElementById('enter-portfolio-link');
            if (fallbackLink) {
                fallbackLink.style.display = 'inline-flex';
                console.log('Fallback link shown');
            }
        }
    }, 3000);
}

// ----------------------- Navigation -----------------------
function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Show menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
        });
    }

    // Hide menu
    if (navClose && navMenu) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    }

    // Remove menu when clicking a nav link
    navLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('show');
            });
        }
    });

    // Active section highlighting
    initScrollActive();
}

function initScrollActive() {
    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            if (!section) return;

            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (!sectionId) return;

            const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollActive);
}

// ----------------------- Download Dropdown -----------------------
function initDownloadDropdown() {
    const downloadBtn = document.getElementById('download-btn');
    const dropdown = document.getElementById('download-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (!downloadBtn || !dropdown) return;

    // Toggle dropdown
    downloadBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Handle dropdown item clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const fileType = this.dataset.file;
            downloadDocument(fileType);
            dropdown.classList.remove('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!downloadBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function downloadDocument(fileType) {
    const documents = {
        resume: {
            filename: 'Festus_Karimi_Resume.html',
            url: 'resume.html',
            message: 'Resume downloaded successfully!'
        },
        certificates: {
            filename: 'Festus_Karimi_Certificates.html',
            url: 'certificates.html',
            message: 'Certificates downloaded successfully!'
        },
        portfolio: {
            filename: 'Festus_Karimi_Portfolio_Summary.html',
            url: 'portfolio-summary.html',
            message: 'Portfolio summary downloaded successfully!'
        }
    };

    const doc = documents[fileType];
    if (!doc) return;

    // Create download link
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.filename;
    link.target = '_blank';
    link.click();

    // Show success message
    showNotification(doc.message, 'success');
}

// ----------------------- Contact Form -----------------------
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formMessage = document.getElementById('form-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            project: document.getElementById('contact-project').value,
            message: document.getElementById('contact-message').value
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Send email using EmailJS or your preferred service
            await sendEmail(formData);
            
            // Show success message
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending email:', error);
            showFormMessage('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function setLoadingState(loading) {
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    function validateForm(data) {
        if (!data.name.trim()) {
            showFormMessage('Please enter your name.', 'error');
            return false;
        }
        if (!data.email.trim() || !isValidEmail(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return false;
        }
        if (!data.project.trim()) {
            showFormMessage('Please enter the project type.', 'error');
            return false;
        }
        if (!data.message.trim()) {
            showFormMessage('Please enter your message.', 'error');
            return false;
        }
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

async function sendEmail(formData) {
    // Using EmailJS for email functionality
    // You'll need to set up EmailJS account and get your service ID, template ID, and public key
    
    // For demonstration, we'll simulate the email sending
    // Replace this with actual EmailJS implementation
    
    return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
            // In a real implementation, you would use EmailJS like this:
            /*
            emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    project_type: formData.project,
                    message: formData.message,
                    to_email: 'talktofess@gmail.com'
                },
                'YOUR_PUBLIC_KEY'
            ).then(resolve).catch(reject);
            */
            
            // For now, we'll just resolve to simulate success
            console.log('Email would be sent with data:', formData);
            resolve();
        }, 2000);
    });
}

// ----------------------- Scroll Animations -----------------------
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        observer.observe(card);
        // Stagger animations
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ----------------------- Works Gallery -----------------------
function initWorksGallery() {
    const container = document.getElementById('works-container');
    if (!container) return;

    // Enhanced image data with more projects
    const imageData = [
        // Qwetu Project
        { src: 'img/qwetu (1).jpg', title: 'Property Bidding', href: 'portfolio/bid.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (2).jpg', title: 'Notifications System', href: 'portfolio/notifications.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (3).jpg', title: 'User Dashboard', href: 'portfolio/notifications.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (5).jpg', title: 'File Upload', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (8).jpg', title: 'Message Center', href: 'portfolio/notifications.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (10).jpg', title: 'Document Management', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (11).jpg', title: 'Bidding Interface', href: 'portfolio/bid.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (12).jpg', title: 'Property Details', href: 'portfolio/bid.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (13).jpg', title: 'Media Upload', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (14).jpg', title: 'Image Gallery', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (15).jpg', title: 'File Browser', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (16).jpg', title: 'Upload Progress', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (17).jpg', title: 'Media Library', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (18).jpg', title: 'Content Management', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (19).jpg', title: 'Payment Gateway', href: 'portfolio/payment.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (27).jpg', title: 'Admin Panel', href: 'portfolio/admin.html', category: 'project_qwetu', type: 'Mobile App' },
        { src: 'img/qwetu (35).jpg', title: 'Data Visualization', href: 'portfolio/uploads.html', category: 'project_qwetu', type: 'Mobile App' },
        
        // Duka Project
        { src: 'img/duka_accounttype.jpg', title: 'Account Management', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_cart.jpg', title: 'Shopping Cart', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_login.jpg', title: 'Authentication', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_payment.jpg', title: 'Payment System', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_pick.jpg', title: 'Order Pickup', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_purchase.jpg', title: 'Purchase Flow', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_purchase1.jpg', title: 'Checkout Process', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_search.jpg', title: 'Product Search', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_sellers.jpg', title: 'Seller Dashboard', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_shelf.jpg', title: 'Product Catalog', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },
        { src: 'img/duka_shoppers.jpg', title: 'Customer Interface', href: 'portfolio/duka.html', category: 'project_duka', type: 'E-commerce App' },

        // Backend Projects
        { src: 'img/server (1).png', title: 'Server Architecture', href: 'portfolio/backend.html', category: 'project_server', type: 'Backend' },
        { src: 'img/server (2).png', title: 'API Development', href: 'portfolio/backend.html', category: 'project_server', type: 'Backend' },
        { src: 'img/server (3).png', title: 'Database Design', href: 'portfolio/backend.html', category: 'project_server', type: 'Backend' },

        // Firebase Projects
        { src: 'img/firebase (1).png', title: 'Firebase Authentication', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' },
        { src: 'img/firebase (2).png', title: 'Real-time Database', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' },
        { src: 'img/firebase (3).png', title: 'Cloud Functions', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' },
        { src: 'img/firebase (4).png', title: 'Storage Management', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' },
        { src: 'img/firebase (5).png', title: 'Analytics Dashboard', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' },
        { src: 'img/firebase (6).png', title: 'Performance Monitoring', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' },
        { src: 'img/firebase (7).png', title: 'Security Rules', href: 'portfolio/firebase.html', category: 'project_firebase', type: 'Cloud Services' }
    ];

    createImages();
    initFiltering();

    function createImages() {
        container.innerHTML = '';
        imageData.forEach((item, index) => {
            const imgBlock = document.createElement('div');
            imgBlock.className = `works__img ${item.category}`;
            imgBlock.style.animationDelay = `${index * 0.05}s`;
            imgBlock.innerHTML = `
                <img src="${item.src}" alt="${item.title}" class="works__image" loading="lazy">
                <div class="works__data">
                    <h4 class="works__title">${item.title}</h4>
                    <span class="works__type">${item.type}</span>
                    <a href="${item.href}" class="works__btn inspect-btn" target="_blank">
                        <i class='bx bx-external-link'></i>
                        View Details
                    </a>
                </div>
            `;
            container.appendChild(imgBlock);
        });

        initImageInteractions();
        filterImages('all');
    }

    function initImageInteractions() {
        const worksImages = container.querySelectorAll('.works__img');
        let currentlyExpanded = null;

        worksImages.forEach(img => {
            img.addEventListener('click', function(e) {
                if (e.target.classList.contains('works__btn')) return;
                
                if (this === currentlyExpanded) {
                    this.classList.remove('expanded');
                    currentlyExpanded = null;
                    return;
                }
                
                if (currentlyExpanded) {
                    currentlyExpanded.classList.remove('expanded');
                }
                
                this.classList.add('expanded');
                currentlyExpanded = this;
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

    function initFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const category = this.dataset.filter;
                
                // Handle main category buttons (mobile, web, cloud, data)
                if (['mobile', 'web', 'cloud', 'data'].includes(category)) {
                    toggleSubFilters(category);
                    filterImages(category);
                } else {
                    // Handle specific project filters
                    filterImages(category);
                }
            });
        });

        // Close sub-filters when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.filter-group')) {
                closeAllSubFilters();
            }
        });
    }

    function toggleSubFilters(category) {
        // Close all other sub-filters
        closeAllSubFilters();
        
        // Toggle the clicked category's sub-filters
        const subFilters = document.querySelector(`.${category}-filters`);
        if (subFilters) {
            subFilters.classList.toggle('show');
        }
    }

    function closeAllSubFilters() {
        const allSubFilters = document.querySelectorAll('.sub-filters');
        allSubFilters.forEach(subFilter => {
            subFilter.classList.remove('show');
        });
    }

    function filterImages(category) {
        const images = container.querySelectorAll('.works__img');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Filter images based on category
        images.forEach(img => {
            if (category === 'all') {
                img.style.display = 'block';
            } else if (category === 'mobile') {
                img.style.display = img.classList.contains('project_qwetu') || 
                                   img.classList.contains('project_duka') || 
                                   img.classList.contains('project_react_native') ? 'block' : 'none';
            } else if (category === 'web') {
                img.style.display = img.classList.contains('project_web') || 
                                   img.classList.contains('project_ecommerce') || 
                                   img.classList.contains('project_dashboard') ? 'block' : 'none';
            } else if (category === 'cloud') {
                img.style.display = img.classList.contains('project_server') || 
                                   img.classList.contains('project_firebase') || 
                                   img.classList.contains('project_aws') ? 'block' : 'none';
            } else if (category === 'data') {
                img.style.display = img.classList.contains('project_analysis') || 
                                   img.classList.contains('project_visualization') || 
                                   img.classList.contains('project_ml') ? 'block' : 'none';
            } else {
                img.style.display = img.classList.contains(category) ? 'block' : 'none';
            }
        });

        // Remove expanded state
        const expanded = container.querySelector('.works__img.expanded');
        if (expanded) expanded.classList.remove('expanded');
    }
}

// ----------------------- Smooth Scrolling -----------------------
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ----------------------- Utility Functions -----------------------
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class='bx bx-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}'></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ----------------------- Lazy Loading -----------------------
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// ----------------------- Performance Optimizations -----------------------
// Debounce function for scroll events
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

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize performance optimizations
window.addEventListener('scroll', debounce(initScrollActive, 100));
window.addEventListener('resize', throttle(() => {
    // Handle resize events
}, 250));

// ----------------------- Error Handling -----------------------
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send error reports to a logging service here
});

// ----------------------- Global Functions -----------------------
function enterPortfolio() {
    console.log('enterPortfolio function called');
    const landingPage = document.getElementById('app-landing');
    const portfolioMain = document.getElementById('portfolio-main');
    
    if (!landingPage || !portfolioMain) {
        console.error('Missing elements for portfolio transition');
        return;
    }
    
    // Add exit animation to landing page
    landingPage.classList.add('hidden');
    
    // Show portfolio after animation
    setTimeout(() => {
        landingPage.style.display = 'none';
        portfolioMain.style.display = 'block';
        portfolioMain.classList.add('visible');
        console.log('Portfolio main shown via global function');
    }, 500);
}

// ----------------------- Export functions for external use -----------------------
window.PortfolioApp = {
    showNotification,
    downloadDocument,
    sendEmail,
    enterPortfolio
};