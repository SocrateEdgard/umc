// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des fonctionnalités
    initNavigation();
    initScrollEffects();
    initBackToTop();
    initCounters();
});

// Navigation mobile
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navbar.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) hamburger.classList.remove('active');
            navbar.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Effets de défilement
function initScrollEffects() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            // Header scroll effect
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back to top button
            const backToTop = document.getElementById('backToTop');
            if (backToTop) {
                if (window.scrollY > 500) {
                    backToTop.classList.add('active');
                } else {
                    backToTop.classList.remove('active');
                }
            }
        });
    }
}

// Bouton retour en haut
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Compteurs animés
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasCounted = false;
    
    function startCounting() {
        const statsSection = document.querySelector('.stats');
        if (!statsSection || hasCounted) return;
        
        const statsSectionPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsSectionPosition < screenPosition) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-count');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 15);
                let count = 0;
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
            });
            
            hasCounted = true;
        }
    }
    
    window.addEventListener('scroll', startCounting);
    // Vérifier au chargement si la section est déjà visible
    startCounting();
}

// Fonction pour faire défiler vers une section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}