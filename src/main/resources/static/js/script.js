/* ════════════════════════════════════════════
     JAVASCRIPT
     ════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
let backendVendors = [];

function getCategoryIcon(category) {

  const cat = (category || '').trim().toLowerCase();

  switch(cat) {

    case 'food':
      return 'fa-solid fa-utensils';

    case 'tailoring':
      return 'fa-solid fa-scissors';

    case 'repairs':
      return 'fa-solid fa-screwdriver-wrench';

    case 'tutors':
      return 'fa-solid fa-book-open';

    case 'dairy':
      return 'fa-solid fa-glass-water';

    case 'beauty':
      return 'fa-solid fa-spa';

    case 'auto':
      return 'fa-solid fa-car';

    default:
      return 'fa-solid fa-store';
  }
}

function normalizeVendor(v) {

  return {

    ...v,

    cat: v.cat || v.category || 'other',

    icon: v.icon || getCategoryIcon(v.category || v.cat),

    color: v.color || getCategoryColor(v.category || v.cat),

    distance: v.distance || 300,

    vouches: v.vouches || 0,

    recommendations: v.recommendations || 0,

    topStory: v.topStory || v.description || 'Trusted local business',

    topStoryBy: v.topStoryBy || 'Local Neighbour',

    open: v.open ?? true,

    verified: v.verified ?? false,

    trustScore: v.trustScore || 80,

    desc: v.desc || v.description || '',
  };
}

async function loadVendors() {

  try {

    const response = await fetch('/api/vendors');

    let data = await response.json();

    backendVendors = data.map(normalizeVendor);

    console.log("Backend Vendors:", backendVendors);

    renderHome();

    renderFeed();

    renderHomeSections();

  } catch (error) {

    console.error('Error loading vendors:', error);
  }
}

loadVendors();

function renderHomeSections() {

  renderTrendingStrip();

  renderCatGridHome();

}

const DATA = {
  categories: [
    {
      id: "food",
      label: "Home Food",
      icon: "fa-solid fa-utensils"
    },

    {
      id: "tailoring",
      label: "Tailoring",
      icon: "fa-solid fa-scissors"
    },

    {
      id: "repairs",
      label: "Repairs",
      icon: "fa-solid fa-screwdriver-wrench"
    },

    {
      id: "tutors",
      label: "Tutors",
      icon: "fa-solid fa-book-open"
    },

    {
      id: "dairy",
      label: "Dairy",
      icon: "fa-solid fa-glass-water"
    },

    {
      id: "beauty",
      label: "Beauty",
      icon: "fa-solid fa-spa"
    },

    {
      id: "auto",
      label: "Auto",
      icon: "fa-solid fa-car-side"
    },

    {
      id: "other",
      label: "Other",
      icon: "fa-solid fa-seedling"
    },
  ],
  users: [
    {
      id: 1,
      name: "Priya Sharma",
      handle: "priya.sharma",
      city: "Koramangala",
      color: "#C0392B",
      recs: 4,
      vouches: 7,
      score: 62
    }
  ],

  activity: [
    {
      user: "Ananya M.",
      col: "#C0392B",
      action: "recommended",
      biz: "Sunita's Tiffins",
      time: "2 min ago"
    },

    {
      user: "Kiran T.",
      col: "#1A4FA0",
      action: "vouched for",
      biz: "SK Hardware",
      time: "5 min ago"
    },

    {
      user: "Deepa S.",
      col: "#1E6645",
      action: "shared a story about",
      biz: "Ramu Tailor",
      time: "11 min ago"
    },

    {
      user: "Meera P.",
      col: "#D4A017",
      action: "recommended",
      biz: "Lakshmi Dairy",
      time: "18 min ago"
    },

    {
      user: "Rahul V.",
      col: "#6B4E35",
      action: "vouched for",
      biz: "Geetha Tutorials",
      time: "25 min ago"
    },

    {
      user: "Nisha A.",
      col: "#C0392B",
      action: "recommended",
      biz: "Priya Beauty Studio",
      time: "31 min ago"
    },
  ],
  contributors: [
    {
      name: "Ananya M.",
      area: "Koramangala",
      recs: 12,
      col: "#C0392B"
    },

    {
      name: "Kiran T.",
      area: "Indiranagar",
      recs: 9,
      col: "#1A4FA0"
    },

    {
      name: "Deepa S.",
      area: "Jayanagar",
      recs: 8,
      col: "#1E6645"
    },

    {
      name: "Meera P.",
      area: "HSR Layout",
      recs: 7,
      col: "#D4A017"
    },
  ]
};

/* ─────────────────────────────────────────────
APP STATE
───────────────────────────────────────────── */
const S = {
  page: 'home',

  user: null,

  vendorId: null,

  favs: new Set(
      JSON.parse(localStorage.getItem('ll4_favs') || '[]')
  ),

  rv: JSON.parse(
      localStorage.getItem('ll4_rv') || '[]'
  ),

  dark: localStorage.getItem('ll4_theme') === 'dark',

  feedFilter: {
    cat: 'all',
    trust: 'all',
    status: 'all',
    q: '',
    sort: 'trust'
  },

  recStep: 1,

  recData: {
    cat: '',
    name: '',
    location: '',
    phone: '',
    story: '',
    stars: 0,
    nb: true
  },

  reportReason: '',

  vouchVendorId: null,

  userTab: 'recs',
};
/* ─────────────────────────────────────────────
THEME
───────────────────────────────────────────── */
function toggleTheme() {

  S.dark = !S.dark;

  document.documentElement.setAttribute(
      'data-theme',
      S.dark ? 'dark' : 'light'
  );
  if (S.vendorId) {
    renderVendorProfile(S.vendorId);
  }

  localStorage.setItem(
      'll4_theme',
      S.dark ? 'dark' : 'light'
  );

  document.getElementById('theme-btn').innerHTML =
      S.dark
          ? '<i class="fa-solid fa-sun"></i>'
          : '<i class="fa-solid fa-moon"></i>';
}

if (S.dark) {

  document.documentElement.setAttribute('data-theme', 'dark');

  document.getElementById('theme-btn').innerHTML =
      '<i class="fa-solid fa-sun"></i>';
}
/* ─────────────────────────────────────────────
TOAST
───────────────────────────────────────────── */
function toast(msg, type = 'info', dur = 3200) {

  const icons = {
    info: 'fa-solid fa-circle-info',
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation'
  };

  const cls = {
    info: '',
    success: 'toast-s',
    error: 'toast-e',
    warning: 'toast-w'
  };

  const el = document.createElement('div');

  el.className = 'toast ' + cls[type];

  el.innerHTML =
      '<span><i class="' + icons[type] + '"></i></span>' +
      '<span>' + msg + '</span>' +
      '<button class="t-close" onclick="this.parentElement.remove()">×</button>';

  document.getElementById('toasts').appendChild(el);

  setTimeout(() => {

    el.style.animation = 'tOut .3s ease forwards';

    setTimeout(() => el.remove(), 300);

  }, dur);
}

/* ─────────────────────────────────────────────
MODAL
───────────────────────────────────────────── */

function openModal(id) {

  document.getElementById(id).classList.remove('hidden');

  document.body.style.overflow = 'hidden';
}

function closeModal(id) {

  document.getElementById(id).classList.add('hidden');

  document.body.style.overflow = '';
}

document.querySelectorAll('.overlay').forEach(o => {

  o.addEventListener('click', e => {

    if (e.target === o) closeModal(o.id);

  });

});

/* ─────────────────────────────────────────────
NAV & ROUTING
───────────────────────────────────────────── */

function go(pg, opts = {}) {

  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('on');
  });

  const el =
      document.getElementById('pg-' + pg) ||
      document.getElementById('pg-user-profile');

  if (!el) return;

  el.classList.add('on');

  S.page = pg;

  document.querySelectorAll('.nav-link').forEach(l => {

    l.classList.toggle('on', l.dataset.p === pg);

  });

  document.getElementById('swa').classList.toggle(
      'show',
      pg === 'profile' || pg === 'vendor'
  );

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  if (pg === 'home') renderHome();

  if (pg === 'feed') renderFeed();

  if (pg === 'profile') {
    renderVendorProfile(opts.id || S.vendorId);
  }

  if (pg === 'user-profile') {
    renderUserProfile();
  }

  if (pg === 'vendor') {
    renderVendorPage();
  }
}

function goProfile(id) {

  S.vendorId = id;

  go('profile', { id });

}

/* ─────────────────────────────────────────────
AUTH — FIXED: validates properly, no fake login
───────────────────────────────────────────── */

function switchAuth(mode) {

  const loginTab = document.getElementById('at-login');
  const signupTab = document.getElementById('at-signup');

  const loginForm = document.getElementById('auth-login');
  const signupForm = document.getElementById('auth-signup');

  if(mode === 'login') {

    loginTab.classList.add('on');
    signupTab.classList.remove('on');

    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');

  } else {

    signupTab.classList.add('on');
    loginTab.classList.remove('on');

    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function togglePwd(id, icon) {

  const i = document.getElementById(id);

  i.type = i.type === 'password'
      ? 'text'
      : 'password';

  icon.innerHTML =
      i.type === 'password'
          ? '<i class="fa-solid fa-eye"></i>'
          : '<i class="fa-solid fa-eye-slash"></i>';
}

function calcStrength(v) {

  const s =
      (v.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(v) ? 1 : 0) +
      (/[0-9]/.test(v) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(v) ? 1 : 0);

  const bar = document.getElementById('pstrength');

  const lbl = document.getElementById('pslabel');

  const colors = [
    '',
    '#C0392B',
    '#C0392B',
    '#D4A017',
    '#D4A017',
    '#1E6645'
  ];

  const labels = [
    '',
    'Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ];

  if (bar) {

    bar.style.width = (s * 25) + '%';

    bar.style.background =
        colors[s] || '#C0392B';
  }

  if (lbl) {

    lbl.textContent =
        labels[s] || '';
  }
}

async function doLogin() {

  const email = document.getElementById('l-email').value.trim();
  const password = document.getElementById('l-pass').value;

  if (!email || !password) {

    toast('Please enter email and password', 'error');
    return;
  }

  const btn = document.getElementById('login-btn');

  btn.disabled = true;
  btn.textContent = 'Signing In...';

  try {

    const response = await fetch('/api/auth/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {

      throw new Error('Invalid email or password');
    }

    const user = await response.json();

    S.user = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      handle: user.email.split('@')[0],
      city: user.city || 'India',
      color: '#E8651A',
      recs: 0,
      vouches: 0,
      score: 0
    };

    updateNavUser();

    closeModal('m-auth');

    sessionStorage.setItem(
        'll4_user',
        JSON.stringify(S.user)
    );

    toast(
        'Welcome back, ' + user.firstName + '!',
        'success'
    );

    document.getElementById('l-email').value = '';
    document.getElementById('l-pass').value = '';

  } catch (error) {

    console.error(error);

    toast(
        'Invalid email or password',
        'error'
    );

  } finally {

    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

async function doSignup() {

  const firstName =
      document.getElementById('s-fname').value.trim();

  const lastName =
      document.getElementById('s-lname').value.trim();

  const email =
      document.getElementById('s-email').value.trim();

  const password =
      document.getElementById('s-pass').value;

  const city =
      document.getElementById('s-city').value.trim();

  try {

    const response = await fetch('/api/auth/signup', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({

        firstName,
        lastName,
        email,
        password,
        city
      })
    });

    if (!response.ok) {

      throw new Error('Signup failed');
    }

    toast(
        'Account created successfully!',
        'success'
    );

    switchAuth('login');

  } catch (error) {

    console.error(error);

    toast(
        'Unable to create account',
        'error'
    );
  }
}

function socialAuth(provider) {

  toast(
      "Google and Phone authentication will be added in a future version.",
      "info"
  );

}
function updateNavUser() {

  const g = document.getElementById('nav-guest');

  const u = document.getElementById('nav-user');

  const av = document.getElementById('nav-av');

  if (S.user) {

    g.style.display = 'none';

    u.classList.remove('hidden');

    u.style.display = 'flex';

    av.textContent =
        S.user.name[0].toUpperCase();

    av.style.background =
        S.user.color || '#E8651A';

  } else {

    g.style.display = 'flex';

    u.classList.add('hidden');

    u.style.display = 'none';
  }
}

// Restore session

try {

  const saved =
      sessionStorage.getItem('ll4_user')

  if (saved) {

    S.user = JSON.parse(saved);

    updateNavUser();
  }

} catch (e) {

  localStorage.removeItem('ll4_user');
}

function doLogout() {

  S.user = null;

  updateNavUser();

  sessionStorage.removeItem('ll4_user');

  go('home');

  toast(
      'Signed out. See you again!',
      'info'
  );
}

/* ─────────────────────────────────────────────
RECOMMEND FLOW — FIXED: full reset after submit, no freezing
───────────────────────────────────────────── */

function openRecommend() {

  if (!S.user) {

    openModal('m-auth');

    return;
  }

  // Full reset of state and form
  S.recStep = 1;

  S.recData = {
    cat: '',
    name: '',
    location: '',
    phone: '',
    story: '',
    stars: 0,
    nb: true
  };

  // Reset form fields
  const fields = [
    'rec-biz-name',
    'rec-location',
    'rec-phone',
    'rec-story'
  ];

  fields.forEach(id => {

    const el = document.getElementById(id);

    if (el) el.value = '';

  });

  const nbCheck =
      document.getElementById('rec-nb');

  if (nbCheck) {

    nbCheck.checked = true;
  }

  // Re-enable submit button
  const postBtn =
      document.getElementById('post-rec-btn');

  if (postBtn) {

    postBtn.disabled = false;

    postBtn.innerHTML =
        '<i class="fa-solid fa-shop" style="margin-right:8px;"></i>Post Recommendation';
  }

  // Render UI
  renderRecSteps();

  renderRecCatGrid();

  renderRecStars();

  // Show step 1, hide others
  document.querySelectorAll('.rec-step-content')
      .forEach(c => c.classList.remove('on'));

  const step1 =
      document.getElementById('rs-1');

  if (step1) {

    step1.classList.add('on');
  }

  openModal('m-recommend');
}

function renderRecSteps() {

  const steps = [
    'Business',
    'Your Story',
    'Post'
  ];

  document.getElementById('rec-steps').innerHTML =
      steps.map((l, i) => {

        const n = i + 1;

        const done = n < S.recStep;

        const cur = n === S.recStep;

        return `
        <div class="rs-step">

          <div class="rs-dot ${done ? 'done' : cur ? 'cur' : ''}">

            ${done
            ? '✓'
            : n
        }

          </div>

          <span class="rs-lbl">${l}</span>

        </div>
      `;

      }).join('');
}



function renderRecCatGrid() {

  const grid =
      document.getElementById('rec-cat-grid');

  if (!grid) return;

  grid.innerHTML = DATA.categories.map(c =>

      '<div class="cat-sel ' +
      (S.recData.cat === c.id ? 'on' : '') +
      '" onclick="pickRecCat(\'' + c.id + '\',this)">' +

      '<div class="cat-emoji">' +
      '<i class="' + c.icon + '"></i>' +
      '</div>' +

      '<div class="cat-label">' +
      c.label +
      '</div>' +

      '</div>'

  ).join('');
}

function pickRecCat(id, el) {

  S.recData.cat = id;

  document.querySelectorAll('#rec-cat-grid .cat-sel')
      .forEach(c => c.classList.remove('on'));

  el.classList.add('on');
}

function renderRecStars() {

  const row =
      document.getElementById('rec-stars');

  if (!row) return;

  row.innerHTML = [1, 2, 3, 4, 5].map(n =>

      '<span class="star-b ' +
      (n <= S.recData.stars ? 'lit' : '') +
      '" onclick="pickRecStars(' + n + ')">' +

      '<i class="fa-solid fa-star"></i>' +

      '</span>'

  ).join('');
}

function pickRecStars(n) {

  S.recData.stars = n;

  renderRecStars();
}

function recNext(step) {

  if (step > S.recStep) {

    if (S.recStep === 1) {

      const name =
          document.getElementById('rec-biz-name')
              .value.trim();

      if (!S.recData.cat) {

        toast(
            'Please select a category',
            'error'
        );

        return;
      }

      if (!name) {

        toast(
            'Please enter the business name',
            'error'
        );

        return;
      }

      S.recData.name = name;

      S.recData.location =
          document.getElementById('rec-location')
              .value.trim();

      S.recData.phone =
          document.getElementById('rec-phone')
              .value.trim();
    }

    if (S.recStep === 2) {

      const story =
          document.getElementById('rec-story')
              .value.trim();

      if (story.length < 20) {

        toast(
            'Please share a story (at least 20 characters)',
            'error'
        );

        return;
      }

      if (!S.recData.stars) {

        toast(
            'Please rate your experience',
            'error'
        );

        return;
      }

      S.recData.story = story;

      buildRecPreview();
    }
  }

  document.querySelectorAll('.rec-step-content')
      .forEach(c => c.classList.remove('on'));

  const target =
      document.getElementById('rs-' + step);

  if (target) {

    target.classList.add('on');
  }

  S.recStep = step;

  renderRecSteps();
}
function buildRecPreview() {

  const cat =
      DATA.categories.find(c => c.id === S.recData.cat);

  const preview =
      document.getElementById('rec-preview');

  if (!preview) return;

  preview.innerHTML =

      '<div style="display:flex;gap:10px;align-items:flex-start">' +

      '<span style="font-size:28px">' +

      '<i class="' +
      (cat ? cat.icon : 'fa-solid fa-store') +
      '"></i>' +

      '</span>' +

      '<div style="flex:1">' +

      '<div style="font-family:var(--font-display);font-size:16px;font-weight:700;margin-bottom:4px">' +

      S.recData.name +

      '</div>' +

      '<div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">' +

      (S.recData.location || 'Location not specified') +

      ' · ' +

      '★'.repeat(S.recData.stars) +

      '</div>' +

      '<p style="font-family:var(--font-display);font-size:14px;font-style:italic;color:var(--text-secondary);line-height:1.65">"' +

      S.recData.story +

      '"</p>' +

      '<div style="margin-top:10px;font-size:12px;color:var(--text-muted)">' +

      '— ' + S.user.name + ', your neighbour' +

      '</div>' +

      '</div>' +

      '</div>';
}

async function submitRecommendation() {

  const vendorData = {

    name: document.getElementById('rec-biz-name').value,
    category: S.recData.cat,
    city: document.getElementById('rec-location').value,
    address: document.getElementById('rec-location').value,
    phone: document.getElementById('rec-phone').value,
    description: document.getElementById('rec-story').value
  };

  try {

    const response = await fetch('/api/vendors', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(vendorData)
    });

    const result = await response.json();

    console.log('Vendor Saved:', result);

    toast('Business recommendation added successfully!', 'success');

    closeModal('m-recommend');

    loadVendors();

  } catch (error) {

    console.error(error);

    toast('Error saving recommendation', 'error');
  }
}

/* ─────────────────────────────────────────────
VOUCH
───────────────────────────────────────────── */

function openVouch(vendorId) {

  if (!S.user) {

    openModal('m-auth');

    return;
  }

  S.vouchVendorId = vendorId;

  const v =
      backendVendors.find(x => x.id == vendorId);

  document.getElementById('vouch-vendor-name').textContent =
      v
          ? 'Vouching for: ' + v.name
          : 'Vouch';

  document.getElementById('vouch-note').value = '';

  document.getElementById('vouch-anon').checked = false;

  openModal('m-vouch');
}

function submitVouch() {

  const v =
      backendVendors.find(x => x.id == S.vouchVendorId);

  if (v) {

    v.vouches++;

    v.trustScore = Math.min(
        100,
        v.trustScore + 2
    );
  }

  if (S.user) {

    S.user.vouches =
        (S.user.vouches || 0) + 1;

    S.user.score =
        (S.user.score || 0) + 8;
  }

  const anon =
      document.getElementById('vouch-anon').checked;

  DATA.activity.unshift({

    user: anon ? 'Anonymous' : S.user.name,

    col: S.user.color,

    action: 'vouched for',

    biz: v ? v.name : 'a business',

    time: 'Just now'
  });

  closeModal('m-vouch');

  toast(
      'Vouch added! You\'ve strengthened your community\'s trust network.',
      'success'
  );

  if (S.page === 'profile') {

    renderVendorProfile(S.vendorId);
  }
}

/* ─────────────────────────────────────────────
   REPORT
───────────────────────────────────────────── */

function pickReport(el, reason) {

  S.reportReason = reason;

  document.querySelectorAll('#report-opts .cat-sel')
      .forEach(c => c.classList.remove('on'));

  el.classList.add('on');
}

function submitReport() {

  if (!S.reportReason) {

    toast(
        'Please select a reason',
        'error'
    );

    return;
  }

  document.getElementById('report-note').value = '';

  S.reportReason = '';

  document.querySelectorAll('#report-opts .cat-sel')
      .forEach(c => c.classList.remove('on'));

  closeModal('m-report');

  toast(
      'Report submitted. Our trust team will review it within 24 hours.',
      'success'
  );
}

/* ─────────────────────────────────────────────
   FAVOURITES & RECENTLY VIEWED
───────────────────────────────────────────── */

function toggleFav(id, el) {

  if (!S.user) {

    openModal('m-auth');

    return;
  }

  if (S.favs.has(id)) {

    S.favs.delete(id);

    if (el) {

      el.innerHTML =
          '<i class="fa-regular fa-heart"></i>';

      el.classList.remove('on');
    }

    toast(
        'Removed from saved',
        'info'
    );

  } else {

    S.favs.add(id);

    if (el) {

      el.innerHTML =
          '<i class="fa-solid fa-heart"></i>';

      el.classList.add('on');
    }

    toast(
        'Saved',
        'success'
    );
  }

  localStorage.setItem(
      'll4_favs',
      JSON.stringify([...S.favs])
  );
}

function addRV(id) {

  S.rv = [
    id,
    ...S.rv.filter(x => x !== id)
  ].slice(0, 8);

  localStorage.setItem(
      'll4_rv',
      JSON.stringify(S.rv)
  );
}

function clearRV() {

  S.rv = [];

  localStorage.setItem(
      'll4_rv',
      '[]'
  );

  renderRV();
}

/* ─────────────────────────────────────────────
   TRUST RING SVG
───────────────────────────────────────────── */

function trustRingHTML(score) {

  const r = 34;

  const c = 2 * Math.PI * r;

  const dash = (score / 100) * c;

  return (
      '<div class="trust-ring">' +

      '<svg viewBox="0 0 80 80" width="80" height="80">' +

      '<circle class="tr-track" cx="40" cy="40" r="' + r + '"/>' +

      '<circle class="tr-fill" cx="40" cy="40" r="' + r +
      '" stroke-dasharray="' + dash + ' ' + c + '"/>' +

      '</svg>' +

      '<div class="tr-text">' +

      '<div class="tr-num">' + score + '</div>' +

      '<div class="tr-lbl">TRUST</div>' +

      '</div>' +

      '</div>'
  );
}
/* ─────────────────────────────────────────────
HOME PAGE RENDER — V1 style with V3 data
───────────────────────────────────────────── */

function renderHome() {

  renderHeroMap();

  renderTrendingStrip();

  renderHomeRecGrid();

  renderHowItWorks();

  renderCatGridHome();

  renderRV();
}

function renderHeroMap() {

  const map =
      document.getElementById('hero-mini-map');

  if (!map) return;

  const roads = [

    {
      left: '30%',
      top: '0',
      width: '4px',
      height: '100%'
    },

    {
      left: '65%',
      top: '0',
      width: '4px',
      height: '100%'
    },

    {
      top: '40%',
      left: '0',
      width: '100%',
      height: '4px'
    },

    {
      top: '70%',
      left: '0',
      width: '100%',
      height: '4px'
    },

  ];

  const pins = backendVendors.slice(0,4).map((v, i) => {

    const positions = [

      { left: '18%', top: '25%' },

      { left: '55%', top: '15%' },

      { left: '75%', top: '55%' },

      { left: '35%', top: '60%' }

    ];

    const pos = positions[i];

    return (

        '<div class="map-pin-item" style="left:' +
        pos.left +
        ';top:' +
        pos.top +
        '" onclick="goProfile(' +
        v.id +
        ')">' +

        '<div class="map-pin-dot" style="background:var(--saffron)">' +

        '<span class="map-pin-emoji">' +

        '<i class="' + v.icon + '"></i>' +

        '</span>' +

        '</div>' +

        '<span class="map-pin-label">' +

        v.name.split(' ')[0] +

        '</span>' +

        '</div>'
    );

  });

  map.innerHTML =

      roads.map(r =>

          '<div class="mini-map-road" style="left:' +
          r.left +
          ';top:' +
          r.top +
          ';width:' +
          r.width +
          ';height:' +
          r.height +
          '"></div>'

      ).join('') +

      pins.join('');

  const scroll =
      document.getElementById('hero-vendor-scroll');

  if (!scroll) return;

  scroll.innerHTML = backendVendors.slice(0,4).map(v =>

      '<div class="vendor-mini-chip" onclick="goProfile(' +
      v.id +
      ')">' +

      (v.open
          ? '<i class="fa-solid fa-circle" style="color:#1E6645;font-size:10px"></i>'
          : '<i class="fa-solid fa-circle" style="color:#C0392B;font-size:10px"></i>') +

      ' <i class="' + v.icon + '"></i> ' +

      v.name.split(' ')[0] +

      '\'s</div>'

  ).join('');
}

function renderTrendingStrip() {

  const el =
      document.getElementById('trending-strip');

  if (!el) return;

  el.innerHTML =

      backendVendors
          .filter(v => v.trending === true).map(v =>

          '<div class="trend-pill hot" onclick="goProfile(' +
          v.id +
          ')">' +

          '<span class="tp-emoji">' +

          '<i class="' + v.icon + '"></i>' +

          '</span>' +

          '<div>' +

          '<div class="tp-name">' +

          v.name.split("'")[0] +

          '</div>' +

          '<div class="tp-count">' +

          v.vouches +
          ' vouches · ' +
          v.distance +
          'm' +

          '</div>' +

          '</div>' +

          '<span class="badge badge-saffron" style="font-size:10px">' +

          v.trustScore +

          '</span>' +

          '</div>'

      ).join('') +

      backendVendors
          .filter(v => !v.trending).map(v =>

          '<div class="trend-pill" onclick="goProfile(' +
          v.id +
          ')">' +

          '<span class="tp-emoji">' +

          '<i class="' + v.icon + '"></i>' +

          '</span>' +

          '<div>' +

          '<div class="tp-name">' +

          v.name.split("'")[0] +

          '</div>' +

          '<div class="tp-count">' +

          v.vouches +

          ' vouches' +

          '</div>' +

          '</div>' +

          '</div>'

      ).join('');
}

function renderHomeRecGrid() {

  const el =
      document.getElementById('home-rec-grid');

  if (!el) return;

  el.innerHTML = backendVendors
      .slice(0, 6)
      .map(v => storyCardHTML(v))
      .join('');
}

function storyCardHTML(v) {

  const fav = S.favs.has(v.id);

  return (

      '<div class="story-card" onclick="goProfile(' +
      v.id +
      ')">' +

      '<div class="sc-emoji-band" style="background:' +
      v.color +
      '">' +

      '<div class="sc-fav ' +
      (fav ? 'on' : '') +
      '" onclick="event.stopPropagation();toggleFav(' +
      v.id +
      ',this)">' +

      (
          fav
              ? '<i class="fa-solid fa-heart"></i>'
              : '<i class="fa-regular fa-heart"></i>'
      ) +

      '</div>' +

      '<span style="font-size:40px">' +

      '<i class="' + v.icon + '"></i>' +

      '</span>' +

      '<div class="sc-trust-ring">' +

      v.trustScore +

      '</div>' +

      '</div>' +

      '<div class="sc-body">' +

      '<div class="sc-meta">' +

      '<span class="badge ' +
      (v.open ? 'b-sage' : 'b-rust') +
      '">' +

      (v.open ? 'Open' : 'Closed') +

      '</span>' +

      (
          v.verified
              ? '<span class="badge b-cobalt">✓ Verified</span>'
              : ''
      ) +

      '<span class="badge b-ink">' +

      v.distance +

      'm</span>' +

      '</div>' +

      '<div class="sc-name">' +

      v.name +

      '</div>' +

      '<p class="sc-story">' +

      v.topStory +

      '</p>' +

      '<div class="sc-footer">' +

      '<div class="sc-by">' +

      '<div class="sc-by-av" style="background:' +
      DATA.activity[0].col +
      '">' +

      v.topStoryBy[0] +

      '</div>' +

      v.topStoryBy.split(',')[0] +

      '</div>' +

      '<div class="sc-vouches">' +

      '<i class="fa-solid fa-house-user"></i> ' +

      v.vouches +

      '</div>' +

      '</div>' +

      '</div>' +

      '</div>'
  );
}

function renderHowItWorks() {

  const el =
      document.getElementById('how-it-works');

  if (!el) return;

  const steps = [

    {
      n: '01',
      icon: 'fa-solid fa-bullhorn',
      title: 'Someone recommends',
      desc: 'A neighbour shares their honest story about a local business they genuinely trust.'
    },

    {
      n: '02',
      icon: 'fa-solid fa-house-user',
      title: 'Community vouches',
      desc: 'Others who know the business add their vouches. Trust grows organically through real people.'
    },

    {
      n: '03',
      icon: 'fa-solid fa-sparkles',
      title: 'Trust score rises',
      desc: 'Businesses emerge naturally based on community support — not paid listings or ads.'
    },

    {
      n: '04',
      icon: 'fa-solid fa-magnifying-glass',
      title: 'You discover with confidence',
      desc: 'Find the tailor, tiffin, tutor — through people who actually live in your neighbourhood.'
    },

  ];

  el.innerHTML = steps.map(s =>

      '<div style="border:1px solid var(--h-border-color);border-radius:var(--radius);padding:1.5rem">' +

      '<div style="font-size:26px;margin-bottom:.75rem">' +

      '<i class="' + s.icon + '"></i>' +

      '</div>' +

      '<div style="font-family:var(--font-display);font-size:40px;font-weight:900;color:var(--how-num-color);line-height:1;margin-bottom:.5rem">' +

      s.n +

      '</div>' +

      '<div style="font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--cream);margin-bottom:.5rem">' +

      s.title +

      '</div>' +

      '<p style="font-size:13.5px;color:var(--how-p);line-height:1.65">' +

      s.desc +

      '</p>' +

      '</div>'

  ).join('');
}

function renderCatGridHome() {

  const el = document.getElementById('cat-grid-home');

  if (!el) return;

  el.innerHTML = DATA.categories.map(c => {

    const count = backendVendors.filter(v =>
        (v.cat || v.category) === c.id
    ).length;

    return `

      <div class="card card-hover"
           style="text-align:center;cursor:pointer;padding:1rem .75rem"
           onclick="goFeedCat('${c.id}')">

        <div style="font-size:26px;margin-bottom:6px">
          <i class="${c.icon}"></i>
        </div>

        <div style="font-size:13px;font-weight:700;color:var(--text-primary)">
          ${c.label}
        </div>

        <div class="cat-count"
             style="font-size:11px;color:var(--text-muted);margin-top:3px">

          ${count} recommended

        </div>

      </div>
    `;

  }).join('');
}

function renderRV() {

  const sec =
      document.getElementById('rv-section');

  const list =
      document.getElementById('rv-list');

  if (!sec || !list) return;

  if (!S.rv.length) {

    sec.style.display = 'none';

    return;
  }

  sec.style.display = 'block';

  list.innerHTML = S.rv.slice(0, 5).map(id => {

    const v =
        backendVendors.find(x => x.id == id);

    if (!v) return '';

    return (

        '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="goProfile(' +
        v.id +
        ')">' +

        '<span style="font-size:20px">' +

        '<i class="' + v.icon + '"></i>' +

        '</span>' +

        '<div style="flex:1">' +

        '<div style="font-weight:600;font-size:13px">' +

        v.name +

        '</div>' +

        '<div style="font-size:12px;color:var(--text-muted)">' +

        v.cat +

        ' · Trust ' +

        v.trustScore +

        '</div>' +

        '</div>' +

        '<span class="badge ' +
        (v.open ? 'b-sage' : 'b-rust') +
        '">' +

        (v.open ? 'Open' : 'Closed') +

        '</span>' +

        '</div>'
    );

  }).join('');
}
/* ─────────────────────────────────────────────
HERO SEARCH
───────────────────────────────────────────── */

function heroSearchInput(val) {

  // Visual feedback — could expand with live suggestions
}

function doHeroSearch() {

  const q =
      document.getElementById('hero-search-input')
          .value.trim();

  if (!q) return;

  S.feedFilter.q = q;

  go('feed');
}

function goFeedCat(cat) {

  S.feedFilter.cat = cat;

  go('feed');
}

/* ─────────────────────────────────────────────
   FEED PAGE
───────────────────────────────────────────── */

function renderFeed() {

  renderFeedCatChips();

  applyFeedFilters();

  renderFeedRight();
}

function renderFeedCatChips() {

  const el =
      document.getElementById('feed-cat-chips');

  if (!el) return;

  el.innerHTML =

      '<span class="chip ' +
      (S.feedFilter.cat === 'all' ? 'on' : '') +
      '" onclick="setFeedCat(this,\'all\')">' +

      'All' +

      '</span>' +

      DATA.categories.map(c =>

          '<span class="chip ' +
          (S.feedFilter.cat === c.id ? 'on' : '') +
          '" onclick="setFeedCat(this,\'' +
          c.id +
          '\')">' +

          '<i class="' + c.icon + '" style="margin-right:6px;"></i>' +

          c.label +

          '</span>'

      ).join('');
}

function setFeedCat(el, cat) {

  S.feedFilter.cat = cat;

  document.querySelectorAll('#feed-cat-chips .chip')
      .forEach(c => c.classList.remove('on'));

  el.classList.add('on');

  applyFeedFilters();
}

function filterTrust(el, v) {

  S.feedFilter.trust = v;

  document.querySelectorAll('[data-trust]')
      .forEach(c => c.classList.remove('on'));

  el.classList.add('on');

  applyFeedFilters();
}

function filterStatus(el, v) {

  S.feedFilter.status = v;

  document.querySelectorAll('[data-status]')
      .forEach(c => c.classList.remove('on'));

  el.classList.add('on');

  applyFeedFilters();
}

function feedSearch(q) {

  S.feedFilter.q = q;

  applyFeedFilters();
}

function sortFeed(v) {

  S.feedFilter.sort = v;

  applyFeedFilters();
}

function applyFeedFilters() {

  let list = [...backendVendors];

  const {
    cat,
    trust,
    status,
    q,
    sort
  } = S.feedFilter;

  if (cat !== 'all') {

    list = list.filter(v =>
        (v.cat || v.category) === cat
    );
  }

  if (trust === 'high') {

    list = list.filter(v => v.trustScore >= 85);
  }

  if (trust === 'verified') {

    list = list.filter(v => v.verified);
  }

  if (status === 'open') {

    list = list.filter(v => v.open);
  }

  if (q) {

    list = list.filter(v =>

        v.name.toLowerCase().includes(q.toLowerCase()) ||

        (v.cat || '').includes(q.toLowerCase()) ||

        (v.topStory || '')
            .toLowerCase()
            .includes(q.toLowerCase())
    );
  }

  if (sort === 'trust') {

    list.sort((a, b) =>
        b.trustScore - a.trustScore
    );
  }

  if (sort === 'recent') {

    list.sort(() => Math.random() - .5);
  }

  if (sort === 'vouches') {

    list.sort((a, b) =>
        b.vouches - a.vouches
    );
  }

  if (sort === 'distance') {

    list.sort((a, b) =>
        a.distance - b.distance
    );
  }

  renderRecFeed(list);
}

function renderRecFeed(list) {

  const el = document.getElementById('rec-feed');

  const cnt = document.getElementById('feed-count');

  if (!el) return;

  if (cnt) {
    cnt.textContent = list.length;
  }

  if (!list.length) {

    el.innerHTML = '<div class="empty">No recommendations found</div>';

    return;
  }

  el.innerHTML = list.map(v => {

    v.icon = v.icon || 'fa-solid fa-store';
    v.color = v.color || '#FAE9DC';
    v.distance = v.distance || 300;
    v.vouches = v.vouches || 0;
    v.recommendations = v.recommendations || 0;
    v.topStory = v.topStory || v.description;
    v.topStoryBy = v.topStoryBy || 'Local Neighbour';
    v.cat = v.cat || v.category;

    return (

        '<div class="rec-card" onclick="goProfile(' +
        v.id +
        ')">' +

        '<div class="rc-top">' +

        '<div class="rc-emoji" style="background:' +
        v.color +
        '">' +

        '<i class="' + v.icon + '"></i>' +

        '</div>' +

        '<div style="flex:1">' +

        '<div class="rc-title">' +
        v.name +
        '</div>' +

        '<div class="rc-cat">' +

        v.cat +
        ' · ' +

        v.distance +
        'm away ' +

        '<span class="badge ' +
        (v.open ? 'b-sage' : 'b-rust') +
        '">' +

        (v.open ? 'Open' : 'Closed') +

        '</span>' +

        (
            v.verified
                ? '<span class="badge b-cobalt">✓ Verified</span>'
                : ''
        ) +

        '</div>' +

        '</div>' +

        trustRingHTML(v.trustScore) +

        '</div>' +

        '<p class="rc-story">' +
        v.topStory +
        '</p>' +

        '<div class="rc-bottom">' +

        '<div class="rc-recommender">' +

        '<div class="rc-av" style="background:#C0392B">' +

        v.topStoryBy[0] +

        '</div>' +

        '<span>' +
        'Recommended by <strong>' +
        v.topStoryBy +
        '</strong>' +
        '</span>' +

        '</div>' +

        '<div class="rc-stats">' +

        '<div class="rc-stat">' +
        '<span style="color:var(--green)">' +
        '<i class="fa-solid fa-house-user"></i>' +
        '</span> ' +
        v.vouches +
        ' vouches' +
        '</div>' +

        '<div class="rc-stat">' +
        '<span style="color:var(--saffron)">' +
        '<i class="fa-solid fa-bullhorn"></i>' +
        '</span> ' +
        v.recommendations +
        ' recs' +
        '</div>' +

        '</div>' +

        '</div>' +

        '</div>'
    );

  }).join('');
}

function renderFeedRight() {

  const fp =
      document.getElementById('fp-trending');

  if (fp) {

    fp.innerHTML = backendVendors
        .filter(v => v.trending)
        .slice(0, 4)
        .map(v =>

            '<div class="mini-activity-item" style="cursor:pointer" onclick="goProfile(' +
            v.id +
            ')">' +

            '<span style="font-size:16px">' +

            '<i class="' + v.icon + '"></i>' +

            '</span>' +

            '<div style="flex:1">' +

            '<div style="font-weight:600;font-size:12.5px">' +

            v.name +

            '</div>' +

            '<div style="font-size:11px;color:var(--text-muted)">' +

            'Trust ' +

            v.trustScore +

            ' · ' +

            v.vouches +

            ' vouches' +

            '</div>' +

            '</div>' +

            '</div>'

        ).join('');
  }

  const fc =
      document.getElementById('fp-contributors');

  if (fc) {

    fc.innerHTML = DATA.contributors.map(c =>

        '<div class="top-contributor">' +

        '<div class="mav" style="background:' +
        c.col +
        '">' +

        c.name[0] +

        '</div>' +

        '<div>' +

        '<div class="tc-name">' +

        c.name +

        '</div>' +

        '<div style="font-size:11px;color:var(--text-muted)">' +

        c.area +

        '</div>' +

        '</div>' +

        '<div class="tc-count">' +

        c.recs +

        ' recs' +

        '</div>' +

        '</div>'

    ).join('');
  }

  const fa =
      document.getElementById('fp-activity');

  if (fa) {

    fa.innerHTML = DATA.activity
        .slice(0, 5)
        .map(a =>

            '<div class="mini-activity-item">' +

            '<div class="mav" style="background:' +
            a.col +
            '">' +

            a.user[0] +

            '</div>' +

            '<div style="flex:1">' +

            '<div style="font-size:12px;color:var(--text-secondary)">' +

            '<strong>' + a.user + '</strong> ' +

            a.action +

            ' <em>' +

            a.biz +

            '</em>' +

            '</div>' +

            '<div style="font-size:10.5px;color:var(--text-muted)">' +

            a.time +

            '</div>' +

            '</div>' +

            '</div>'

        ).join('');
  }
}
/* ─────────────────────────────────────────────
   VENDOR PROFILE PAGE
───────────────────────────────────────────── */

function renderVendorProfile(id) {

  const v =
      backendVendors.find(x => x.id == id);

  if (!v) {

    go('feed');

    return;
  }

  S.vendorId = v.id;

  addRV(v.id);

  document.getElementById('swa')
      .classList.add('show');

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const heroBg = isDark
      ? 'linear-gradient(145deg, #1A0F08 0%, #2C160B 60%, #4A250F 100%)'
      : 'linear-gradient(145deg, #F8F3EB 0%, #F4EBDD 60%, #F8E1CF 100%)';

  const glassBtn = isDark
      ? 'background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.2)'
      : 'background:rgba(255,255,255,.58);color:#2C1F0F;border:1.5px solid #EDE5D8;backdrop-filter:saturate(1.1) blur(10px)';


  document.getElementById('vp-hero').style.background = 'none';

  requestAnimationFrame(() => {
    document.getElementById('vp-hero').style.background = heroBg;
  });

  document.getElementById('vp-hero-content').innerHTML =

      '<div class="vp-emoji-lg">' +

      '<i class="' + v.icon + '"></i>' +

      '</div>' +

      '<div class="vp-name">' +

      v.name +

      '</div>' +

      '<div class="vp-cat">' +

      '<span>' + v.cat + '</span> · ' +

      '<span>' +
      v.address +
      ', ' +
      v.city +
      '</span>' +

      (
          v.verified

              ? '<span class="badge b-cobalt" style="background:rgba(26,79,160,.3);color:rgba(255,255,255,.9)">✓ Verified</span>'

              : ''
      ) +

      '<span class="badge ' +
      (v.open ? 'b-sage' : 'b-rust') +
      '" style="' +

      (
          v.open

              ? 'background:rgba(30,102,69,.4);color:rgba(200,240,220,.9)'

              : 'background:rgba(192,57,43,.4);color:rgba(255,200,180,.9)'
      ) +

      '">' +

      (
          v.open

              ? '<i class="fa-solid fa-circle" style="color:#8FF0B5;font-size:10px;margin-right:6px;"></i>Open'

              : '<i class="fa-solid fa-circle" style="color:#FFB4A2;font-size:10px;margin-right:6px;"></i>Closed'
      ) +

      '</span>' +

      '</div>' +

      '<div class="vp-actions-hero">' +

      '<button class="btn btn-wa btn-sm" onclick="openWA(' +
      v.id +
      ')">' +

      '<i class="fa-brands fa-whatsapp" style="margin-right:8px;"></i>' +

      'WhatsApp' +

      '</button>' +

      '<button class="btn btn-sm" style="' + glassBtn + '" onclick="openVouch(' +
      v.id +
      ')">' +

      '<i class="fa-solid fa-house-user" style="margin-right:8px;"></i>' +

      'Add Vouch' +

      '</button>' +

      '<button class="btn btn-sm" style="' + glassBtn + '" onclick="toggleFav(' +
      v.id +
      ')">' +

      '<i class="fa-solid fa-heart" style="margin-right:8px;"></i>' +

      'Save' +

      '</button>' +

      '<button class="btn btn-sm" style="' + glassBtn + '" onclick="openModal(\'m-report\')">' +

      '<i class="fa-solid fa-triangle-exclamation"></i>' +

      '</button>' +

      '</div>';

  document.getElementById('vp-trust-band').innerHTML =

      trustRingHTML(v.trustScore) +

      '<div class="vtb-div"></div>' +

      '<div class="vtb-stat">' +

      '<div class="vtb-num">' +

      v.vouches +

      '</div>' +

      '<div class="vtb-lbl">' +

      'Neighbour Vouches' +

      '</div>' +

      '</div>' +

      '<div class="vtb-div"></div>' +

      '<div class="vtb-stat">' +

      '<div class="vtb-num">' +

      v.recommendations +

      '</div>' +

      '<div class="vtb-lbl">' +

      'Recommendations' +

      '</div>' +

      '</div>' +

      '<div class="vtb-div"></div>' +

      '<div class="vtb-stat">' +

      '<div class="vtb-num">' +

      v.distance + 'm' +

      '</div>' +

      '<div class="vtb-lbl">' +

      'From You' +

      '</div>' +

      '</div>' +

      '<div class="vtb-div"></div>' +

      '<div class="vtb-stat">' +

      '<div class="vtb-num">' +

      (v.open ? 'Open' : 'Closed') +

      '</div>' +

      '<div class="vtb-lbl">' +

      'Status' +

      '</div>' +

      '</div>' +

      '<div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +

      (

          !v.claimed

              ? '<button class="btn btn-secondary btn-sm" onclick="toast(\'Claim flow: verify ownership to manage this profile\',\'info\')">' +

              '<i class="fa-solid fa-store" style="margin-right:8px;"></i>' +

              'Claim Profile' +

              '</button>'

              : '<span class="badge b-sage">✓ Claimed</span>'
      ) +

      '<button class="btn btn-primary btn-sm" onclick="openRecommend()">' +

      '<i class="fa-solid fa-bullhorn" style="margin-right:8px;"></i>' +

      'Recommend' +

      '</button>' +

      '</div>';

  document.getElementById('vp-body').innerHTML =

      '<div class="vp-main">' +

      '<div class="tab-strip" id="vp-tabs">' +

      '<button class="tab-b on" onclick="switchVPTab(\'stories\')">' +

      'Community Stories' +

      '</button>' +

      '<button class="tab-b" onclick="switchVPTab(\'services\')">' +

      'Services' +

      '</button>' +

      '<button class="tab-b" onclick="switchVPTab(\'vouches\')">' +

      'Vouches' +

      '</button>' +

      '<button class="tab-b" onclick="switchVPTab(\'info\')">' +

      'Info' +

      '</button>' +

      '</div>' +

      '<div class="tab-c on" id="vp-stories">' +

      buildVPStories(v) +

      '</div>' +

      '<div class="tab-c" id="vp-services">' +

      buildVPServices(v) +

      '</div>' +

      '<div class="tab-c" id="vp-vouches">' +

      buildVPVouches(v) +

      '</div>' +

      '<div class="tab-c" id="vp-info">' +

      buildVPInfo(v) +

      '</div>' +

      '</div>' +

      '<div class="vp-side" id="vp-side">' +

      buildVPSide(v) +

      '</div>';
}
function switchVPTab(tab) {

  const tabs = [
    'stories',
    'services',
    'vouches',
    'info'
  ];

  document.querySelectorAll('#vp-tabs .tab-b')
      .forEach((b, i) =>
          b.classList.toggle('on', tabs[i] === tab)
      );

  document.querySelectorAll('#pg-profile .tab-c')
      .forEach(c => c.classList.remove('on'));

  const target =
      document.getElementById('vp-' + tab);

  if (target) {

    target.classList.add('on');
  }
}

function buildVPStories(v) {

  const extra = [

    {
      q: 'I\'d been looking for a good ' +
          v.cat +
          ' for months. Found this through a neighbour\'s recommendation and haven\'t looked elsewhere since.',
      by: 'A local customer',
      stars: 5
    },

    {
      q: 'Honestly the most reliable ' +
          v.cat +
          ' in this area. If someone in my family needs it, this is who I send them to.',
      by: 'Regular customer',
      stars: 5
    },

  ];

  return (

      '<div class="community-story-block">' +

      '<div class="csb-label">' +

      '<i class="fa-solid fa-star" style="margin-right:6px;"></i>' +

      'Top Community Story' +

      '</div>' +

      '<div class="csb-quote">' +

      '"' + v.topStory + '"' +

      '</div>' +

      '<div class="csb-author">' +

      '<div class="vouch-av" style="background:' +
      DATA.activity[0].col +
      ';width:24px;height:24px;font-size:10px">' +

      v.topStoryBy[0] +

      '</div>' +

      v.topStoryBy +

      '</div>' +

      '</div>' +

      extra.map(s =>

          '<div class="story-tile">' +

          '<div class="st-quote">' +

          '"' + s.q + '"' +

          '</div>' +

          '<div class="st-footer">' +

          '<span style="color:var(--gold)">★★★★★</span>' +

          '<span class="st-helpful" onclick="toast(\'Marked as helpful ✓\',\'success\')">' +

          '<i class="fa-solid fa-thumbs-up" style="margin-right:5px;"></i>' +

          'Helpful' +

          '</span>' +

          '</div>' +

          '</div>'

      ).join('') +

      '<button class="btn btn-primary btn-sm" style="margin-top:1rem" onclick="openRecommend()">' +

      '<i class="fa-solid fa-bullhorn" style="margin-right:8px;"></i>' +

      'Add Your Recommendation' +

      '</button>'
  );
}

function buildVPServices(v) {

  if (!v.services || !v.services.length) {

    return (
        '<div class="empty">' +

        '<div class="empty-icon">' +

        '<i class="fa-solid fa-clipboard-list"></i>' +

        '</div>' +

        '<div class="empty-title">' +

        'No services listed yet' +

        '</div>' +

        '</div>'
    );
  }

  return (

      '<div class="section-heading">' +

      'Services & Pricing' +

      '</div>' +

      v.services.map(s =>

          '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px">' +

          '<span style="font-weight:600;color:var(--text-primary)">' +

          s.n +

          '</span>' +

          '<span style="font-weight:700;color:var(--saffron)">' +

          s.p +

          '</span>' +

          '</div>'

      ).join('') +

      '<div style="background:var(--saffron-light);border-radius:var(--radius-sm);padding:12px;margin-top:.75rem;font-size:13px;color:var(--earth-mid)">' +

      '<i class="fa-solid fa-lightbulb" style="margin-right:6px;"></i>' +

      'Prices may vary. WhatsApp for custom quotes.' +

      '</div>'
  );
}

function buildVPVouches(v) {

  const vouchNames = [
    'Ananya M.',
    'Kiran T.',
    'Deepa S.',
    'Meera P.',
    'Rahul V.',
    'Nisha A.'
  ];

  const vouchColors = [
    '#C0392B',
    '#1A4FA0',
    '#1E6645',
    '#D4A017',
    '#6B4E35',
    '#C0392B'
  ];

  const areas = [
    '5th Block',
    'Indiranagar',
    'Jayanagar',
    'HSR Layout',
    'Koramangala',
    'Sarjapur'
  ];

  const shown =
      Math.min(v.vouches, vouchNames.length);

  return (

      '<div class="vouch-wall">' +

      vouchNames.slice(0, shown).map((name, i) =>

          '<div class="vouch-item">' +

          '<div class="vouch-av" style="background:' +
          vouchColors[i] +
          '">' +

          name[0] +

          '</div>' +

          '<div>' +

          '<div style="font-weight:600;font-size:13px;color:var(--text-primary)">' +

          name +

          '</div>' +

          '<div style="font-size:11px;color:var(--text-muted)">' +

          areas[i] +

          ' · Neighbour' +

          '</div>' +

          '</div>' +

          '<span style="margin-left:auto;font-size:18px">' +

          '✓' +

          '</span>' +

          '</div>'

      ).join('') +

      (
          v.vouches > shown

              ? '<div style="font-size:12px;color:var(--saffron);font-weight:600;cursor:pointer;padding:8px 0" onclick="toast(\'Showing all ' +
              v.vouches +
              ' vouches...\',\'info\')">' +

              '+ ' +

              (v.vouches - shown) +

              ' more neighbours →' +

              '</div>'

              : ''
      ) +

      '</div>' +

      '<button class="add-vouch-btn" onclick="openVouch(' +
      v.id +
      ')">' +

      '+ Add Your Vouch' +

      '</button>'
  );
}

function buildVPInfo(v) {

  const hoursHTML =
      Object.entries(v.hours || {}).map(([day, time]) =>

          '<div class="hours-row">' +

          '<span style="font-weight:600;color:var(--text-secondary)">' +

          day +

          '</span>' +

          '<span class="' +
          (time === 'Closed' ? 'h-closed' : '') +
          '" style="color:' +
          (time === 'Closed'
              ? 'var(--red)'
              : 'var(--text-primary)') +
          '">' +

          time +

          '</span>' +

          '</div>'

      ).join('');

  return (

      '<div class="section-heading">' +

      'About' +

      '</div>' +

      '<p style="font-size:14px;color:var(--text-secondary);line-height:1.75;margin-bottom:1.5rem">' +

      v.desc +

      '</p>' +

      '<div class="section-heading">' +

      'Contact' +

      '</div>' +

      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1.5rem">' +

      '<button class="btn btn-wa btn-sm" onclick="openWA(' +
      v.id +
      ')">' +

      '<i class="fa-brands fa-whatsapp" style="margin-right:8px;"></i>' +

      'WhatsApp' +

      '</button>' +

      '<button class="btn btn-secondary btn-sm" onclick="toast(\'Calling ' +
      v.phone +
      '...\',\'info\')">' +

      '<i class="fa-solid fa-phone" style="margin-right:8px;"></i>' +

      'Call' +

      '</button>' +

      '<button class="btn btn-secondary btn-sm" onclick="toast(\'Sharing profile...\',\'info\')">' +

      '<i class="fa-solid fa-share-nodes" style="margin-right:8px;"></i>' +

      'Share' +

      '</button>' +

      '</div>' +

      (
          hoursHTML

              ? '<div class="section-heading" style="margin-top:1.5rem">' +

              'Business Hours' +

              '</div>' +

              hoursHTML

              : ''
      )
  );
}

function buildVPSide(v) {

  return (

      '<div class="side-card">' +

      '<div class="side-card-title">' +

      '<i class="fa-solid fa-location-dot" style="margin-right:8px;"></i>' +

      'Location' +

      '</div>' +

      '<div style="background:var(--cream-dark);border-radius:var(--radius-sm);height:80px;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem;font-size:32px">' +

      '<i class="fa-solid fa-map-location-dot"></i>' +

      '</div>' +

      '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6">' +

      v.address +

      '<br>' +

      v.city +

      '</div>' +

      '<div style="margin-top:.75rem;font-weight:700;color:var(--saffron);font-size:13px">' +

      v.distance +

      'm from your location' +

      '</div>' +

      '</div>' +

      '<div class="side-card">' +

      '<div class="side-card-title">' +

      'Trust Network' +

      '</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +

      [
        ['fa-solid fa-star', 'Trust', v.trustScore + '/100'],
        ['fa-solid fa-comments', 'Vouches', v.vouches],
        ['fa-solid fa-bullhorn', 'Recs', v.recommendations],
        ['fa-solid fa-location-dot', 'Distance', v.distance + 'm']
      ].map(([icon, label, val]) =>

          '<div style="background:var(--cream);border-radius:var(--radius-sm);padding:10px;text-align:center">' +

          '<div style="font-size:18px;margin-bottom:3px">' +

          '<i class="' + icon + '"></i>' +

          '</div>' +

          '<div style="font-family:var(--font-display);font-size:16px;font-weight:900;color:var(--saffron)">' +

          val +

          '</div>' +

          '<div style="font-size:10px;color:var(--text-muted)">' +

          label +

          '</div>' +

          '</div>'

      ).join('') +

      '</div>' +

      '</div>' +

      '<button class="btn btn-primary w-full" style="width:100%;margin-top:.5rem" onclick="openVouch(' +
      v.id +
      ')">' +

      '<i class="fa-solid fa-house-user" style="margin-right:8px;"></i>' +

      'Add Your Vouch' +

      '</button>' +

      '<button class="btn btn-secondary w-full" style="width:100%;margin-top:8px" onclick="openRecommend()">' +

      '<i class="fa-solid fa-bullhorn" style="margin-right:8px;"></i>' +

      'Recommend This' +

      '</button>'
  );
}

/* ─────────────────────────────────────────────
USER PROFILE — FIXED: requires auth, proper state
───────────────────────────────────────────── */

function renderUserProfile() {

  if (!S.user) {

    // Redirect to home and prompt login — don't show broken profile
    closeModal('m-auth');

    openModal('m-auth');

    return;
  }

  const u = S.user;

  const upHero =
      document.getElementById('up-hero');

  if (!upHero) return;

  upHero.innerHTML =

      '<div class="up-av" style="background:' +
      (u.color || '#E8651A') +
      '">' +

      (
          u.name
              ? u.name[0].toUpperCase()
              : '?'
      ) +

      '</div>' +

      '<div style="flex:1;position:relative;z-index:1">' +

      '<div class="up-name">' +

      (u.name || 'LocalLift Member') +

      '</div>' +

      '<div class="up-handle">' +

      '@' +

      (u.handle || 'member') +

      ' · ' +

      (u.city || 'India') +

      '</div>' +

      '<div class="up-stats">' +

      '<div>' +

      '<div class="up-stat-num">' +

      (u.recs || 0) +

      '</div>' +

      '<div class="up-stat-lbl">' +

      'Recommendations' +

      '</div>' +

      '</div>' +

      '<div>' +

      '<div class="up-stat-num">' +

      (u.vouches || 0) +

      '</div>' +

      '<div class="up-stat-lbl">' +

      'Vouches' +

      '</div>' +

      '</div>' +

      '<div>' +

      '<div class="up-stat-num">' +

      S.favs.size +

      '</div>' +

      '<div class="up-stat-lbl">' +

      'Saved' +

      '</div>' +

      '</div>' +

      '</div>' +

      '</div>' +

      '<button class="btn btn-sm" style="background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.2);position:relative;z-index:1" onclick="doLogout()">' +

      '<i class="fa-solid fa-right-from-bracket" style="margin-right:8px;"></i>' +

      'Sign Out' +

      '</button>';

  const upBody =
      document.getElementById('up-body');

  if (!upBody) return;

  upBody.innerHTML =

      '<div class="contribution-score">' +

      '<div class="cs-score">' +

      (u.score || 0) +

      '</div>' +

      '<div>' +

      '<div class="cs-label">' +

      'Community Contribution Score' +

      '</div>' +

      '<div class="cs-desc">' +

      'Every recommendation and vouch you add helps your community discover trusted local businesses.' +

      '</div>' +

      '</div>' +

      '</div>' +

      '<div class="up-tabs" id="up-tabs">' +

      '<button class="tab-b on" onclick="switchUPTab(\'recs\')">' +

      '<i class="fa-solid fa-bullhorn" style="margin-right:6px;"></i>' +

      'Recommendations' +

      '</button>' +

      '<button class="tab-b" onclick="switchUPTab(\'saved\')">' +

      '<i class="fa-solid fa-heart" style="margin-right:6px;"></i>' +

      'Saved' +

      '</button>' +

      '<button class="tab-b" onclick="switchUPTab(\'vouches\')">' +

      '<i class="fa-solid fa-house-user" style="margin-right:6px;"></i>' +

      'Vouches' +

      '</button>' +

      '</div>' +

      '<div id="up-tab-content"></div>';

  switchUPTab('recs');
}

function switchUPTab(tab) {

  S.userTab = tab;

  document.querySelectorAll('#up-tabs .tab-b')
      .forEach((b, i) =>
          b.classList.toggle(
              'on',
              ['recs', 'saved', 'vouches'][i] === tab
          )
      );

  const el =
      document.getElementById('up-tab-content');

  if (!el) return;

  if (tab === 'recs') {

    const shown =
        backendVendors.slice(0,4);

    el.innerHTML = shown.length

        ? shown.map(v =>

            '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="goProfile(' +
            v.id +
            ')">' +

            '<span style="font-size:24px">' +

            '<i class="' + v.icon + '"></i>' +

            '</span>' +

            '<div style="flex:1">' +

            '<div style="font-weight:700;font-size:14px">' +

            v.name +

            '</div>' +

            '<div style="font-size:12px;color:var(--text-muted);font-style:italic;margin-top:2px">' +

            '"' +

            v.topStory.slice(0, 80) +

            '…"' +

            '</div>' +

            '</div>' +

            '<div style="text-align:right">' +

            '<span class="badge badge-saffron">' +

            v.trustScore +

            ' trust' +

            '</span>' +

            '<div style="font-size:11px;color:var(--text-muted);margin-top:3px">' +

            v.vouches +

            ' vouches' +

            '</div>' +

            '</div>' +

            '</div>'

        ).join('')

        : '<div class="empty">' +

        '<div class="empty-icon">' +

        '<i class="fa-solid fa-bullhorn"></i>' +

        '</div>' +

        '<div class="empty-title">' +

        'No recommendations yet' +

        '</div>' +

        '<div class="empty-desc">' +

        'Share your first recommendation and help your community' +

        '</div>' +

        '<button class="btn btn-primary" style="margin-top:1rem" onclick="openRecommend()">' +

        '<i class="fa-solid fa-bullhorn" style="margin-right:8px;"></i>' +

        'Recommend a Business' +

        '</button>' +

        '</div>';
  }

  if (tab === 'saved') {

    const saved =
        DATA.vendors.filter(v => S.favs.has(v.id));

    el.innerHTML = saved.length

        ? saved.map(v =>

            '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="goProfile(' +
            v.id +
            ')">' +

            '<span style="font-size:22px">' +

            '<i class="' + v.icon + '"></i>' +

            '</span>' +

            '<div style="flex:1">' +

            '<div style="font-weight:600;font-size:14px">' +

            v.name +

            '</div>' +

            '<div style="font-size:12px;color:var(--text-muted)">' +

            v.cat +

            ' · ' +

            v.distance +

            'm' +

            '</div>' +

            '</div>' +

            '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();toggleFav(' +
            v.id +
            ');renderUserProfile()">' +

            'Remove' +

            '</button>' +

            '</div>'

        ).join('')

        : '<div class="empty">' +

        '<div class="empty-icon">' +

        '<i class="fa-solid fa-heart"></i>' +

        '</div>' +

        '<div class="empty-title">' +

        'Nothing saved yet' +

        '</div>' +

        '<div class="empty-desc">' +

        'Heart businesses while browsing to save them here' +

        '</div>' +

        '</div>';
  }

  if (tab === 'vouches') {

    el.innerHTML =

        '<div class="empty">' +

        '<div class="empty-icon">' +

        '<i class="fa-solid fa-house-user"></i>' +

        '</div>' +

        '<div class="empty-title">' +

        'Your vouches strengthen community trust' +

        '</div>' +

        '<div class="empty-desc">' +

        'Visit any business profile and add your vouch to help your neighbours discover trusted businesses' +

        '</div>' +

        '<button class="btn btn-sage" style="margin-top:1rem" onclick="go(\'feed\')">' +

        'Discover Businesses' +

        '</button>' +

        '</div>';
  }
}

/* ─────────────────────────────────────────────
VENDOR CLAIM PAGE
───────────────────────────────────────────── */

function renderVendorPage() {

  vendorSearch('');

  renderVendorWhy();
}

function vendorSearch(q) {

  const el =
      document.getElementById('vd-search-results');

  if (!el) return;

  const list = q

      ? DATA.vendors.filter(v =>

          v.name.toLowerCase().includes(q.toLowerCase()) ||

          v.cat.toLowerCase().includes(q.toLowerCase())
      )

      : backendVendors.slice(0,4);

  if (!list.length) {

    el.innerHTML =

        '<div class="empty">' +

        '<div class="empty-icon">' +

        '<i class="fa-solid fa-magnifying-glass"></i>' +

        '</div>' +

        '<div class="empty-title">' +

        'Not found' +

        '</div>' +

        '<div class="empty-desc">' +

        'If your business isn\'t listed yet, ask a neighbour to recommend you first!' +

        '</div>' +

        '</div>';

    return;
  }

  el.innerHTML = list.map(v =>

      '<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1.5px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;background:var(--cream);cursor:pointer;transition:var(--transition)" onmouseover="this.style.borderColor=\'var(--saffron-mid)\'" onmouseout="this.style.borderColor=\'var(--border)\'" onclick="goProfile(' +
      v.id +
      ')">' +

      '<span style="font-size:28px">' +

      '<i class="' + v.icon + '"></i>' +

      '</span>' +

      '<div style="flex:1">' +

      '<div style="font-weight:700;font-size:14px">' +

      v.name +

      '</div>' +

      '<div style="font-size:12px;color:var(--text-muted)">' +

      v.cat +

      ' · ' +

      v.city +

      ' · Trust: ' +

      v.trustScore +

      '</div>' +

      '</div>' +

      '<div style="display:flex;gap:6px">' +

      '<button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();goProfile(' +
      v.id +
      ')">' +

      'View' +

      '</button>' +

      (
          !v.claimed

              ? '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();claimProfile(' +
              v.id +
              ')">' +

              'Claim' +

              '</button>'

              : '<span class="badge b-sage">Claimed</span>'
      ) +

      '</div>' +

      '</div>'

  ).join('');
}

function claimProfile(id) {

  if (!S.user) {

    openModal('m-auth');

    return;
  }

  const v =
      DATA.vendors.find(x => x.id == id);

  toast(
      'Claim request submitted for ' +
      (v ? v.name : 'this business') +
      '. Our team will verify ownership within 48 hours.',
      'success'
  );

  if (v) {

    v.claimed = true;
  }

  vendorSearch(
      document.getElementById('vd-search').value
  );
}

function renderVendorWhy() {

  const el =
      document.getElementById('vd-why-grid');

  if (!el) return;

  const pts = [

    {
      icon: 'fa-solid fa-house-user',
      title: 'Community builds your trust',
      desc: 'Your neighbours vouch for you first. You don\'t need to advertise.'
    },

    {
      icon: 'fa-solid fa-bullhorn',
      title: 'Zero cost, forever',
      desc: 'LocalLift is free. The community recommends you — not your ad budget.'
    },

    {
      icon: 'fa-solid fa-sparkles',
      title: 'Organic discovery',
      desc: 'Trending purely because customers love you — more powerful than any listing.'
    },

    {
      icon: 'fa-solid fa-chart-column',
      title: 'See your trust score',
      desc: 'Understand what your community thinks and how to serve them better.'
    },

  ];

  el.innerHTML = pts.map(p =>

      '<div style="background:rgba(250,247,242,.6);border-radius:var(--radius);padding:1.25rem;border:1px solid rgba(232,101,26,.3)">' +

      '<div style="font-size:26px;margin-bottom:.75rem">' +

      '<i class="' + p.icon + '"></i>' +

      '</div>' +

      '<div style="font-family:var(--font-display);font-size:15px;font-weight:700;margin-bottom:.375rem;color:var(--earth)">' +

      p.title +

      '</div>' +

      '<p style="font-size:13px;color:var(--earth-mid);line-height:1.6">' +

      p.desc +

      '</p>' +

      '</div>'

  ).join('');
}

/* ─────────────────────────────────────────────
   WHATSAPP
───────────────────────────────────────────── */

function openWA(vendorId) {

  const v = vendorId

      ? backendVendors.find(x => x.id == vendorId)

      : null;

  const msg = v

      ? 'Hi ' +
      v.name +
      '! I found you on LocalLift and I\'m interested in your services. Could you share more details?'

      : 'Hi! I\'d like to register my business on LocalLift through WhatsApp.';

  window.open(
      'https://wa.me/' +
      (v ? v.phone : '919876500001') +
      '?text=' +
      encodeURIComponent(msg),
      '_blank'
  );

  toast(
      'Opening WhatsApp...',
      'info'
  );
}

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */

function toggleMobile() {

  document.getElementById('mmenu')
      .classList.toggle('open');
}

document.addEventListener('click', e => {

  const m =
      document.getElementById('mmenu');

  const b =
      document.querySelector('.burger');

  if (
      m &&
      b &&
      !m.contains(e.target) &&
      !b.contains(e.target)
  ) {

    m.classList.remove('open');
  }
});

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */

/* CONTACT FORM — frontend-only */

function submitContact(e) {

  e.preventDefault();

  const name =
      document.getElementById('ct-name');

  const email =
      document.getElementById('ct-email');

  const msg =
      document.getElementById('ct-msg');

  let ok = true;

  [name, email, msg].forEach(f => {

    f.classList.remove('err');

    if (!f.value.trim()) {

      f.classList.add('err');

      ok = false;
    }
  });

  if (!ok) {

    toast(
        'Please fill all fields',
        'error'
    );

    return false;
  }

  if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(email.value)
  ) {

    email.classList.add('err');

    toast(
        'Enter a valid email',
        'error'
    );

    return false;
  }

  toast(
      'Thanks! We\'ll get back to you within 24 hours.',
      'success'
  );

  name.value = '';

  email.value = '';

  msg.value = '';

  return false;
}

go('home');

function getCategoryColor(category) {

  const cat = (category || '').toLowerCase();

  switch(cat) {

    case 'food':
    case 'home food':
      return '#F8E8DC';

    case 'tailoring':
      return '#DDF0E0';

    case 'repairs':
      return '#DDE8F7';

    case 'tutors':
      return '#DDF0E0';

    case 'dairy':
      return '#F8F0C8';

    case 'beauty':
      return '#F5E5DD';

    case 'auto':
      return '#EFE7D5';

    default:
      return '#F8E8DC';
  }
}

function openLogin() {

  openModal('m-auth');

  switchAuth('login');
}

function openSignup() {

  openModal('m-auth');

  switchAuth('signup');
}