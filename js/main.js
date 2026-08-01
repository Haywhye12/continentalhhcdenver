/**
 * Continental Home Health, Inc. — Interactive Logic + Micro Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. MOBILE NAVIGATION TOGGLE
     ========================================================================= */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu      = document.querySelector('.nav-menu');
  const navOverlay   = document.getElementById('nav-overlay');

  function openNav() {
    navMenu.classList.add('active');
    navOverlay && navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
    const icon = mobileToggle.querySelector('i');
    if (icon) { icon.classList.replace('fa-bars', 'fa-xmark'); }
  }

  function closeNav() {
    navMenu.classList.remove('active');
    navOverlay && navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
    const icon = mobileToggle.querySelector('i');
    if (icon) { icon.classList.replace('fa-xmark', 'fa-bars'); }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');

    // Toggle on button click
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.contains('active') ? closeNav() : openNav();
    });

    // Close when any nav link is clicked
    navMenu.querySelectorAll('.nav-link, .btn').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close when overlay (backdrop) is clicked
    navOverlay && navOverlay.addEventListener('click', closeNav);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeNav();
    });
  }


  /* =========================================================================
     2. NAVBAR — SCROLL SHRINK
     ========================================================================= */
  const siteHeader = document.querySelector('.site-header');

  function handleNavbarScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 60) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load in case page is already scrolled


  /* =========================================================================
     3. SCROLL-REVEAL — INTERSECTION OBSERVER
        Targets: .reveal, .stagger-children, .section-header,
                 .stat-item, .footer-col, .estimator-info, .why-content
     ========================================================================= */

  // Elements that simply get `.is-visible` on intersection
  const revealTargets = document.querySelectorAll(
    '.reveal, .stagger-children, .section-header, ' +
    '.estimator-info, .why-content'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -20px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


  /* =========================================================================
     4. ANNOTATE EXISTING ELEMENTS WITH REVEAL CLASSES
        (avoids touching the HTML while keeping markup clean)
     ========================================================================= */

  // Section headers
  document.querySelectorAll('.section-header').forEach((el) => {
    el.classList.add('reveal');
  });

  // Service cards — stagger as a group
  const servicesGrid = document.querySelector('.services-grid');
  if (servicesGrid) servicesGrid.classList.add('stagger-children');

  // Testimonial cards — stagger as a group
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  if (testimonialsGrid) testimonialsGrid.classList.add('stagger-children');

  // Estimator section left panel
  const estimatorInfo = document.querySelector('.estimator-info');
  if (estimatorInfo) estimatorInfo.classList.add('reveal', 'reveal--left');

  const estimatorCard = document.querySelector('.estimator-card');
  if (estimatorCard) estimatorCard.classList.add('reveal', 'reveal--right');

  // Why-choose-us image grid
  const whyImageGrid = document.querySelector('.why-image-grid');
  if (whyImageGrid) whyImageGrid.classList.add('reveal', 'reveal--right');

  const whyContent = document.querySelector('.why-content');
  if (whyContent) whyContent.classList.add('reveal', 'reveal--left');

  // CTA banner
  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner) ctaBanner.classList.add('reveal', 'reveal--scale');

  // Feature boxes — stagger
  const featureBoxList = document.querySelector('.feature-box-list');
  if (featureBoxList) featureBoxList.classList.add('stagger-children');

  // Footer columns — add animate class first, then observe with relaxed threshold
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          footerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
  );

  document.querySelectorAll('.footer-col').forEach((el) => {
    el.classList.add('footer-animate'); // hide now that JS is running
    footerObserver.observe(el);
  });

  // Re-observe newly annotated elements
  document.querySelectorAll(
    '.reveal, .stagger-children, .estimator-info, .estimator-card, ' +
    '.why-image-grid, .why-content, .cta-banner'
  ).forEach((el) => revealObserver.observe(el));


  /* =========================================================================
     5. STAT COUNTER — COUNT-UP ON SCROLL INTO VIEW
     ========================================================================= */

  const statItems = document.querySelectorAll('.stat-item');

  // Parse numeric value and suffix from text like "10+", "500+", "100%", "24/7"
  function parseStatValue(text) {
    const cleaned = text.trim();
    const numMatch = cleaned.match(/^(\d+(\.\d+)?)/);
    if (!numMatch) return null;
    const num    = parseFloat(numMatch[1]);
    const suffix = cleaned.slice(numMatch[1].length); // e.g. "+", "%", "/7"
    return { num, suffix };
  }

  function animateCounter(el, target, suffix, duration = 1400) {
    const start     = performance.now();
    const startVal  = 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quart
      const eased    = 1 - Math.pow(1 - progress, 4);
      const current  = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item   = entry.target;
          const h3     = item.querySelector('h3');
          if (!h3) return;

          item.classList.add('is-visible');

          const parsed = parseStatValue(h3.textContent);
          if (parsed && parsed.num > 0) {
            animateCounter(h3, parsed.num, parsed.suffix, 1600);
          }

          statObserver.unobserve(item);
        }
      });
    },
    { threshold: 0.4 }
  );

  statItems.forEach((item) => statObserver.observe(item));


  /* =========================================================================
     6. SERVICE CARD RIPPLE ON CLICK
     ========================================================================= */
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', function (e) {
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;

      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* =========================================================================
     7. CARE ESTIMATOR CALCULATOR + FLASH ANIMATION
     ========================================================================= */
  const serviceTypeSelect = document.getElementById('est-service-type');
  const hoursPerWeekInput = document.getElementById('est-hours');
  const costOutput        = document.getElementById('est-cost-output');

  function calculateEstimatedCost() {
    if (!serviceTypeSelect || !hoursPerWeekInput || !costOutput) return;

    const rate  = parseFloat(serviceTypeSelect.value) || 0;
    const hours = parseFloat(hoursPerWeekInput.value)  || 0;

    const weeklyTotal = (rate && hours) ? Math.round(rate * hours) : 0;
    const formatted   = weeklyTotal > 0 ? `$${weeklyTotal.toLocaleString()} / week` : '$0 / week';

    if (costOutput.textContent !== formatted) {
      costOutput.textContent = formatted;

      // Flash animation
      costOutput.classList.remove('flash');
      void costOutput.offsetWidth; // reflow to restart animation
      costOutput.classList.add('flash');
      costOutput.addEventListener('animationend', () => costOutput.classList.remove('flash'), { once: true });
    }
  }

  if (serviceTypeSelect && hoursPerWeekInput) {
    serviceTypeSelect.addEventListener('change', calculateEstimatedCost);
    hoursPerWeekInput.addEventListener('input',  calculateEstimatedCost);
    calculateEstimatedCost(); // init
  }


  /* =========================================================================
     8. ACCORDION FAQ TOGGLE
     ========================================================================= */
  document.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', () => {
      const item     = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('active'));

      if (!isActive) item.classList.add('active');
    });
  });


  /* =========================================================================
     9. CONSULTATION MODAL
     ========================================================================= */
  const modalOverlay  = document.getElementById('consultation-modal');
  const modalOpenBtns = document.querySelectorAll('[data-open-modal]');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');

  modalOpenBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }


  /* =========================================================================
     10. TOAST NOTIFICATION
     ========================================================================= */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check" style="font-size:1.2rem;color:var(--accent-teal);"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 80);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }


  /* =========================================================================
     11. FORM SUBMISSION HANDLER
     ========================================================================= */
  document.querySelectorAll('form[data-handle-submit]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';

      setTimeout(() => {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = originalHTML;
        form.reset();

        if (modalOverlay && modalOverlay.classList.contains('active')) {
          modalOverlay.classList.remove('active');
        }

        showToast('Thank you! Your request has been sent. We\'ll be in touch within 24 hours.');
      }, 1200);
    });
  });


  /* =========================================================================
     12. HERO V2 — All interactive systems
     ========================================================================= */

  (function initHeroV2() {

    const hero = document.querySelector('.hero-v2');
    if (!hero) return;

    /* ------------------------------------------------------------------
       12a. STAGGERED ENTRANCE — fire [data-hero-anim] elements in sequence
    ------------------------------------------------------------------ */
    const animEls = hero.querySelectorAll('[data-hero-anim]');

    function fireHeroEntrances() {
      animEls.forEach((el) => {
        const delay = parseInt(el.dataset.delay || '0', 10);
        // Add .hv2-visible which triggers CSS transition
        // Clamp delay to max 600ms so nothing feels stuck
        setTimeout(() => {
          el.classList.add('hv2-visible');
          // Cancel the CSS fallback animation since JS handled it
          el.style.animation = 'none';
        }, Math.min(delay, 600));
      });
    }

    // Fire immediately — no loader dependency
    // Small rAF delay ensures the browser has painted first frame
    requestAnimationFrame(() => requestAnimationFrame(fireHeroEntrances));


    /* ------------------------------------------------------------------
       12b. TYPED TEXT — cycles through care-service phrases
       Starts immediately so it's running as soon as the h1 fades in.
    ------------------------------------------------------------------ */
    const typedEl = hero.querySelector('.hv2-typed');

    if (typedEl) {
      const phrases = [
        'Your Family',
        'Seniors',
        'Every Need',
        'Your Home',
        'Peace of Mind',
      ];

      // Start with full first phrase already shown (set in HTML),
      // immediately enter the hold period then cycle normally.
      let phraseIdx  = 0;
      let charIdx    = phrases[0].length; // already fully typed
      let isDeleting = false;

      const TYPE_SPEED = 80;
      const DEL_SPEED  = 40;
      const HOLD_MS    = 2200;
      const PAUSE_MS   = 400;

      function tick() {
        const current = phrases[phraseIdx];

        if (!isDeleting) {
          charIdx++;
          typedEl.textContent = current.slice(0, charIdx);

          if (charIdx >= current.length) {
            isDeleting = true;
            setTimeout(tick, HOLD_MS);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIdx--;
          typedEl.textContent = current.slice(0, charIdx);

          if (charIdx <= 0) {
            isDeleting  = false;
            phraseIdx   = (phraseIdx + 1) % phrases.length;
            charIdx     = 0;
            setTimeout(tick, PAUSE_MS);
            return;
          }
          setTimeout(tick, DEL_SPEED);
        }
      }

      // Hold the pre-filled first phrase, then start cycling
      setTimeout(tick, HOLD_MS);
    }


    /* ------------------------------------------------------------------
       12c. HERO COUNTERS — count up once hero is visible
    ------------------------------------------------------------------ */
    const heroCounters = hero.querySelectorAll('.js-hero-counter');

    function runHeroCounter(el) {
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1800;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease-out expo
        const eased  = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(target * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }

      requestAnimationFrame(step);
    }

    // Fire counters after entrances land
    setTimeout(() => {
      heroCounters.forEach(runHeroCounter);
    }, 600);


    /* ------------------------------------------------------------------
       12d. PARTICLE CANVAS — subtle floating dots
    ------------------------------------------------------------------ */
    const canvas = hero.querySelector('.hero-canvas');

    if (canvas) {
      const ctx  = canvas.getContext('2d');
      let   W, H, particles;
      const COUNT       = 68;
      const MAX_DIST    = 110;   // connect dots within this distance
      const MOUSE_REPEL = 120;   // push particles away from cursor

      let mouse = { x: -9999, y: -9999 };

      function resize() {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
      }

      function createParticles() {
        particles = Array.from({ length: COUNT }, () => ({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r:  Math.random() * 1.6 + 0.6,
          alpha: Math.random() * 0.5 + 0.15,
        }));
      }

      function drawParticles() {
        ctx.clearRect(0, 0, W, H);

        // Update positions
        particles.forEach((p) => {
          // Mouse repel
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL) {
            const force = (MOUSE_REPEL - dist) / MOUSE_REPEL * 0.012;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          // Speed cap
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 0.9) { p.vx *= 0.9 / speed; p.vy *= 0.9 / speed; }

          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
              const alpha = (1 - dist / MAX_DIST) * 0.18;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 168, 150, ${alpha})`;
              ctx.lineWidth   = 0.8;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw dots
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 200, 180, ${p.alpha})`;
          ctx.fill();
        });

        requestAnimationFrame(drawParticles);
      }

      function initCanvas() {
        resize();
        createParticles();
        drawParticles();
      }

      window.addEventListener('resize', () => {
        resize();
        createParticles();
      }, { passive: true });

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }, { passive: true });

      hero.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
      }, { passive: true });

      initCanvas();
    }


    /* ------------------------------------------------------------------
       12e. FLOATING CARD PARALLAX — gentle sinusoidal bob
    ------------------------------------------------------------------ */
    const floatCards = hero.querySelectorAll('.js-float');

    floatCards.forEach((card, i) => {
      const speed     = parseFloat(card.dataset.floatSpeed || '1');
      const amplitude = 7 + i * 2;   // px
      const offset    = (i * Math.PI * 0.66); // phase offset so they don't sync

      let   startTime = null;

      function bobCard(ts) {
        if (!startTime) startTime = ts;
        const elapsed = (ts - startTime) / 1000; // seconds
        const dy = Math.sin(elapsed * speed + offset) * amplitude;
        card.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(bobCard);
      }

      requestAnimationFrame(bobCard);
    });


    /* ------------------------------------------------------------------
       12f. MAGNETIC BUTTONS — cursor attraction on hover
    ------------------------------------------------------------------ */
    const magnetBtns = hero.querySelectorAll('.js-magnetic');

    magnetBtns.forEach((btn) => {
      const STRENGTH = 0.35; // 0 = no pull, 1 = full cursor follow

      btn.addEventListener('mousemove', (e) => {
        const rect   = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const dx = (e.clientX - centerX) * STRENGTH;
        const dy = (e.clientY - centerY) * STRENGTH;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });


    /* ------------------------------------------------------------------
       12g. IMAGE LOAD — trigger the Ken-Burns zoom once image is decoded
    ------------------------------------------------------------------ */
    const heroImg = hero.querySelector('.hv2-frame__img');
    if (heroImg) {
      const applyZoom = () => heroImg.classList.add('is-loaded');
      if (heroImg.complete) {
        applyZoom();
      } else {
        heroImg.addEventListener('load', applyZoom, { once: true });
      }
    }

  })(); // end initHeroV2


  /* =========================================================================
     13. DYNAMIC DATA-PARALLAX SCROLL CONTROLLER
     ========================================================================= */
  (function initParallaxController() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    let ticking = false;

    function updateParallax() {
      const winHeight = window.innerHeight;

      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < winHeight) {
          const speed = parseFloat(el.getAttribute('data-speed')) || 0.4;
          const centerOffset = (rect.top + rect.height / 2) - (winHeight / 2);
          const yPos = centerOffset * speed * -0.4;
          el.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateParallax();
  })();

  /* =========================================================================
     13. SUB-PAGE HERO  — Shared animation system for all inner page heroes
     ========================================================================= */

  (function initSubPageHero() {

    const ph = document.querySelector('.ph');
    if (!ph) return;

    /* ------------------------------------------------------------------
       13a. Trigger entrance animations (add .is-ready on next two frames)
    ------------------------------------------------------------------ */
    requestAnimationFrame(() => requestAnimationFrame(() => ph.classList.add('is-ready')));


    /* ------------------------------------------------------------------
       13b. Lightweight particle canvas (shared with hero-v2 style)
    ------------------------------------------------------------------ */
    const canvas = ph.querySelector('.ph__canvas');

    if (canvas) {
      const ctx = canvas.getContext('2d');
      let W, H, pts;
      const COUNT    = 44;
      const MAX_DIST = 95;
      let mouse      = { x: -9999, y: -9999 };

      function resize() {
        W = canvas.width  = ph.offsetWidth;
        H = canvas.height = ph.offsetHeight;
      }

      function makePts() {
        pts = Array.from({ length: COUNT }, () => ({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r:  Math.random() * 1.4 + 0.5,
          a:  Math.random() * 0.4 + 0.1,
        }));
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);

        pts.forEach((p) => {
          // Mouse repel
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d  = Math.hypot(dx, dy);
          if (d < 90) {
            const f = (90 - d) / 90 * 0.01;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          // Speed cap
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 0.8) { p.vx *= 0.8 / spd; p.vy *= 0.8 / spd; }

          p.x = (p.x + p.vx + W) % W;
          p.y = (p.y + p.vy + H) % H;
        });

        // Connections
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < MAX_DIST) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,168,150,${(1 - d / MAX_DIST) * 0.16})`;
              ctx.lineWidth   = 0.7;
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }

        // Dots
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,200,180,${p.a})`;
          ctx.fill();
        });

        requestAnimationFrame(draw);
      }

      resize(); makePts(); draw();

      window.addEventListener('resize', () => { resize(); makePts(); }, { passive: true });
      ph.addEventListener('mousemove', (e) => {
        const r = ph.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      }, { passive: true });
      ph.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
    }


    /* ------------------------------------------------------------------
       13c. Floating card bob — sinusoidal per-card with phase offset
    ------------------------------------------------------------------ */
    const cards = ph.querySelectorAll('.ph__card');
    cards.forEach((card, i) => {
      const amp    = 5 + i * 1.5;
      const speed  = 0.9 + i * 0.15;
      const offset = i * (Math.PI * 0.7);
      let   t0     = null;

      function bob(ts) {
        if (!t0) t0 = ts;
        const dy = Math.sin(((ts - t0) / 1000) * speed + offset) * amp;
        card.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(bob);
      }

      requestAnimationFrame(bob);
    });


    /* ------------------------------------------------------------------
       13d. Parallax — bg layer moves slightly on scroll
    ------------------------------------------------------------------ */
    const bg = ph.querySelector('.ph__bg');
    if (bg) {
      function onScroll() {
        const rect = ph.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const pct = rect.top / window.innerHeight;
        bg.style.transform = `scale(1) translateY(${pct * 18}px)`;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

  })(); // end initSubPageHero

}); // end DOMContentLoaded
