/**
 * ==========================================================================
 * Portfolio Interactive Logic & Animations
 * Author: Dhinagar S
 * Description: Clean, vanilla JS engine for scroll progress, interactive particles,
 * dynamic typing, animated stats counter, form validation, and scroll reveals.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Global UI State & References
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const cursorGlow = document.getElementById('cursor-glow');
  const backToTopBtn = document.getElementById('back-to-top');
  const loader = document.getElementById('loader');
  const currentYearSpan = document.getElementById('current-year');

  /* ==========================================================================
     1. Preloader & Initialize Dynamic Dates
     ========================================================================== */
  window.addEventListener('load', () => {
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500);
    }
  });

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. Custom Pointer Glow Follower
     ========================================================================== */
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* ==========================================================================
     3. Scroll Progress Indicator & Navbar Scroll State
     ========================================================================== */
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Active Navigation Link Indicator based on Scroll Position
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (targetNavLink) targetNavLink.classList.add('active');
      } else {
        if (targetNavLink) targetNavLink.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  /* ==========================================================================
     4. Mobile Navigation Menu Toggle
     ========================================================================== */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     5. Hero Section Typing Effect
     ========================================================================== */
  const typingText = document.getElementById('typing-text');
  const roles = [
    'Python Developer',
    'Computer Science Student',
    'Data Analytics Enthusiast',
    'Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const eraseSpeed = 50;
  const delayBetween = 2000;

  function typeEffect() {
    if (!typingText) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextTimeout = isDeleting ? eraseSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      nextTimeout = delayBetween;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      nextTimeout = 500;
    }

    setTimeout(typeEffect, nextTimeout);
  }

  setTimeout(typeEffect, 1000);

  /* ==========================================================================
     6. Animated Statistics Counter
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const animateCounters = () => {
    statNumbers.forEach((stat) => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const currentVal = progress * target;
          stat.textContent = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = isDecimal ? target.toFixed(2) : target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  /* ==========================================================================
     7. Scroll Reveal & Skill Progress Bar Trigger
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const progressBars = document.querySelectorAll('.progress-bar-fill');

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach((el) => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('active');
      }
    });

    // Check stats section visibility for counter trigger
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      const statsTop = statsSection.getBoundingClientRect().top;
      if (statsTop < triggerBottom && !animatedStats) {
        animatedStats = true;
        animateCounters();
      }
    }

    // Trigger Skills Progress Bars Fill
    progressBars.forEach((bar) => {
      const barTop = bar.getBoundingClientRect().top;
      if (barTop < triggerBottom) {
        const targetWidth = bar.getAttribute('data-progress');
        bar.style.width = targetWidth;
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  /* ==========================================================================
     8. Back to Top Smooth Button
     ========================================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     9. Interactive Canvas Background Particles (Vanilla JS)
     ========================================================================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = '#3b82f6';
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#3b82f6';
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            const opacityValue = 1 - distance / 110;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  /* ==========================================================================
     10. Contact Form Interactive Validation
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput);
        isValid = false;
      } else {
        removeError(nameInput);
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        setError(emailInput);
        isValid = false;
      } else {
        removeError(emailInput);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError(subjectInput);
        isValid = false;
      } else {
        removeError(subjectInput);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput);
        isValid = false;
      } else {
        removeError(messageInput);
      }

      if (isValid) {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        // Simulate Async Network Submission
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-text">Send Message</span> <i class="fa-solid fa-paper-plane"></i>';

          if (formStatus) {
            formStatus.className = 'form-status-msg success';
            formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. I will get back to you shortly.';
          }

          contactForm.reset();

          setTimeout(() => {
            if (formStatus) formStatus.style.display = 'none';
          }, 5000);
        }, 1500);
      }
    });
  }

  function setError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('error');
    }
  }

  function removeError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('error');
    }
  }

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});