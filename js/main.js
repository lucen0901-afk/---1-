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

// Contact form handling — opens the visitor's email app with a pre-filled request
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const MAIL_TO = 'lucen0901@gmail.com';
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

  // 读取表单字段值；下拉框返回选项的可见文字
  function readField(id) {
    const el = form.querySelector('#' + id);
    if (!el) return '';
    if (el.tagName === 'SELECT') {
      const opt = el.options[el.selectedIndex];
      return el.value && opt ? opt.textContent.trim() : '';
    }
    return el.value.trim();
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateFields()) return;

    const name = readField('name');
    const service = readField('service');
    const subject = 'Service request' + (service ? ': ' + service : '') + (name ? ' — ' + name : '');

    const lines = [
      'New service request from the Guangzhou Home Help website',
      '',
      'Name:            ' + name,
      'Phone:           ' + readField('phone'),
      'Email:           ' + (readField('email') || '—'),
      'Service needed:  ' + (service || '—'),
      'District:        ' + (readField('area') || '—'),
      '',
      'Issue description:',
      readField('message') || '—',
      '',
      '---',
      'Sent from guangzhouhomehelp.top'
    ];

    // 交给访客本机的邮件客户端发送
    window.location.href = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\r\n'));

    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    }
  });
})();

// Copy-to-clipboard for handles without a web profile (WeChat ID)
(function() {
  const buttons = document.querySelectorAll('[data-copy]');
  if (!buttons.length) return;

  let toast = null;
  let toastTimer = null;

  function showToast(text) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    // 重新触发过渡动画
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2600);
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function done(ok, text) {
    showToast(ok ? 'Copied: ' + text : 'WeChat ID: ' + text);
  }

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function() { done(true, text); },
          function() { done(legacyCopy(text), text); }
        );
      } else {
        done(legacyCopy(text), text);
      }
    });
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
