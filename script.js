/* ================================================
   GPS — Generals Prestations Services
   Landing Page JavaScript
   ================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  var navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    var links = navLinks.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Hero animated particles ---- */
  var particlesContainer = document.getElementById('hero-particles');

  if (particlesContainer) {
    for (var i = 0; i < 40; i++) {
      var particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 12) + 's';
      var size = (Math.random() * 4 + 2) + 'px';
      particle.style.width = size;
      particle.style.height = size;
      particlesContainer.appendChild(particle);
    }
  }

  /* ---- Counter animation for hero stats ---- */
  function animateCounters() {
    var counters = document.querySelectorAll('.hero-stat-number');
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current + (target === 98 ? '%' : '+');
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ---- Intersection Observer for scroll animations ---- */
  function createObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      var elements = document.querySelectorAll('.step-card, .feature-card, .pricing-card, .testimonial-card, .gallery-item');
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
      animateCounters();
      return;
    }

    var observedCounters = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger delay based on index
            var card = entry.target;
            var parent = card.parentElement;
            var siblings = parent ? Array.from(parent.children) : [];
            var index = siblings.indexOf(card);
            var delay = index * 150;

            setTimeout(function () {
              card.classList.add('visible');
            }, delay);

            observer.unobserve(card);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    var cards = document.querySelectorAll('.step-card, .feature-card, .pricing-card, .testimonial-card, .gallery-item');
    cards.forEach(function (card) {
      observer.observe(card);
    });

    // Counter animation observer
    var heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !observedCounters) {
              observedCounters = true;
              animateCounters();
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counterObserver.observe(heroStats);
    }
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      // Skip if this link opens a modal
      if (this.hasAttribute('data-open-modal')) return;

      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Active nav link highlighting ---- */
  function highlightActiveNav() {
    var sections = document.querySelectorAll('section[id], footer[id]');
    var navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 100;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinksAll.forEach(function (link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  /* ================================================
     GALLERY LIGHTBOX
     ================================================ */
  var lightboxOverlay = document.getElementById('lightbox-overlay');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxCloseBtn = document.getElementById('lightbox-close');

  function openLightbox(imgSrc, imgAlt, caption) {
    if (!lightboxOverlay || !lightboxImage) return;
    lightboxImage.src = imgSrc;
    lightboxImage.alt = imgAlt;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Gallery item click to open lightbox
  var galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (img) {
        var caption = item.getAttribute('data-caption') || '';
        openLightbox(img.src, img.alt, caption);
      }
    });
  });

  // Close lightbox
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function (e) {
      if (e.target === lightboxOverlay) {
        closeLightbox();
      }
    });
  }

  /* ================================================
     CONTACT MODAL
     ================================================ */
  var modal = document.getElementById('contact-modal');
  var modalCloseBtn = document.getElementById('modal-close');
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus the first input after animation
    setTimeout(function () {
      var firstInput = modal.querySelector('.form-input');
      if (firstInput) firstInput.focus();
    }, 400);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function resetForm() {
    if (contactForm) {
      contactForm.reset();
      contactForm.style.display = '';
      // Remove error classes
      var errorInputs = contactForm.querySelectorAll('.form-input.error');
      errorInputs.forEach(function (input) {
        input.classList.remove('error');
      });
    }
    if (formSuccess) {
      formSuccess.hidden = true;
    }
  }

  // Open modal from any element with data-open-modal attribute
  var modalTriggers = document.querySelectorAll('[data-open-modal="contact-modal"]');
  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      resetForm();
      openModal();
    });
  });

  // Close modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function () {
      closeModal();
    });
  }

  // Close modal on overlay click (but not on container click)
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal/lightbox on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
      }
      if (modal && modal.classList.contains('active')) {
        closeModal();
      }
    }
  });

  // Form validation & submission
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple client-side validation
      var isValid = true;
      var requiredInputs = contactForm.querySelectorAll('[required]');

      requiredInputs.forEach(function (input) {
        input.classList.remove('error');

        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
          return;
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
            input.classList.add('error');
            isValid = false;
          }
        }

        // Phone validation (basic)
        if (input.type === 'tel' && input.value.trim()) {
          var phoneClean = input.value.replace(/[\s\-\+\(\)]/g, '');
          if (phoneClean.length < 8) {
            input.classList.add('error');
            isValid = false;
          }
        }
      });

      if (!isValid) {
        // Focus first error field
        var firstError = contactForm.querySelector('.form-input.error');
        if (firstError) firstError.focus();
        return;
      }

      // Collect form data for WhatsApp message
      var nameVal = (document.getElementById('contact-name').value || '').trim();
      var phoneVal = (document.getElementById('contact-phone').value || '').trim();
      var emailVal = (document.getElementById('contact-email').value || '').trim();
      var serviceSelect = document.getElementById('contact-service');
      var serviceVal = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].textContent : '';
      var messageVal = (document.getElementById('contact-message').value || '').trim();

      // Build the WhatsApp message
      var whatsappMessage = '🏗️ *Nouvelle demande — GPS*\n\n'
        + '👤 *Nom :* ' + nameVal + '\n'
        + '📞 *Téléphone :* ' + phoneVal + '\n'
        + '📧 *Email :* ' + emailVal + '\n'
        + '🔧 *Service :* ' + serviceVal + '\n'
        + '💬 *Message :*\n' + messageVal;

      // WhatsApp number (Bénin)
      var whatsappNumber = '2290161213051';
      var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(whatsappMessage);

      // Show success state briefly, then redirect to WhatsApp
      var submitBtn = document.getElementById('form-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Redirection vers WhatsApp...';
      }

      // Show success message
      contactForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.hidden = false;
      }

      // Open WhatsApp after a short delay (lets user see success message)
      setTimeout(function () {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '';
          var textNode = document.createTextNode('Envoyer ma demande ');
          submitBtn.appendChild(textNode);
          var arrow = document.createElement('span');
          arrow.classList.add('btn-arrow');
          arrow.textContent = '\u2192';
          submitBtn.appendChild(arrow);
        }

        // Close modal after redirect
        setTimeout(function () {
          closeModal();
          setTimeout(resetForm, 400);
        }, 2000);
      }, 1000);
    });
  }

  /* ---- Parallax-like tilt on hero image (desktop only) ---- */
  var heroImageWrapper = document.querySelector('.hero-image-wrapper');
  if (heroImageWrapper && window.matchMedia('(min-width: 769px)').matches) {
    document.addEventListener('mousemove', function (e) {
      var rect = heroImageWrapper.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var deltaX = (e.clientX - centerX) / rect.width;
      var deltaY = (e.clientY - centerY) / rect.height;
      var rotateX = deltaY * -3;
      var rotateY = deltaX * 3;
      heroImageWrapper.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    }, { passive: true });
  }

  /* ---- Init ---- */
  createObserver();
  highlightActiveNav();
})();
