// script.js (remplace entièrement l'ancien fichier)

document.addEventListener('DOMContentLoaded', () => {

  /* ====== MENU HAMBURGER ====== */
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
      document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (navbar) navbar.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  /* ====== HEADER STICKY & BACK TO TOP ====== */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');

  function handleScrollForHeaderAndTop() {
    if (header) {
      if (window.scrollY > 100) header.classList.add('sticky');
      else header.classList.remove('sticky');
    }

    if (backToTopBtn) {
      if (window.scrollY > 300) backToTopBtn.classList.add('active');
      else backToTopBtn.classList.remove('active');
    }
  }

  window.addEventListener('scroll', handleScrollForHeaderAndTop, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ====== ANIMATIONS STATISTIQUES & FADE-IN ====== */
  const statItems = document.querySelectorAll('.stat-item');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    const statsSectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (statsSectionTop < windowHeight - 100) {
      statItems.forEach(item => {
        const numberElement = item.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-count')) || 0;
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const updateCount = () => {
          if (count < target) {
            count += increment;
            numberElement.textContent = Math.ceil(count);
            requestAnimationFrame(updateCount);
          } else {
            numberElement.textContent = target;
          }
        };
        updateCount();
      });
      statsAnimated = true;
    }
  }

  function fadeInOnScroll() {
    const elements = document.querySelectorAll('.service-card, .project-card, .team-member, .mission-box');
    const windowHeight = window.innerHeight;
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) element.classList.add('fade-in');
    });
  }

  function checkScroll() {
    animateStats();
    fadeInOnScroll();
  }

  // throttle helper
  function throttle(func, wait) {
    let timeout = null;
    let previous = 0;
    return function() {
      const now = Date.now();
      const remaining = wait - (now - previous);
      const context = this;
      const args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) { clearTimeout(timeout); timeout = null; }
        previous = now;
        func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          timeout = null;
          func.apply(context, args);
        }, remaining);
      }
    };
  }

  window.addEventListener('scroll', throttle(checkScroll, 100), { passive: true });
  window.addEventListener('resize', throttle(checkScroll, 100), { passive: true });

  // initial checks
  checkScroll();
  statItems.forEach(item => {
    const numberElement = item.querySelector('.stat-number');
    if (numberElement) numberElement.textContent = '0';
  });


  /* ====== LAZY IMAGES ====== */
  const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  if ('IntersectionObserver' in window && lazyImages.length) {
    const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src || lazyImage.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    }, { rootMargin: '50px 0px', threshold: 0.01 });
    lazyImages.forEach(function(lazyImage) { lazyImageObserver.observe(lazyImage); });
  }


  /* ====== GESTION ERREUR IMAGE ====== */
  document.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') e.target.style.display = 'none';
  }, true);


  /* ====== FORMULAIRE (Formspree) - Handler AJAX ✅ ====== */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // disable bouton + feedback
      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.orig = submitBtn.innerHTML; submitBtn.innerHTML = 'Envoi...'; }
      formMessage.className = 'form-alert loading';
      formMessage.textContent = '⏳ Envoi en cours...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formMessage.className = 'form-alert success';
          formMessage.textContent = '✅ Message envoyé avec succès ! Nous vous contacterons bientôt.';
          contactForm.reset();
        } else {
          // try to extract JSON message
          let json = {};
          try { json = await response.json(); } catch(e) { /* ignore */ }
          const err = json.error || json.message || '❌ Une erreur est survenue, veuillez réessayer.';
          formMessage.className = 'form-alert error';
          formMessage.textContent = err;
        }
      } catch (error) {
        console.error('Erreur Formspree:', error);
        formMessage.className = 'form-alert error';
        formMessage.textContent = '❌ Erreur réseau ou CORS. Ouvre la console (F12) pour voir le détail.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.dataset.orig || 'Envoyer le message';
        }
      }
    });
  }

}); // DOMContentLoaded end
