// Announcements and Notices module (Nicole)
// Reuses: API_BASE (config.js), sessionStorage 'token' and 'loggedInUser' (set at login in app.js).

const annUser = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');
const annToken = sessionStorage.getItem('token');
const canManage = !!annUser && (annUser.role_name === 'Admin' || annUser.role_name === 'Staff');
const isAdmin = !!annUser && annUser.role_name === 'Admin';

const annList = document.getElementById('announcementList');
const annMessage = document.getElementById('announcementMessage');
const annToolbar = document.getElementById('announcementToolbar');
const annModal = document.getElementById('announcementModal');
const annForm = document.getElementById('announcementForm');
const annFormError = document.getElementById('announcementFormError');

let annMode = 'active';      // 'active' (everyone) or 'manage' (Admin/Staff)
let annItems = [];

// ---------- helpers ----------
function esc(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

// 'YYYY-MM-DD HH:MM:SS' -> 'Nov 16, 2026, 3:30 PM'
function fmtDate(value) {
  if (!value) return '';
  const d = new Date(value.replace(' ', 'T'));
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

// 'YYYY-MM-DD HH:MM:SS' -> 'YYYY-MM-DDTHH:MM' (for datetime-local inputs)
const toInputValue = (value) => (value ? value.slice(0, 16).replace(' ', 'T') : '');

function categoryClass(category) {
  return 'announcement-category cat-' + category.toLowerCase().replace(/\s+/g, '-');
}

async function annFetch(path, options = {}) {
  const res = await fetch(API_BASE + '/api/announcements' + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + annToken
    }
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedInUser');
  }
  return { ok: res.ok, status: res.status, data };
}

// ---------- rendering ----------
function renderAnnouncements() {
  annList.innerHTML = '';

  if (annItems.length === 0) {
    annMessage.hidden = false;
    annMessage.textContent = annMode === 'manage'
      ? 'You have not published any announcements yet.'
      : 'There are no announcements right now. Please check back later.';
    return;
  }

  annMessage.hidden = true;

  annItems.forEach(item => {
    const expired = Number(item.is_expired) === 1;
    const archived = Number(item.is_active) === 0;

    let status = '';
    if (annMode === 'manage') {
      if (archived) status = '<span class="announcement-status archived">Archived</span>';
      else if (expired) status = '<span class="announcement-status expired">Expired</span>';
      else status = '<span class="announcement-status live">Live</span>';
    }

    const expires = item.expires_at
      ? `<span>Expires: ${esc(fmtDate(item.expires_at))}</span>`
      : '<span>No expiration</span>';

    const author = (annMode === 'manage' && item.created_by_name)
      ? `<span>By: ${esc(item.created_by_name)}</span>` : '';

    let actions = '';
    if (annMode === 'manage') {
      const own = item.created_by === annUser.user_id;
      if (isAdmin || own) {
        actions += `<button type="button" class="announcement-action edit" data-id="${item.announcement_id}">Edit</button>`;
        if (!archived) {
          actions += `<button type="button" class="announcement-action archive" data-id="${item.announcement_id}">Archive</button>`;
        }
      }
      if (isAdmin) {
        actions += `<button type="button" class="announcement-action delete" data-id="${item.announcement_id}">Delete</button>`;
      }
    }

    const card = document.createElement('article');
    card.className = 'announcement-card' + (archived || expired ? ' is-inactive' : '');
    card.innerHTML = `
      <div class="announcement-card-top">
        <span class="${categoryClass(item.category)}">${esc(item.category)}</span>
        ${status}
      </div>
      <h3>${esc(item.title)}</h3>
      <p class="announcement-body">${esc(item.message)}</p>
      <div class="announcement-meta">
        <span>Published: ${esc(fmtDate(item.published_at))}</span>
        ${expires}
        ${author}
      </div>
      ${actions ? `<div class="announcement-actions">${actions}</div>` : ''}
    `;
    annList.appendChild(card);
  });
}

async function loadAnnouncements() {
  annList.innerHTML = '';
  annMessage.hidden = false;

  if (!annToken || !annUser) {
    annMessage.innerHTML = 'Please <a href="login.html">log in</a> to view announcements.';
    return;
  }

  annMessage.textContent = 'Loading announcements...';

  try {
    const r = await annFetch(annMode === 'manage' ? '/manage' : '');

    if (r.status === 401) {
      annMessage.innerHTML = 'Your session has expired. Please <a href="login.html">log in</a> again.';
      return;
    }
    if (!r.ok) {
      annMessage.textContent = r.data.message || 'Unable to load announcements.';
      return;
    }

    annItems = r.data;
    renderAnnouncements();
  } catch (err) {
    annMessage.textContent = 'Cannot connect to the server. Is it running?';
  }
}

// ---------- tabs ----------
function setMode(mode) {
  annMode = mode;
  document.getElementById('tabActive').classList.toggle('active', mode === 'active');
  document.getElementById('tabManage').classList.toggle('active', mode === 'manage');
  loadAnnouncements();
}

// ---------- modal form ----------
function openModal(item) {
  annFormError.textContent = '';
  annForm.reset();
  document.getElementById('announcementId').value = item ? item.announcement_id : '';
  document.getElementById('announcementModalTitle').textContent = item ? 'Edit Announcement' : 'New Announcement';

  if (item) {
    document.getElementById('annTitle').value = item.title;
    document.getElementById('annMessage').value = item.message;
    document.getElementById('annCategory').value = item.category;
    document.getElementById('annPublishedAt').value = toInputValue(item.published_at);
    document.getElementById('annExpiresAt').value = toInputValue(item.expires_at);
  }
  annModal.hidden = false;
}

function closeModal() {
  annModal.hidden = true;
}

annForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  annFormError.textContent = '';

  const id = document.getElementById('announcementId').value;
  const body = {
    title: document.getElementById('annTitle').value.trim(),
    message: document.getElementById('annMessage').value.trim(),
    category: document.getElementById('annCategory').value,
    published_at: document.getElementById('annPublishedAt').value,
    expires_at: document.getElementById('annExpiresAt').value
  };

  // Keep an archived announcement archived when it is edited.
  if (id) {
    const original = annItems.find(a => String(a.announcement_id) === id);
    body.is_active = original ? Number(original.is_active) === 1 : true;
  }

  try {
    const r = await annFetch(id ? '/' + id : '', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      annFormError.textContent = r.data.message || 'Could not save the announcement.';
      return;
    }

    closeModal();
    loadAnnouncements();
  } catch (err) {
    annFormError.textContent = 'Cannot connect to the server. Is it running?';
  }
});

// ---------- card buttons (edit / archive / delete) ----------
annList.addEventListener('click', async (e) => {
  const btn = e.target.closest('.announcement-action');
  if (!btn) return;

  const id = btn.dataset.id;
  const item = annItems.find(a => String(a.announcement_id) === id);

  if (btn.classList.contains('edit')) {
    openModal(item);
    return;
  }

  const isDelete = btn.classList.contains('delete');
  const question = isDelete
    ? 'Permanently delete this announcement? This cannot be undone.'
    : 'Archive this announcement? Students will no longer see it.';
  if (!confirm(question)) return;

  try {
    const r = isDelete
      ? await annFetch('/' + id, { method: 'DELETE' })
      : await annFetch('/' + id + '/archive', { method: 'PATCH' });

    if (!r.ok) {
      alert(r.data.message || 'Action failed.');
      return;
    }
    loadAnnouncements();
  } catch (err) {
    alert('Cannot connect to the server. Is it running?');
  }
});

// ---------- start ----------
if (canManage) {
  annToolbar.hidden = false;
  document.getElementById('tabActive').addEventListener('click', () => setMode('active'));
  document.getElementById('tabManage').addEventListener('click', () => setMode('manage'));
  document.getElementById('addAnnouncementBtn').addEventListener('click', () => openModal(null));
  document.getElementById('cancelAnnouncementBtn').addEventListener('click', closeModal);
  annModal.addEventListener('click', (e) => { if (e.target === annModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !annModal.hidden) closeModal(); });
}

loadAnnouncements();
