// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Header Scroll Effect
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mathematics Element Animations
document.addEventListener('DOMContentLoaded', function() {
    // Add floating animation to mathematical elements
    const elements = document.querySelectorAll('.math-element');
    elements.forEach((element, index) => {
        element.style.animation = `float ${6 + index % 3}s ease-in-out infinite ${index * 0.2}s`;
    });
    
    // Add animation to graph line
    const graphLine = document.querySelector('.graph-line');
    if (graphLine) {
        graphLine.style.animation = 'graph-animation 5s ease-in-out infinite alternate';
    }
});
