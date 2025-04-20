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

// Add mobile menu functionality
if (menuToggle) {
    // Create close menu button
    const closeMenu = document.createElement('div');
    closeMenu.classList.add('close-menu');
    closeMenu.innerHTML = '<i class="fas fa-times"></i>';
    navMenu.appendChild(closeMenu);

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
    });

    // Close menu
    closeMenu.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Scroll event for header and scroll-to-top button
window.addEventListener('scroll', () => {
    // Header background on scroll
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll-to-top button
    if (window.scrollY > 500) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation based on scroll position
function setActiveNav() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
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

// Form validation and submission
if (bookingForm) {
    // Set min date to today
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayString = `${yyyy}-${mm}-${dd}`;
    
    dateInput.min = todayString;
    
    // Disable Fridays between 12:30 and 13:30
    dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.getDay();
        
        // If Friday (day 5)
        if (dayOfWeek === 5) {
            const timeSelect = document.getElementById('time');
            const timeOptions = timeSelect.querySelectorAll('option');
            
            timeOptions.forEach(option => {
                const timeValue = option.value;
                if (timeValue === '12:30' || timeValue === '13:00') {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            });
        } else {
            const timeSelect = document.getElementById('time');
            const timeOptions = timeSelect.querySelectorAll('option');
            
            timeOptions.forEach(option => {
                option.disabled = false;
            });
        }
    });
    
    // Form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show confirmation modal
        bookingConfirmation.classList.add('active');
        
        // Reset form
        bookingForm.reset();
    });
    
    // Close confirmation modal
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', () => {
            bookingConfirmation.classList.remove('active');
        });
    }
}

// Service price calculator
if (serviceSelect) {
    const priceDisplay = document.createElement('div');
    priceDisplay.classList.add('price-display');
    serviceSelect.parentNode.appendChild(priceDisplay);
    
    serviceSelect.addEventListener('change', () => {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const selectedText = selectedOption.text;
        
        if (selectedText && selectedText !== 'Select a service') {
            const priceMatch = selectedText.match(/\(R(\d+)\)/);
            if (priceMatch && priceMatch[1]) {
                const price = priceMatch[1];
                priceDisplay.textContent = `Selected service price: R${price}`;
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        } else {
            priceDisplay.style.display = 'none';
        }
    });
}

// Gallery image hover effect with animation
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add('hover');
    });
    
    item.addEventListener('mouseleave', () => {
        item.classList.remove('hover');
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
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
    }
});

// Animated counter for years of experience
function animateCounter() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // Animation duration in milliseconds
        const step = target / (duration / 16); // Update every 16ms (60fps)
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger counter animation when element is in viewport
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about-content')) {
                animateCounter();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    observer.observe(aboutContent);
}

// Barber pole animation speed control
const poleAnimation = document.querySelector('.pole-animation');
if (poleAnimation) {
    let animationSpeed = 12; // Default animation duration in seconds
    
    function updateAnimationSpeed(speed) {
        poleAnimation.style.animationDuration = `${speed}s`;
    }
    
    // For demonstration - could be controlled by user interaction
    // Slower animation
    setTimeout(() => {
        updateAnimationSpeed(20);
    }, 5000);
    
    // Back to normal speed
    setTimeout(() => {
        updateAnimationSpeed(12);
    }, 10000);
}

// Add testimonial slider
class TestimonialSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.testimonial-slide');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Create navigation dots
        this.createDots();
        
        // Show first slide
        this.showSlide(this.currentIndex);
        
        // Auto play
        this.autoPlay();
    }
    
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('testimonial-dots');
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('testimonial-dot');
            dot.addEventListener('click', () => {
                this.showSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
        
        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.testimonial-dot');
    }
    
    showSlide(index) {
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentIndex = index;
    }
    
    nextSlide() {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.totalSlides) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.totalSlides - 1;
        }
        this.showSlide(prevIndex);
    }
    
    autoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Initialize testimonial slider if exists
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider('testimonial-slider');
});

// Add typed text effect to hero section
function initTypedEffect() {
    const textElement = document.querySelector('.hero-text h1');
    if (!textElement) return;
    
    const originalText = textElement.textContent;
    textElement.textContent = '';
    
    let charIndex = 0;
    
    function typeText() {
        if (charIndex < originalText.length) {
            textElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeText, 500);
}

// Initialize typing effect if it exists
document.addEventListener('DOMContentLoaded', () => {
    initTypedEffect();
});

// Add service hover effect with price highlight
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

// Add CSS class for highlighting the active service price
const styleElement = document.createElement('style');
styleElement.textContent = `
    .service-price.highlight {
        transform: scale(1.1);
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(styleElement);

// Validate phone number input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Allow only numbers and some special characters
        const input = e.target.value;
        const sanitizedInput = input.replace(/[^\d\s\+\-\(\)]/g, '');
        
        if (input !== sanitizedInput) {
            e.target.value = sanitizedInput;
        }
    });
}

// Add service price calculator
function updateTotalPrice() {
    const serviceSelect = document.getElementById('service');
    if (!serviceSelect) return;
    
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    if (!selectedOption || selectedOption.value === '') return;
    
    const selectedText = selectedOption.text;
    const priceMatch = selectedText.match(/\(R(\d+)\)/);
    
    if (priceMatch && priceMatch[1]) {
        const basePrice = parseInt(priceMatch[1]);
        
        // Display the price
        let priceDisplay = document.querySelector('.calculated-price');
        if (!priceDisplay) {
            priceDisplay = document.createElement('div');
            priceDisplay.classList.add('calculated-price');
            serviceSelect.parentNode.appendChild(priceDisplay);
        }
        
        priceDisplay.innerHTML = `
            <div class="price-box">
                <span class="price-label">Total Price:</span>
                <span class="price-amount">R${basePrice}</span>
            </div>
        `;
    }
}

// Initialize price calculator
const serviceSelectElement = document.getElementById('service');
if (serviceSelectElement) {
    serviceSelectElement.addEventListener('change', updateTotalPrice);
}

// Add appointment confirmation details
function generateConfirmationDetails() {
    const bookingForm = document.getElementById('booking-form');
    const confirmationContent = document.querySelector('.confirmation-content');
    
    if (!bookingForm || !confirmationContent) return;
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const service = document.getElementById('service');
        const serviceName = service.options[service.selectedIndex].text;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        // Format date
        const formattedDate = new Date(date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Create confirmation details
        const detailsElement = document.createElement('div');
        detailsElement.classList.add('confirmation-details');
        detailsElement.innerHTML = `
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your appointment has been confirmed for:</p>
            <ul>
                <li><strong>Service:</strong> ${serviceName}</li>
                <li><strong>Date:</strong> ${formattedDate}</li>
                <li><strong>Time:</strong> ${time}</li>
            </ul>
            <p>We look forward to seeing you at Barber SA, Centurion Mall.</p>
        `;
        
        // Add details to confirmation modal
        const existingDetails = confirmationContent.querySelector('.confirmation-details');
        if (existingDetails) {
            existingDetails.remove();
        }
        
        // Insert after confirmation text, before the button
        const button = confirmationContent.querySelector('.btn');
        confirmationContent.insertBefore(detailsElement, button);
        
        // Show confirmation modal
        document.getElementById('booking-confirmation').classList.add('active');
    });
}

// Initialize confirmation details
document.addEventListener('DOMContentLoaded', () => {
    generateConfirmationDetails();
});

// Add parallax effect to hero section
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition <= 700) {
            hero.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
        }
    });
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', () => {
    parallaxEffect();
});

// Add fade-in animation for sections
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

// Add CSS for fade animation
const fadeAnimationStyle = document.createElement('style');
fadeAnimationStyle.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(fadeAnimationStyle);

// Initialize section animations
document.addEventListener('DOMContentLoaded', () => {
    animateSections();
});

// Add real-time form validation
function initFormValidation() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    const inputs = bookingForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
    
    function validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            setInvalid(input, 'This field is required');
        } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            setInvalid(input, 'Please enter a valid email address');
        } else if (input.id === 'phone' && input.value.trim() && !isValidPhone(input.value)) {
            setInvalid(input, 'Please enter a valid phone number');
        } else {
            setValid(input);
        }
    }
    
    function setInvalid(input, message) {
        input.classList.add('invalid');
        
        let errorMessage = input.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            input.parentNode.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
    }
    
    function setValid(input) {
        input.classList.remove('invalid');
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        // Simple validation for phone numbers
        const re = /^[\d\s\+\-\(\)]{7,20}$/;
        return re.test(phone);
    }
    
    // Add validation CSS
    const validationStyle = document.createElement('style');
    validationStyle.textContent = `
        input.invalid, select.invalid, textarea.invalid {
            border-color: #ff3b30;
            box-shadow: 0 0 5px rgba(255, 59, 48, 0.3);
        }
        
        .error-message {
            color: #ff3b30;
            font-size: 12px;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(validationStyle);
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
});

// Add time slot availability display
function initTimeSlotAvailability() {
    const timeSelect = document.getElementById('time');
    if (!timeSelect) return;
    
    // Simulate available slots (in a real application, this would come from a database)
    const availableSlots = {
        '09:00': 2,
        '09:30': 1,
        '10:00': 3,
        '10:30': 0,
        '11:00': 2,
        '11:30': 3,
        '12:00': 1,
        '14:00': 3,
        '14:30': 2,
        '15:00': 3,
        '15:30': 1,
        '16:00': 0,
        '16:30': 2,
        '17:00': 3
    };
    
    // Update time slot options with availability
    function updateTimeSlotOptions() {
        const options = timeSelect.querySelectorAll('option');
        
        options.forEach(option => {
            const value = option.value;
            if (value && value in availableSlots) {
                const available = availableSlots[value];
                
                if (available === 0) {
                    option.disabled = true;
                    option.textContent = `${value} - Fully Booked`;
                } else {
                    option.disabled = false;
                    option.textContent = `${value} - ${available} ${available === 1 ? 'slot' : 'slots'} available`;
                }
            }
        });
    }
    
    // Call once to initialize
    updateTimeSlotOptions();
}

// Initialize time slot availability
document.addEventListener('DOMContentLoaded', () => {
    initTimeSlotAvailability();
});
