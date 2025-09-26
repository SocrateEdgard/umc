// script.js (version complète avec le code de la carte intégré)

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
    const elements = document.querySelectorAll('.service-card, .project-card, .team-member, .mission-box, .testimonial-card');
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

  /* ====== CARTE GOOGLE MAPS (moved here to avoid inline scripts) ====== */
  (function() {
    const loadMapBtn = document.getElementById('loadMapBtn');
    const mapContainer = document.getElementById('map-container');

    if (!loadMapBtn || !mapContainer) return;

    function loadGoogleMap() {
      if (mapContainer.querySelector('iframe')) return; // déjà chargé

      mapContainer.innerHTML = '<div class="map-loading"><i class="fas fa-spinner fa-spin"></i><p>Chargement de la carte...</p></div>';

      setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24470.25226212601!2d25.495155668750005!3d-10.716202999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1977df7d6f6b7c3b%3A0x36254f726c3d5c65!2sKolwezi%2C%20Democratic%20Republic%20of%20the%20Congo!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = '0';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.title = 'Localisation UMC Construction à Kolwezi, RDC';

        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
      }, 800);
    }

    loadMapBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loadGoogleMap();
    });

    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !mapContainer.querySelector('iframe')) {
            loadGoogleMap();
            obs.unobserve(mapSection);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(mapSection);
    }
  })();

}); // DOMContentLoaded end
