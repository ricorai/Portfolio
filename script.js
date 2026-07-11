/* ============================================================
   RESUME → INTERACTIVE PORTFOLIO — JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. DOM ELEMENT REFERENCES
  // ============================================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-links a');
  const particleCanvas = document.getElementById('particleCanvas');
  const typingTarget = document.getElementById('typingTarget');
  const typingCursor = document.querySelector('.typing-cursor');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');
  const currentYearSpan = document.getElementById('currentYear');

  // ============================================================
  // 2. FOOTER YEAR
  // ============================================================
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ============================================================
  // 3. PARTICLE SYSTEM
  // ============================================================
  function initParticles() {
    if (!particleCanvas) return;

    const ctx = particleCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const isMobile = window.innerWidth <= 768;
    const PARTICLE_COUNT = isMobile ? 20 : 50;
    let mouseX = -1000;
    let mouseY = -1000;
    const hasPointer = matchMedia('(hover: hover)').matches;

    function resize() {
      const rect = particleCanvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      particleCanvas.width = width;
      particleCanvas.height = height;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.3 + 0.05;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction — gentle pull
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.02;
          this.speedX -= dx * force * 0.005;
          this.speedY -= dy * force * 0.005;
        }

        // Speed damping
        this.speedX *= 0.999;
        this.speedY *= 0.999;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 137, 121, ' + this.opacity + ')';
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    var particlesVisible = true;

    function animate() {
      if (particlesVisible) {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var dx = particles[i].x - particles[j].x;
            var dy = particles[i].y - particles[j].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = 'rgba(148, 137, 121, ' + (0.06 * (1 - dist / 100)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        particles.forEach(function (p) { p.update(); p.draw(ctx); });
      }
      requestAnimationFrame(animate);
    }

    // Pause particles when hero is off-screen
    var heroSection = document.getElementById('hero');
    if (heroSection && 'IntersectionObserver' in window) {
      var pObs = new IntersectionObserver(function (e) {
        particlesVisible = e[0].isIntersecting;
      }, { threshold: 0 });
      pObs.observe(heroSection);
    }

    if (hasPointer) {
      particleCanvas.addEventListener('mousemove', function (e) {
        var rect = particleCanvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });

      particleCanvas.addEventListener('mouseleave', function () {
        mouseX = -1000;
        mouseY = -1000;
      });
    }

    window.addEventListener('resize', resize);
    init();
    animate();
  }

  // ============================================================
  // 5. TYPING ANIMATION (Hero)
  // ============================================================
  function initTyping() {
    if (!typingTarget || !typingCursor) return;

    const titleText = 'Virtual Assistant & AI Productivity Specialist';
    let charIndex = 0;
    let hasPlayed = sessionStorage.getItem('typingPlayed');

    if (hasPlayed) {
      typingTarget.textContent = titleText;
      typingCursor.classList.add('done');
      return;
    }

    function type() {
      if (charIndex < titleText.length) {
        typingTarget.textContent += titleText.charAt(charIndex);
        charIndex++;
        setTimeout(type, 35 + Math.random() * 25);
      } else {
        typingCursor.classList.add('done');
        sessionStorage.setItem('typingPlayed', 'true');
      }
    }

    // Small delay before typing starts
    setTimeout(type, 600);
  }

  // ============================================================
  // 6. HERO FADE-IN SEQUENCE
  // ============================================================
  function initHeroFadeIn() {
    // Instant — no delay, hero is already above the fold
    const fadeElements = document.querySelectorAll('.hero .fade-in');
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ============================================================
  // 7. SCROLL REVEAL — section-by-section, reading-order animation
  // ============================================================
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .skill-card, .stat-item').forEach(function (el) {
        el.style.opacity = '1'; el.style.transform = 'none';
      });
      return;
    }

    var ANIM = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
    var gridCols = window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;

    // Helper: reveal — transitions inline values (no CSS class dependency)
    function show(el, ms) {
      setTimeout(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.classList.add('visible');
        // Clean up inline transform after transition so CSS :hover/:active can take over
        el.addEventListener('transitionend', function handler() {
          el.style.transform = '';
          el.removeEventListener('transitionend', handler);
        });
      }, ms || 0);
    }

    // Helper: set initial hidden state + transition (inline, always wins over CSS)
    function hide(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    // Helper: animate a batch — RAF ensures hidden state is painted first
    function animateGroup(items, staggerMs, callback) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (callback) {
            callback(items, staggerMs);
          } else {
            items.forEach(function (el, i) { show(el, i * staggerMs); });
          }
        });
      });
    }

    // --- 1. STATS ROW: sequential left-to-right ---
    var statsRow = document.querySelector('.stats-row');
    var statItems = document.querySelectorAll('.stat-item');
    if (statsRow && statItems.length) {
      statItems.forEach(function (el) { hide(el); });
      var statsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(statItems, 120);
          statsObs.unobserve(statsRow);
        }
      }, ANIM);
      statsObs.observe(statsRow);
    }

    // --- 2. ABOUT: heading → paragraphs cascade ---
    var aboutSection = document.getElementById('about');
    if (aboutSection) {
      var aboutPs = aboutSection.querySelectorAll('.about-content p');
      aboutPs.forEach(function (el) { hide(el); });
      var aboutObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(aboutPs, 180, function (items, ms) {
            items.forEach(function (el, i) { show(el, 100 + i * ms); });
          });
          aboutObs.unobserve(aboutSection);
        }
      }, ANIM);
      aboutObs.observe(aboutSection);
    }

    // --- 3. SKILLS: first card leads, then left→right wave ---
    var skillsGrid = document.getElementById('skillsGrid');
    if (skillsGrid) {
      var skillCards = skillsGrid.querySelectorAll('.skill-card');
      skillCards.forEach(function (el) { hide(el); });
      var skillsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(skillCards, 0, function (cards) {
            cards.forEach(function (card, i) {
              if (i === 0) {
                show(card, 80);
              } else {
                var row = Math.floor(i / gridCols);
                var col = i % gridCols;
                show(card, 80 + (row + col) * 80);
              }
            });
          });
          skillsObs.unobserve(skillsGrid);
        }
      }, ANIM);
      skillsObs.observe(skillsGrid);
    }

    // --- 4. EXPERIENCE: timeline card fades in ---
    var expSection = document.getElementById('experience');
    if (expSection) {
      var timelineItems = expSection.querySelectorAll('.timeline-item');
      timelineItems.forEach(function (el) { hide(el); });
      var expObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(timelineItems, 150);
          expObs.unobserve(expSection);
        }
      }, ANIM);
      expObs.observe(expSection);
    }

    // --- 5. PROJECTS: cards left→right ---
    var projectsSection = document.getElementById('projects');
    if (projectsSection) {
      var projectCards = projectsSection.querySelectorAll('.project-card');
      projectCards.forEach(function (el) { hide(el); });
      var projObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(projectCards, 120);
          projObs.unobserve(projectsSection);
        }
      }, ANIM);
      projObs.observe(projectsSection);
    }

    // --- 6. EDUCATION: items cascade ---
    var eduSection = document.getElementById('education');
    if (eduSection) {
      var eduItems = eduSection.querySelectorAll('.edu-item');
      eduItems.forEach(function (el) { hide(el); });
      var eduObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(eduItems, 120);
          eduObs.unobserve(eduSection);
        }
      }, ANIM);
      eduObs.observe(eduSection);
    }

    // --- 7. INTERESTS: tags bloom in ---
    var interestsSection = document.getElementById('interests');
    if (interestsSection) {
      var interestTags = interestsSection.querySelectorAll('.interest-tag');
      interestTags.forEach(function (el) { hide(el); });
      var intObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(interestTags, 80);
          intObs.unobserve(interestsSection);
        }
      }, ANIM);
      intObs.observe(interestsSection);
    }

    // --- 8. PROFILE: cards cascade ---
    var profileSection = document.getElementById('profile');
    if (profileSection) {
      var profileCards = profileSection.querySelectorAll('.profile-card');
      profileCards.forEach(function (el) { hide(el); });
      var profObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(profileCards, 100);
          profObs.unobserve(profileSection);
        }
      }, ANIM);
      profObs.observe(profileSection);
    }

    // --- 9. CONTACT: cards cascade ---
    var contactSection = document.getElementById('contact');
    if (contactSection) {
      var contactCards = contactSection.querySelectorAll('.contact-card');
      contactCards.forEach(function (el) { hide(el); });
      var contactObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateGroup(contactCards, 100);
          contactObs.unobserve(contactSection);
        }
      }, ANIM);
      contactObs.observe(contactSection);
    }
  }

  // ============================================================
  // 8. EXPANDABLE TIMELINE CARDS
  // ============================================================
  function initTimelineExpand() {
    const timelineHeaders = document.querySelectorAll('.timeline-header');

    timelineHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        const item = header.closest('.timeline-item');
        const isExpanded = item.classList.contains('expanded');
        const isCurrentlyExpanded = header.getAttribute('aria-expanded') === 'true';

        if (isCurrentlyExpanded) {
          item.classList.remove('expanded');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('expanded');
          header.setAttribute('aria-expanded', 'true');
        }
      });

      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  // ============================================================
  // 9. PROJECT MODALS
  // ============================================================
  const projectData = {
    ryos: {
      title: 'AI Orchestration Framework (Ryos)',
      description: 'A framework designed to produce more consistent AI responses across multiple platforms including Claude, ChatGPT, Gemini, Grok, and Perplexity. The system was tested and refined through real-world use and feedback from other users, improving the reliability and quality of cross-platform AI interactions.',
      tech: ['AI/LLM', 'Prompt Engineering', 'Workflow Design', 'Multi-Platform']
    },
    relay: {
      title: 'Ryos Relay',
      description: 'A command-line tool enabling multiple AI models to exchange information and collaborate within a single workflow. By simplifying communication between AI models, Ryos Relay supports more complex multi-step tasks that benefit from the strengths of different AI systems working together.',
      tech: ['CLI Tool', 'Multi-Model AI', 'Automation', 'Workflow Orchestration']
    },
    prompts: {
      title: 'Master Prompts & Prompt Engineering',
      description: 'A collection of carefully crafted, reusable prompts designed for Claude, ChatGPT, Gemini, Grok, and Perplexity. Each prompt was iteratively refined to improve consistency and quality of AI responses across different tasks and workflows, demonstrating deep understanding of prompt engineering principles.',
      tech: ['Claude', 'ChatGPT', 'Gemini', 'Grok', 'Perplexity']
    },
    web: {
      title: 'Websites & Media Design',
      description: 'Built and maintained a personal/project website with a focus on clean, modern design. Additionally designed marketing materials and digital graphics using Canva, creating professional visual assets for client presentations and brand identity.',
      tech: ['HTML/CSS/JS', 'Canva', 'Web Design', 'Media Design']
    }
  };

  function openModal(projectKey) {
    const data = projectData[projectKey];
    if (!data || !modalOverlay || !modalBody) return;

    let techHTML = '';
    data.tech.forEach(function (t) {
      techHTML += '<span>' + t + '</span>';
    });

    modalBody.innerHTML =
      '<h3>' + data.title + '</h3>' +
      '<p>' + data.description + '</p>' +
      '<div class="project-tech">' + techHTML + '</div>';

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap — focus the close button
    const closeBtn = modalOverlay.querySelector('.modal-close');
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 100);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initModals() {
    // Open modal from project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function (card) {
      const link = card.querySelector('.project-link');
      const projectKey = card.getAttribute('data-project');

      if (link && projectKey) {
        link.addEventListener('click', function () {
          openModal(projectKey);
        });

        link.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(projectKey);
          }
        });
      }
    });

    // Close modal
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }

    // Escape key to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ============================================================
  // 10. LENIS SMOOTH SCROLL
  // ============================================================
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded — falling back to native scroll');
      return;
    }

    lenis = new Lenis({
      duration: 1.4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis scroll to our tracking
    lenis.on('scroll', function (e) {
      onLenisScroll(e);
    });

    console.log('✅ Lenis smooth scroll initialized');
  }

  // ============================================================
  // 10b. SCROLL HANDLER (shared by Lenis + native fallback)
  // ============================================================
  let lastScrollY = 0;

  function handleScroll(scrollY) {
    // Headroom: hide nav on scroll down, show on scroll up
    if (scrollY <= 5) {
      navbar.classList.remove('hidden');
    } else if (scrollY > lastScrollY && scrollY > 80) {
      navbar.classList.add('hidden');
    } else if (scrollY < lastScrollY) {
      navbar.classList.remove('hidden');
    }
    lastScrollY = scrollY;

    // Navbar shadow
    if (scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Parallax effects
    updateParallax(scrollY);
  }

  function onLenisScroll(e) {
    handleScroll(e.scroll);

    // Active section tracking (uses actual scroll position)
    updateActiveSection(e.scroll);
  }

  // ============================================================
  // 10c. PARALLAX EFFECTS
  // ============================================================
  function updateParallax(scrollY) {
    // Hero avatar — moves slower (drifts up slightly as user scrolls)
    const avatar = document.querySelector('.parallax-slow');
    if (avatar && scrollY < window.innerHeight) {
      const offset = scrollY * 0.15;
      avatar.style.transform = 'translateY(' + offset + 'px)';
    } else if (avatar) {
      avatar.style.transform = 'translateY(' + (window.innerHeight * 0.15) + 'px)';
    }
  }

  // ============================================================
  // 10d. ACTIVE SECTION TRACKING
  // ============================================================
  const trackedSections = [];
  const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'interests', 'profile', 'contact'];

  function buildSectionList() {
    sectionIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) trackedSections.push(el);
    });
  }

  function updateActiveSection(scrollY) {
    let currentSection = 'hero';
    trackedSections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        currentSection = section.id;
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Native scroll fallback (when Lenis is unavailable)
  function initNativeScrollFallback() {
    if (lenis) return; // Lenis handles it

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          handleScroll(scrollY);
          updateActiveSection(scrollY);
          ticking = false;
        });
        ticking = true;
      }
    });
    handleScroll(window.scrollY);
    updateActiveSection(window.scrollY);
  }

  // ============================================================
  // 10e. NAVIGATION
  // ============================================================

  // Mobile hamburger toggle
  function initMobileNav() {
    if (!navToggle || !navLinks) return;

    // Create backdrop overlay
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function openNav() {
      navLinks.classList.add('active');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }

    function closeNav() {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    navToggle.addEventListener('click', function () {
      if (navLinks.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close on backdrop click
    backdrop.addEventListener('click', closeNav);

    // Close mobile nav when a link is clicked
    allNavLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  // Smooth scrolling for nav links (Lenis-powered)
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 64;
          const top = target.offsetTop - navHeight - 8;

          if (lenis) {
            lenis.scrollTo(top, { duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
          } else {
            window.scrollTo({ top: top, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // ============================================================
  // 12. INTEREST TAG BUBBLE
  // ============================================================
  function initInterestBubbles() {
    const tags = document.querySelectorAll('.interest-tag');
    if (!tags.length) return;

    // Create overlay (visual only)
    const overlay = document.createElement('div');
    overlay.className = 'interest-overlay';
    document.body.appendChild(overlay);

    // Create bubble
    const bubble = document.createElement('div');
    bubble.className = 'interest-bubble';
    bubble.innerHTML = `
      <div class="interest-bubble-title"></div>
      <div class="interest-bubble-desc"></div>
      <div class="interest-bubble-hint">Tap outside or move cursor away to close</div>
    `;
    document.body.appendChild(bubble);

    const titleEl = bubble.querySelector('.interest-bubble-title');
    const descEl = bubble.querySelector('.interest-bubble-desc');
    let isOpen = false;

    function open(tag) {
      titleEl.textContent = tag.textContent.trim();
      descEl.textContent = tag.dataset.description || '';
      overlay.classList.add('active');
      bubble.classList.add('active');
      isOpen = true;
    }

    function close() {
      if (!isOpen) return;
      overlay.classList.remove('active');
      bubble.classList.remove('active');
      isOpen = false;
    }

    tags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        open(tag);
      });
    });

    bubble.addEventListener('mouseleave', close);
    document.addEventListener('click', (e) => {
      if (isOpen && !bubble.contains(e.target)) {
        close();
      }
    });
  }

  // ============================================================
  // 13. INITIALIZATION
  // ============================================================
  function init() {
    buildSectionList();
    initParticles();
    initTyping();
    initHeroFadeIn();
    initScrollReveal();
    initTimelineExpand();
    initModals();
    initLenis();
    initNativeScrollFallback();   // fallback if Lenis unavailable
    initMobileNav();
    initSmoothScroll();
    initInterestBubbles();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
