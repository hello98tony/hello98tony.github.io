// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js background
    initBackground();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        const isExpanded = mainNav.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        // Show/hide back to top button
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
        
        // Add scrolled class to header
        const header = document.getElementById('mainHeader');
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link
        updateActiveNavLink();
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('mainHeader').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.feature-card, .topic-card, .animation-card, .resource-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Three.js Background Animation
    function initBackground() {
        const container = document.getElementById('canvas-container');
        if (!container) return;
        
        let width = container.clientWidth;
        let height = container.clientHeight;
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a20);
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 30;
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 800;
        
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
            colorArray[i] = Math.random();
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Add floating geometric objects
        const geometry = new THREE.IcosahedronGeometry(3, 0);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x6e00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const icosahedron = new THREE.Mesh(geometry, material);
        scene.add(icosahedron);
        
        const geometry2 = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
        const material2 = new THREE.MeshBasicMaterial({ 
            color: 0x00ffaa,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const torusKnot = new THREE.Mesh(geometry2, material2);
        torusKnot.position.x = 10;
        torusKnot.position.y = 5;
        scene.add(torusKnot);
        
        // Animation loop
        let animationId;
        function animate() {
            animationId = requestAnimationFrame(animate);
            
            particlesMesh.rotation.x += 0.0005;
            particlesMesh.rotation.y += 0.0005;
            
            icosahedron.rotation.x += 0.005;
            icosahedron.rotation.y += 0.005;
            
            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = container.clientWidth;
                height = container.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }, 250);
        }
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        function cleanup() {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            material.dispose();
            material2.dispose();
            geometry.dispose();
            geometry2.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
        }
        
        // Initialize animation
        animate();
        
        // Performance optimization for background tab
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }
    
    // Performance monitoring
    if ('performance' in window) {
        console.log('Page load time:', window.performance.timing.loadEventEnd - window.performance.timing.navigationStart, 'ms');
    }
    
    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
    
    // Lazy loading for background images
    if ('IntersectionObserver' in window) {
        const lazyBackgroundObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elem = entry.target;
                    elem.style.backgroundImage = elem.dataset.bg;
                    lazyBackgroundObserver.unobserve(elem);
                }
            });
        });
        
        document.querySelectorAll('[data-bg]').forEach(elem => {
            lazyBackgroundObserver.observe(elem);
        });
    }
});
