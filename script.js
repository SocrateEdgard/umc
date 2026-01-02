// ===========================================
// MENU HAMBURGER SIMPLE
// ===========================================

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Ouvrir/fermer le menu
  if (hamburger && navbar) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      navbar.classList.toggle('active');

      // Empêcher le défilement du body quand le menu est ouvert
      if (navbar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Fermer le menu en cliquant sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===========================================
  // SCROLL SPY POUR LA NAVIGATION
  // ===========================================

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;

    // Pour chaque section
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Retirer la classe active de tous les liens
        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        // Ajouter la classe active au lien correspondant
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  // Écouter le scroll pour mettre à jour la navigation
  window.addEventListener('scroll', updateActiveNavLink);

  // ===========================================
  // ANIMATION DES STATISTIQUES
  // ===========================================

  function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const increment = target / 100;
      let current = 0;

      const updateNumber = () => {
        if (current < target) {
          current += increment;
          if (current > target) current = target;
          stat.textContent = Math.floor(current);
          setTimeout(updateNumber, 20);
        }
      };

      updateNumber();
    });
  }

  // Lancer l'animation des stats quand la section est visible
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  // ===========================================
  // FORMULAIRE DE CONTACT
  // ===========================================

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Afficher un message de chargement
      formMessage.textContent = 'Envoi en cours...';
      formMessage.style.color = '#0a54a0';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formMessage.textContent = 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
          formMessage.style.color = '#06693a';
          contactForm.reset();

          // Effacer le message après 5 secondes
          setTimeout(() => {
            formMessage.textContent = '';
          }, 5000);
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      } catch (error) {
        formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.';
        formMessage.style.color = '#8b0b00';
      }
    });
  }

  // ===========================================
  // HEADER STICKY AU SCROLL
  // ===========================================

  const header = document.getElementById('header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // ===========================================
  // ANIMATION AU SCROLL
  // ===========================================

  function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  // Ajouter la classe fade-in aux éléments que vous voulez animer
  document.querySelectorAll('.service-card, .project-card, .team-member, .testimonial-card').forEach(el => {
    el.classList.add('fade-in');
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Exécuter une fois au chargement
});