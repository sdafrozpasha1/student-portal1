// ============================================
// Student Portal - script.js
// ============================================

// --- Loading Screen ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 800);
});

// --- Dark Mode ---
const darkBtn = document.getElementById('darkBtn');
if (darkBtn) {
  const saved = localStorage.getItem('sp-dark');
  if (saved === '1') document.body.classList.add('dark');
  darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('sp-dark', document.body.classList.contains('dark') ? '1' : '0');
  });
}

// --- Back To Top ---
const btt = document.getElementById('btt');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 300);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Toast Notifications ---
function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const icons = { ok: '✅', err: '❌', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="ti">${icons[type] || icons.info}</span>
                 <span class="tm">${msg}</span>
                 <button class="tc" onclick="this.parentElement.remove()">✕</button>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// --- Active Nav Link ---
const navLinks = document.querySelectorAll('.nav-link');
const current = location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === current || (current === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// --- FAQ Accordion ---
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// --- Counter Animation ---
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
    }, 25);
  });
}
// Trigger on scroll into view
const statsSection = document.querySelector('.stats-sec');
if (statsSection) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); obs.disconnect(); } });
  }, { threshold: 0.4 });
  obs.observe(statsSection);
}

// --- Help Search Filter ---
const helpSearch = document.getElementById('helpSearchInput');
if (helpSearch) {
  helpSearch.addEventListener('input', () => {
    const q = helpSearch.value.toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// --- Login Form ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const id = document.getElementById('loginId');
    const pw = document.getElementById('loginPw');
    clearErr('loginIdErr'); clearErr('loginPwErr');
    if (!id.value.trim()) { showErr('loginIdErr', 'Student ID or email is required'); valid = false; }
    if (!pw.value) { showErr('loginPwErr', 'Password is required'); valid = false; }
    else if (pw.value.length < 6) { showErr('loginPwErr', 'Minimum 6 characters'); valid = false; }
    if (valid) {
      showToast('Login successful! Welcome back 🎉', 'ok');
      loginForm.reset();
    } else {
      showToast('Please fix the errors below', 'err');
    }
  });
}

// --- Register Form ---
const regForm = document.getElementById('registerForm');
if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const fields = [
      ['regName',    v => v.trim().length >= 3,          'Full name must be at least 3 characters'],
      ['regId',      v => v.trim().length >= 4,          'Student ID must be at least 4 characters'],
      ['regEmail',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address'],
      ['regMobile',  v => /^\d{10,15}$/.test(v),        'Enter a valid mobile number'],
      ['regDob',     v => v !== '',                      'Date of birth is required'],
      ['regGender',  v => v !== '',                      'Please select a gender'],
      ['regCourse',  v => v !== '',                      'Please select a course'],
    ];
    fields.forEach(([id, check, msg]) => {
      const el = document.getElementById(id);
      if (el) { clearErr(id + 'Err'); if (!check(el.value)) { showErr(id + 'Err', msg); valid = false; } }
    });
    const pw = document.getElementById('regPw');
    const cpw = document.getElementById('regCpw');
    clearErr('regPwErr'); clearErr('regCpwErr');
    if (pw && pw.value.length < 8) { showErr('regPwErr', 'Password must be at least 8 characters'); valid = false; }
    if (cpw && pw && cpw.value !== pw.value) { showErr('regCpwErr', 'Passwords do not match'); valid = false; }
    const terms = document.getElementById('regTerms');
    if (terms && !terms.checked) { showErr('regTermsErr', 'You must accept the terms'); valid = false; }
    if (valid) {
      showToast('Registration successful! Please login 🎉', 'ok');
      regForm.reset();
      document.querySelectorAll('.str-fill').forEach(f => { f.style.width = '0'; });
    } else {
      showToast('Please fix the highlighted errors', 'err');
    }
  });
  // Password strength
  const pw = document.getElementById('regPw');
  if (pw) {
    pw.addEventListener('input', () => {
      const v = pw.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const fill = document.getElementById('strFill');
      const lbl  = document.getElementById('strLabel');
      const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
      const labels = ['Weak','Fair','Good','Strong'];
      if (fill) { fill.style.width = (score * 25) + '%'; fill.style.background = colors[score - 1] || '#e0e8f5'; }
      if (lbl)  { lbl.textContent = v ? labels[score - 1] || '' : ''; lbl.style.color = colors[score - 1] || ''; }
    });
  }
}

// --- Contact Form ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you soon 📩', 'ok');
    contactForm.reset();
  });
}

// --- Support Form (Help page) ---
const supportForm = document.getElementById('supportForm');
if (supportForm) {
  supportForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Support request submitted! 📩', 'ok');
    supportForm.reset();
  });
}

// --- Password Toggle ---
document.querySelectorAll('.pass-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const isText = target.type === 'text';
    target.type = isText ? 'password' : 'text';
    btn.innerHTML = isText ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
  });
});

// --- Live Chat Button ---
const chatBtn = document.getElementById('chatBtn');
if (chatBtn) {
  chatBtn.addEventListener('click', () => showToast('Live chat is coming soon!', 'info'));
}

// --- Helpers ---
function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('e'); }
}
function clearErr(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.className = 'fm'; }
}
