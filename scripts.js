// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const scrollTop = document.querySelector('.scroll-top');
const bookingForm = document.getElementById('booking-form');
const bookingConfirmation = document.getElementById('booking-confirmation');
const closeConfirmation = document.getElementById('close-confirmation');
const navLinks = document.querySelectorAll('.nav-menu li a');
const serviceSelect = document.getElementById('service');
const dateInput = document.getElementById('date');

// Check if device is touch-enabled
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Add touch-device class if needed
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// Add mobile menu functionality
if (menuToggle) {
    // Create close menu button if it doesn't exist
    let closeMenu = document.querySelector('.close-menu');
    if (!closeMenu) {
        closeMenu = document.createElement('div');
        closeMenu.classList.add('close-menu');
        closeMenu.innerHTML = '<i class="fas fa-times"></i>';
        navMenu.appendChild(closeMenu);
    }

    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open'); // Add class to prevent body scrolling
    });

    // Close menu
    closeMenu.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== menuToggle) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Scroll event for header and scroll-to-top button
window.addEventListener('scroll', () => {
    // Header background on scroll
    if (window.scrollY > 50) { // Reduced threshold for mobile
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll-to-top button
    if (window.scrollY > 300) { // Reduced threshold for mobile
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});

// Check orientation and add portrait-mode class if needed
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        document.body.classList.add('portrait-mode');
    } else {
        document.body.classList.remove('portrait-mode');
    }
}

// Check orientation on page load, resize and orientation change
window.addEventListener('DOMContentLoaded', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Handle map overlay for touch devices
const mapPlaceholder = document.querySelector('.map-placeholder');
if (mapPlaceholder && isTouchDevice()) {
    const mapOverlay = mapPlaceholder.querySelector('.map-overlay');
    if (mapOverlay) {
        mapOverlay.style.opacity = '1';
        mapOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }
}

// Form validation helpers
function validateForm(form) {
    if (!form) return true;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markInvalid(field, 'This field is required');
            isValid = false;
        } else {
            markValid(field);
        }
    });
    
    // Validate email if present
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
        markInvalid(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function markInvalid(field, message) {
    field.classList.add('invalid');
    
    let errorMsg = field.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        field.parentNode.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
}

function markValid(field) {
    field.classList.remove('invalid');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Handle booking form submission if it exists
if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        
        if (validateForm(bookingForm)) {
            // Show confirmation
            if (bookingConfirmation) {
                bookingConfirmation.classList.add('active');
            }
            
            // Reset form
            bookingForm.reset();
        }
    });
    
    // Close confirmation modal
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', () => {
            bookingConfirmation.classList.remove('active');
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate header height dynamically
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight - 20, // Dynamic offset
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation based on scroll position
function setActiveNav() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const headerHeight = document.querySelector('header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// Initialize the active nav on page load
window.addEventListener('load', setActiveNav);

// Ensure proper menu behavior on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Gallery image hover effect with animation
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    // For touch devices, add click handler to show overlay
    item.addEventListener('click', () => {
        // Only toggle for touch devices to prevent double effects
        if (isTouchDevice()) {
            item.classList.toggle('touch-hover');
        }
    });
    
    // For non-touch devices, keep hover behavior
    item.addEventListener('mouseenter', () => {
        item.classList.add('hover');
    });
    
    item.addEventListener('mouseleave', () => {
        item.classList.remove('hover');
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.dataset.src && img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
        lazyLoad();
    }
});

// Section visibility animation
function animateSections() {
    const sections = document.querySelectorAll('section');
    
    const fadeOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeOptions);
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        fadeObserver.observe(section);
    });
}

// Initialize animations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    animateSections();
});

// Service price highlight effect
const serviceItems = document.querySelectorAll('.service-list li');
serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const price = item.querySelector('.service-price');
        if (price) {
            price.classList.add('highlight');
        }
    });
    
    item.addEventListener('mouseleave', () => {
        const price = item.querySelector('.service-price');
        if (price) {
            price.classList.remove('highlight');
        }
    });
});

// Video handling for mobile devices
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('shop-video');
    const videoContainer = document.querySelector('.about-image');
    const playButton = document.getElementById('video-play-btn');
    const videoControls = document.querySelector('.video-controls');
    
    if (video && playButton) {
        // Check if video is supported
        const isVideoSupported = !!document.createElement('video').canPlayType;
        
        // Check if this is a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check if autoplay is supported
        let isAutoplaySupported = false;
        
        // Function to handle video playing
        function handleVideoPlaying() {
            videoContainer.classList.remove('video-paused');
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            isAutoplaySupported = true;
            videoControls.classList.remove('show-play-button');
        }
        
        // Function to handle video paused
        function handleVideoPaused() {
            videoContainer.classList.add('video-paused');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            if (isMobile) {
                videoControls.classList.add('show-play-button');
            }
        }
        
        // Autoplay detection - if video starts playing, autoplay is supported
        video.addEventListener('playing', handleVideoPlaying);
        
        // If video is paused
        video.addEventListener('pause', handleVideoPaused);
        
        // If video fails to play automatically
        video.addEventListener('suspend', function() {
            if (!video.currentTime > 0) {
                handleVideoPaused();
                videoControls.classList.add('show-play-button');
            }
        });
        
        // Check autoplay status after a short delay
        setTimeout(function() {
            if (video.paused) {
                handleVideoPaused();
                videoControls.classList.add('show-play-button');
            }
        }, 500);
        
        // Play/pause button functionality
        playButton.addEventListener('click', function() {
            if (video.paused) {
                // Try to play with user interaction
                video.play().catch(function(error) {
                    console.log('Error playing video:', error);
                    // Fallback for devices that cannot play video
                    videoContainer.classList.add('video-error');
                });
            } else {
                video.pause();
            }
        });
        
        // On mobile, pause video when it's not visible to save resources
        if (isMobile) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting && !video.paused) {
                            video.pause();
                        } else if (entry.isIntersecting && video.paused && isAutoplaySupported) {
                            video.play().catch(() => {
                                // If play fails after scrolling back, show play button
                                videoControls.classList.add('show-play-button');
                            });
                        }
                    });
                },
                { threshold: 0.3 } // When at least 30% of the video is visible
            );
            
            observer.observe(video);
            
            // Optimize video loading on mobile
            if ('connection' in navigator) {
                const connection = navigator.connection;
                
                // If on slow connection, use video poster and defer video loading
                if (connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
                    video.preload = 'none';
                    video.poster = 'video-poster.jpg'; // Ensure you have this image
                    videoControls.classList.add('show-play-button');
                }
            }
        }
        
        // Make video behave better on iOS by loading on user touch
        document.body.addEventListener('touchstart', function() {
            if (video.paused && !video.getAttribute('data-touched')) {
                video.load();
                video.setAttribute('data-touched', 'true');
            }
        }, { once: true });
    }
});
