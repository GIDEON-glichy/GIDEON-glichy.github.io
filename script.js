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
  
  // Lightbox Modal Elements
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // 1. Dynamic Footer Year
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Dark / Light Theme System with localStorage
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

  // 3. Mobile Navigation Drawer
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

  // 4. Project Filtering
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

  // 5. Accessible Image Lightbox Modal (<dialog>)
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

    // Support keyboard activation (Enter / Space) for accessible containers
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

  // 6. Copy Email to Clipboard with Toast Notification
  function showToast(message) {
    if (!toastNotification) return;
    const msgEl = document.getElementById('toastMessage');
    if (msgEl && message) msgEl.textContent = message;
    
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

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
        // Fallback for older browsers
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

  // 7. Contact Form Handler (Opens pre-filled email client)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.elements['name'].value.trim();
      const email = contactForm.elements['email'].value.trim();
      const message = contactForm.elements['message'].value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Generate mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const bodyText = encodeURIComponent(`Hi Gideon,\n\n${message}\n\nFrom: ${name} (${email})`);
      const mailtoUrl = `mailto:gideonkamanda49@gmail.com?subject=${subject}&body=${bodyText}`;

      formStatus.textContent = 'Opening your email client to send the message...';
      formStatus.className = 'form-status success';

      // Trigger mailto
      window.location.href = mailtoUrl;

      setTimeout(() => {
        contactForm.reset();
        formStatus.textContent = 'If your email client did not open, feel free to email directly at gideonkamanda49@gmail.com or message on WhatsApp.';
      }, 3000);
    });
  }
});
