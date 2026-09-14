/**
 * Gideon Kamanda — Portfolio JavaScript
 * Modern, Accessible & Dependency-Free
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const body = document.body;
  const currentYearEl = document.getElementById('currentYear');
  const themeButton = document.getElementById('themeButton');
  const menuButton = document.getElementById('menuButton');
  const navLinks = document.getElementById('navLinks');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotification = document.getElementById('toastNotification');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const dynamicTypedEl = document.getElementById('dynamicTyped');
  const cvButtons = document.querySelectorAll('.cv-btn');
  
  // Lightbox Modal Elements
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // 1. Dynamic Footer Year
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Dynamic Rotating Typewriter Effect
  if (dynamicTypedEl) {
    const phrases = [
      'Industrial IoT Systems',
      'Enterprise ERP Platforms',
      'High-Throughput Backends',
      'Automated Data Pipelines',
      'Distributed Systems'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function typeWriter() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        dynamicTypedEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        dynamicTypedEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 85;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at the end of word
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();
  }

  // 3. Dark / Light Theme System with localStorage
  const savedTheme = localStorage.getItem('gk_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  function applyTheme(isDark) {
    if (isDark) {
      body.classList.add('dark');
      themeButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      themeButton.setAttribute('aria-label', 'Switch to light mode');
    } else {
      body.classList.remove('dark');
      themeButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      themeButton.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Initialize theme
  const initialThemeIsDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  applyTheme(initialThemeIsDark);

  themeButton.addEventListener('click', () => {
    const isNowDark = !body.classList.contains('dark');
    applyTheme(isNowDark);
    localStorage.setItem('gk_theme', isNowDark ? 'dark' : 'light');
  });

  // 4. Mobile Navigation Drawer
  menuButton.addEventListener('click', () => {
    const isExpanded = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isExpanded));
  });

  // Close mobile drawer when clicking any link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  // 5. Project Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.dataset.filter;

      // Update active state on buttons
      filterButtons.forEach(b => b.classList.toggle('active', b === btn));

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        const matches = targetCategory === 'all' || categories.includes(targetCategory);
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  // 6. Accessible Image Lightbox Modal (<dialog>)
  function openImageModal(src, title) {
    if (!imageModal || !src) return;
    modalImg.src = src;
    modalImg.alt = title || 'Project Preview';
    modalTitle.textContent = title || 'Project Preview';
    imageModal.showModal();
  }

  function closeImageModal() {
    if (imageModal && imageModal.open) {
      imageModal.close();
      modalImg.src = '';
    }
  }

  // Attach lightbox trigger to media and preview buttons
  document.querySelectorAll('[data-img-src]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageModal(trigger.dataset.imgSrc, trigger.dataset.imgTitle);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openImageModal(trigger.dataset.imgSrc, trigger.dataset.imgTitle);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeImageModal);
  }

  // Close when clicking modal backdrop
  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      const rect = imageModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeImageModal();
      }
    });
  }

  // 7. Toast Notification Utility
  function showToast(message) {
    if (!toastNotification) return;
    const msgEl = document.getElementById('toastMessage');
    if (msgEl && message) msgEl.textContent = message;
    
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3500);
  }

  // 8. Copy Email to Clipboard
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'gideonkamanda49@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.textContent = 'Copied!';
        showToast('Email address copied to clipboard!');
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copy';
        }, 2500);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyEmailBtn.textContent = 'Copied!';
        showToast('Email address copied to clipboard!');
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copy';
        }, 2500);
      }
    });
  }

  // 9. CV Navigation Handling
  cvButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Opening official Curriculum Vitae...');
    });
  });

  // 10. Contact Form with In-Browser AJAX & Fallback
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = contactForm.elements['name'].value.trim();
      const email = contactForm.elements['email'].value.trim();
      const message = contactForm.elements['message'].value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'form-status error';
        return;
      }

      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending...';
      formStatus.textContent = 'Dispatching message...';
      formStatus.className = 'form-status';

      try {
        // Build mailto fallback url
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const bodyText = encodeURIComponent(`Hi Gideon,\n\n${message}\n\nFrom: ${name} (${email})`);
        const mailtoUrl = `mailto:gideonkamanda49@gmail.com?subject=${subject}&body=${bodyText}`;

        // Attempt submission or open email client
        window.location.href = mailtoUrl;

        formStatus.textContent = 'Thank you! Message client opened. You can also reach out directly via WhatsApp.';
        formStatus.className = 'form-status success';
        showToast('Message ready! Opening email client...');
        contactForm.reset();
      } catch (err) {
        formStatus.textContent = 'Error preparing message. Please email directly at gideonkamanda49@gmail.com';
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Send Message';
      }
    });
  }
});
