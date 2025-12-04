// Nerds Assemble - JavaScript for Work, Energy & Power
        
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile Menu Toggle
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mainNav = document.getElementById('mainNav');

            if (mobileMenuBtn && mainNav) {
                mobileMenuBtn.addEventListener('click', function() {
                    mainNav.classList.toggle('active');
                    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ?
                        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                });
            }

            // Back to Top Button
            const backToTopBtn = document.getElementById('backToTop');

            function handleScroll() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('active');
                } else {
                    backToTopBtn.classList.remove('active');
                }
            }

            // Debounced scroll event
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(handleScroll, 50);
            }, { passive: true });

            // Initialize AOS
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: window.innerWidth < 768 ? 100 : 120,
                    easing: 'ease-out-quad'
                });
            }

            // Initialize Swiper
            if (typeof Swiper !== 'undefined') {
                const swiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: {
                        delay: 3500,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    slidesPerView: 1,
                    spaceBetween: 20,
                    breakpoints: {
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 25
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30
                        }
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
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        if (mainNav && mainNav.classList.contains('active')) {
                            mainNav.classList.remove('active');
                            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                });
            });

            // Back to Top Button Click
            if (backToTopBtn) {
                backToTopBtn.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }

            // Create Particles
            createParticles();
        });

        // Create Particles Function
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            if (!particlesContainer) return;

            const particleCount = window.innerWidth < 768 ? 20 : 30;
            particlesContainer.innerHTML = '';

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                const size = Math.random() * 3 + 1;
                const posX = Math.random() * window.innerWidth;
                const posY = Math.random() * window.innerHeight;
                const duration = Math.random() * 15 + 10;
                const delay = Math.random() * 5;

                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${posX}px;
                    top: ${posY}px;
                    opacity: ${Math.random() * 0.3 + 0.1};
                    animation: float ${duration}s ease-in-out ${delay}s infinite;
                    background: rgba(255,255,255,0.3);
                `;

                particlesContainer.appendChild(particle);
            }
        }

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(createParticles, 250);
        });
