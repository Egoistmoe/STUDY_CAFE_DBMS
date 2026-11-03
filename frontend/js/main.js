// Home page: show logged-in member + send reservations to the server
const member = JSON.parse(localStorage.getItem('member') || 'null');
const loginBtn = document.querySelector('.login-btn');
if (member && loginBtn) {
  const name = member.full_name || (member.member && member.member.full_name) || 'Member';
  loginBtn.textContent = 'Logout (' + name + ')';
  loginBtn.addEventListener('click', () => localStorage.removeItem('member'));
}

const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      full_name: document.getElementById('fullname').value.trim(),
      email: document.getElementById('email').value.trim(),
      study_area: document.getElementById('studyArea').value,
      date: document.getElementById('date').value,
      start_time: document.getElementById('startTime').value,
      end_time: document.getElementById('endTime').value
    };
    try {
      const res = await fetch(API_BASE + '/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({}));
      alert(res.ok ? 'Reservation submitted!' : (data.message || 'Reservation failed.'));
      if (res.ok) reservationForm.reset();
    } catch (err) {
      alert('Cannot connect to the server. Is it running?');
    }
  });
}
