/* ================================================
   GPS — Modern Corporate Script
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---- Navbar & Mobile Menu ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .nav-link');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      navToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.textContent = '☰';
      }
    });
  });

  /* ---- Slideshows (Fade) ---- */
  function setupSlideshow(selector, interval) {
    const slides = document.querySelectorAll(selector);
    if (slides.length > 1) {
      let currentSlide = 0;
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, interval);
    }
  }

  setupSlideshow('.right-slide', 4000); // 4 seconds for hero right
  setupSlideshow('.footer-slide', 6000); // 6 seconds for footer

  /* ---- Generic Modal Slider Logic ---- */
  function setupModalSlider(modalId, triggersSelector, sliderId, prevBtnId, nextBtnId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const slider = document.getElementById(sliderId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const triggers = document.querySelectorAll(triggersSelector);
    
    if (modal && slider) {
      const totalSlides = slider.children.length;
      let currentIndex = 0;
      let autoPlay;
      let startX = 0;
      let isDragging = false;

      const updatePos = () => slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      const nextSlide = () => { currentIndex = (currentIndex + 1) % totalSlides; updatePos(); };
      const prevSlide = () => { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; updatePos(); };
      const startPlay = () => { stopPlay(); autoPlay = setInterval(nextSlide, 3500); };
      const stopPlay = () => clearInterval(autoPlay);

      triggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
          currentIndex = 0; // or index if we want to open specific slide
          updatePos();
          startPlay();
        });
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        stopPlay();
      });

      if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startPlay(); });
      if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startPlay(); });

      slider.addEventListener('mousedown', (e) => { isDragging = true; startX = e.pageX; stopPlay(); });
      slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        if (startX - e.pageX > 50) nextSlide();
        else if (e.pageX - startX > 50) prevSlide();
        startPlay();
      });
      slider.addEventListener('mouseleave', () => { isDragging = false; });
      slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopPlay(); }, {passive: true});
      slider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextSlide();
        else if (endX - startX > 50) prevSlide();
        startPlay();
      });
    }
  }

  // Initialize both modals
  setupModalSlider('modal-gallery', '.gallery-trigger', 'modal-slider', 'modal-prev', 'modal-next', 'modal-close');
  setupModalSlider('modal-models', '.model-trigger', 'modal-models-slider', 'modal-models-prev', 'modal-models-next', 'modal-models-close');

  /* ---- Contact Modal Setup ---- */
  const contactModal = document.getElementById('contact-modal');
  const contactTriggers = document.querySelectorAll('.contact-trigger');
  const contactClose = document.getElementById('contact-modal-close');

  if (contactModal) {
    contactTriggers.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }));
    contactClose.addEventListener('click', () => {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Intersection Observer (Reveal Animations) ---- */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ---- Contact Form (WhatsApp Redirect) ---- */
  const contactForm = document.getElementById('premium-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const serviceSelect = document.getElementById('contact-service');
      const service = serviceSelect.options[serviceSelect.selectedIndex].value;
      const message = document.getElementById('contact-message').value.trim();

      let whatsappMessage = `*NOUVELLE DEMANDE DE DEVIS (GPS)*\n\n`
        + `👤 *Nom :* ${name}\n`
        + `📞 *Téléphone :* ${phone}\n`
        + `🔧 *Projet :* ${service}\n\n`
        + `💬 *Détails :*\n${message}`;

      const whatsappNumber = '22961213051';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      const btn = document.getElementById('form-submit');
      const oldText = btn.textContent;
      btn.textContent = 'Redirection...';
      btn.disabled = true;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        btn.textContent = oldText;
        btn.disabled = false;
        contactForm.reset();
        if(contactModal) {
          contactModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 800);
    });
  }

  /* ---- Testimonials Marquee (Auto + Manual) ---- */
  const marqueeContainer = document.getElementById('testimonials-container');
  if (marqueeContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let isHovering = false;
    const scrollSpeed = 0.8; // pixels per frame

    // Manual Drag Logic
    marqueeContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      marqueeContainer.style.cursor = 'grabbing';
      startX = e.pageX - marqueeContainer.offsetLeft;
      scrollLeft = marqueeContainer.scrollLeft;
      isHovering = true; // Pause auto scroll
    });
    marqueeContainer.addEventListener('mouseleave', () => {
      isDown = false;
      marqueeContainer.style.cursor = 'grab';
      isHovering = false;
    });
    marqueeContainer.addEventListener('mouseup', () => {
      isDown = false;
      marqueeContainer.style.cursor = 'grab';
    });
    marqueeContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - marqueeContainer.offsetLeft;
      const walk = (x - startX) * 2; // drag speed multiplier
      marqueeContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch events (mobile) to pause auto-scroll
    marqueeContainer.addEventListener('touchstart', () => { isHovering = true; }, {passive: true});
    marqueeContainer.addEventListener('touchend', () => { isHovering = false; });
    marqueeContainer.addEventListener('mouseenter', () => { isHovering = true; });

    // Infinite Auto Scroll Logic
    function autoScrollMarquee() {
      if (!isHovering && !isDown) {
        marqueeContainer.scrollLeft += scrollSpeed;
        
        // Loop back seamlessly when reaching halfway (since we duplicated the 6 items)
        const halfWidth = marqueeContainer.scrollWidth / 2;
        if (marqueeContainer.scrollLeft >= halfWidth) {
          marqueeContainer.scrollLeft = 0;
        } else if (marqueeContainer.scrollLeft <= 0) {
          marqueeContainer.scrollLeft = halfWidth - 1; // Avoid getting stuck if scrolled manually left
        }
      }
      requestAnimationFrame(autoScrollMarquee);
    }
    
    // Start auto-scroll loop
    requestAnimationFrame(autoScrollMarquee);
  }

});
