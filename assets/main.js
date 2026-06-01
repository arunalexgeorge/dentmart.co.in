// Dentmart — simple interactions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.innerHTML = nav.classList.contains('open')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // ===== EMAILJS CONTACT FORM =====
  // Sign up at https://www.emailjs.com and replace the placeholders below:
  //   YOUR_PUBLIC_KEY   → Account > API Keys > Public Key
  //   YOUR_SERVICE_ID   → Email Services > your service ID (e.g. service_xxxxxxx)
  //   YOUR_TEMPLATE_ID  → Email Templates > your template ID (e.g. template_xxxxxxx)
  const EMAILJS_PUBLIC_KEY = 'HowN_jGHefazsuVwj';
  const EMAILJS_SERVICE_ID = 'service_v8a49o6';
  const EMAILJS_TEMPLATE_ID = 'template_4ajreij';

  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
          form.reset();
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = original;
            btn.style.background = '';
          }, 3500);
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed — Try Again';
          btn.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)';
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
          }, 3500);
        });
    });
  }

  // Smooth active link highlight on scroll (for single-page sections)
  const links = document.querySelectorAll('.nav a[href^="#"]');
  const sections = Array.from(links)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  // Before/After slider
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const beforeLayer = slider.querySelector('.ba-before-layer');
    const afterLayer = slider.querySelector('.ba-after-layer');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      beforeLayer.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      afterLayer.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    };

    slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });

    const stopDrag = () => { isDragging = false; };
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    const moveHandler = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler, { passive: true });
  });

  // ===== SCROLL REVEAL (IntersectionObserver) =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * ease) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  // ===== BACK TO TOP =====
  const backToTop = document.createElement('div');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(backToTop);

  const toggleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  // ===== STICKY HEADER SCROLL SHADOW =====
  const header = document.querySelector('.header');
  if (header) {
    const toggleHeaderShadow = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }
});
