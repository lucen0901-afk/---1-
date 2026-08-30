// Guangzhou Home Help - Main JavaScript

// Header scroll effect
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Mobile menu toggle
(function() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// FAQ accordion
(function() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(function(i) { i.classList.remove('open'); });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();

// Listing filter
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const listingCards = document.querySelectorAll('.listing-card');
  if (!filterBtns.length || !listingCards.length) return;

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Filter cards
      listingCards.forEach(function(card) {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// Contact form handling
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = form.querySelector('.form-success');
  const requiredFields = form.querySelectorAll('[required]');

  function validateFields() {
    let valid = true;
    requiredFields.forEach(function(field) {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--danger)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    return valid;
  }

  // Reset border on input
  requiredFields.forEach(function(field) {
    field.addEventListener('input', function() {
      field.style.borderColor = '';
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateFields()) return;

    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
      setTimeout(function() {
        successMsg.classList.remove('show');
      }, 6000);
    }
  });
})();

// Smooth scroll for anchor links
(function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
})();
