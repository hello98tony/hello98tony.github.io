// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
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

// Create floating code elements dynamically
function createCodeElements() {
    const codeSnippets = [
        'function hello() {\n  console.log("Hello World!");\n}',
        'const nums = [1, 2, 3];\nnums.map(n => n * 2);',
        'class Developer {\n  constructor(name) {\n    this.name = name;\n  }\n}',
        'for(let i = 0; i < 5; i++) {\n  console.log(i);\n}'
    ];
    
    const body = document.querySelector('body');
    
    codeSnippets.forEach((snippet, index) => {
        const codeEl = document.createElement('div');
        codeEl.className = 'code-element floating-code';
        codeEl.innerHTML = snippet.split('\n').map(line => 
            `<div class="code-line">${line.replace(/ /g, '&nbsp;')}</div>`
        ).join('');
        
        // Random positioning
        const top = 20 + (index * 15);
        const left = 5 + (index * 20);
        codeEl.style.top = `${top}%`;
        codeEl.style.left = `${left}%`;
        codeEl.style.animation = `float ${15 + index * 2}s infinite ease-in-out`;
        
        body.appendChild(codeEl);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createCodeElements();
});
