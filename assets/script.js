// ===== MENU MOBILE =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Close menu when clicking on nav links
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// ===== ACTIVE LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===== SCROLL TO TOP =====
const scrollTop = document.getElementById('scroll-top');

function showScrollTop() {
    if (window.scrollY >= 560) {
        scrollTop.classList.add('show-scroll');
    } else {
        scrollTop.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', showScrollTop);

// ===== HEADER SHADOW ON SCROLL =====
const header = document.getElementById('header');

function headerShadow() {
    if (window.scrollY >= 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
}

window.addEventListener('scroll', headerShadow);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FORM HANDLING =====
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Track form submission in Meta Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
    }
    
    // Simulate form submission
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = 'Enviando...';
    
    // Simulate API call
    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
        button.disabled = false;
        button.innerHTML = originalText;
    }, 1500);
}

function handleNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Track newsletter subscription in Meta Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Subscribe');
    }
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = 'Inscrevendo...';
    
    // Simulate API call
    setTimeout(() => {
        alert('Inscrição realizada com sucesso! Obrigado por se inscrever.');
        form.reset();
        button.disabled = false;
        button.innerHTML = originalText;
    }, 1500);
}

// ===== PRODUCT CARD ANIMATIONS =====
const productCards = document.querySelectorAll('.product__card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

productCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== STATS COUNTER ANIMATION =====
const stats = document.querySelectorAll('.stat__number');
let hasAnimated = false;

function animateStats() {
    if (hasAnimated) return;
    
    const heroSection = document.getElementById('home');
    const heroRect = heroSection.getBoundingClientRect();
    
    if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
        hasAnimated = true;
        
        stats.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isK = target.includes('K+');
            const number = parseInt(target.replace(/[^0-9]/g, ''));
            
            let current = 0;
            const increment = number / 50;
            const duration = 2000;
            const stepTime = duration / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                if (isPercentage) {
                    stat.textContent = Math.floor(current) + '%';
                } else if (isK) {
                    stat.textContent = Math.floor(current) + 'K+';
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
            }, stepTime);
        });
    }
}

window.addEventListener('scroll', animateStats);
animateStats(); // Check on load

// ===== ADD TO CART TRACKING =====
document.querySelectorAll('.product__card .button').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product__card');
        const productName = productCard.querySelector('.product__title').textContent;
        const productPrice = productCard.querySelector('.price__value').textContent;
        
        // Track AddToCart event in Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_name: productName,
                value: parseFloat(productPrice.replace(',', '.')),
                currency: 'BRL'
            });
        }
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '✓ Adicionado!';
        this.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
        }, 2000);
    });
});

// ===== LAZY LOADING IMAGES =====
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    if (img.dataset.src) {
        imageObserver.observe(img);
    }
});

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Track modal view in Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: modalId.replace('-modal', '')
            });
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show-modal');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show-modal');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show-modal');
        if (openModal) {
            openModal.classList.remove('show-modal');
            document.body.style.overflow = '';
        }
    }
});

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading states if any
    document.body.classList.add('loaded');
    
    // Initialize scroll position
    scrollActive();
    showScrollTop();
    headerShadow();
});

