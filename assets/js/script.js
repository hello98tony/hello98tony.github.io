// Nerds Assemble - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
   
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            const navLinks = mainNav.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
                mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ?
                    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
                
                // Prevent body scroll when menu is open
                if (navLinks.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
           
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
           
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav) {
                    const navLinks = mainNav.querySelector('.nav-links');
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
               
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
       
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .subject-card');
       
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
           
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .subject-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
    });

    // Run animations
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Create floating particles
    const createParticles = function() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '-1';
        document.body.appendChild(particlesContainer);
       
        const particleCount = window.innerWidth < 768 ? 30 : 50;
       
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
           
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.4 + 0.1;
           
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}px;
                top: ${posY}px;
                opacity: ${opacity};
                animation: float ${duration}s ease-in-out ${delay}s infinite;
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                z-index: -1;
            `;
           
            particlesContainer.appendChild(particle);
        }
    };
   
    // Create particles after a short delay
    setTimeout(createParticles, 1000);
   
    // Add animation to subject cards on hover
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
        });
       
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });

    // Cookie Consent Functionality
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');

    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            if (cookieConsent) {
                cookieConsent.style.display = 'block';
            }
        }, 1000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            if (cookieConsent) {
                cookieConsent.style.display = 'none';
            }
        });
    }

    // Performance monitoring
    window.addEventListener('load', function() {
        // Log performance metrics
        if ('performance' in window) {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        }
    });

    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.alt = 'Image not available';
            console.warn('Image failed to load:', this.src);
        });
    });
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
