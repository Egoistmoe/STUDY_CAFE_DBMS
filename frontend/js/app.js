
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

async function postJSON(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {}

  return { ok: res.ok, data };
}

if (loginForm) {
  const msg = document.getElementById('loginMessage');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    msg.textContent = 'Logging in...';

    try {
      const r = await postJSON('/api/auth/login', { email, password });

      if (r.ok) {
        sessionStorage.setItem('token', r.data.token);
        sessionStorage.setItem('loggedInUser', JSON.stringify(r.data.user));

        const role = r.data.user.role_name;

        if (role === 'Admin') {
          window.location.href = 'dashboard.html';
        } else if (role === 'Student') {
          window.location.href = 'index.html';
        } else if (role === 'Staff') {
          alert('Staff dashboard is not yet available.');
          window.location.href = 'index.html';
        } else {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('loggedInUser');
          msg.textContent = 'Unknown account role.';
        }
      } else {
        msg.textContent = r.data.error || r.data.message || 'Login failed.';
      }
    } catch (err) {
      msg.textContent = 'Cannot connect to the server. Is it running?';
    }
  });
}

if (registerForm) {
  const msg = document.getElementById('registerMessage');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = document.getElementById('full_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;

    if (password !== confirm) {
      msg.textContent = 'Passwords do not match.';
      return;
    }

    try {
      const r = await postJSON('/api/auth/register', {
        full_name,
        email,
        password
      });

      if (r.ok) {
        msg.textContent = 'Account created! Redirecting to login...';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      } else {
        msg.textContent = r.data.error || r.data.message || 'Registration failed.';
      }
    } catch (err) {
      msg.textContent = 'Cannot connect to the server. Is it running?';
    }
  });
}
