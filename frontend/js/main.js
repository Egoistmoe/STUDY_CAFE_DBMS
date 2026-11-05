// Home page: login button + reservations (saved as bookings)
const user = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');
const loginBtn = document.querySelector('.login-btn');

if (user && loginBtn) {
  loginBtn.textContent = 'Logout (' + user.full_name + ')';
  loginBtn.addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('token');
  });
  const nameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  if (nameInput) nameInput.value = user.full_name;
  if (emailInput) emailInput.value = user.email;
}

const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in first to reserve a seat.');
      window.location.href = 'login.html';
      return;
    }

    const areaName = document.getElementById('studyArea').value;
    const date = document.getElementById('date').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;

    if (end <= start) {
      alert('End time must be after the start time.');
      return;
    }

    const start_time = date + ' ' + start + ':00';
    const end_time = date + ' ' + end + ':00';

    try {
      // bookings belong to a member: find the member with this email, or create one
      const members = await fetch(API_BASE + '/api/members').then(r => r.json());
      let member = members.find(m => m.email === user.email);
      if (!member) {
        const created = await fetch(API_BASE + '/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: user.full_name, email: user.email })
        });
        member = await created.json();
        if (!created.ok) {
          alert(member.error || 'Could not create your member record.');
          return;
        }
      }

      const [areas, seats, bookings] = await Promise.all([
        fetch(API_BASE + '/api/study-areas').then(r => r.json()),
        fetch(API_BASE + '/api/seats').then(r => r.json()),
        fetch(API_BASE + '/api/bookings').then(r => r.json())
      ]);

      const area = areas.find(a => a.area_name === areaName);
      if (!area) {
        alert('Study area "' + areaName + '" was not found in the database.');
        return;
      }

      // seats in this area that are not already booked at that time
      const newStart = new Date(date + 'T' + start);
      const newEnd = new Date(date + 'T' + end);

      const taken = new Set(
        bookings
          .filter(b => b.status !== 'Cancelled' &&
                       new Date(b.start_time) < newEnd &&
                       new Date(b.end_time) > newStart)
          .map(b => b.seat_id)
      );

      const seat = seats.find(s =>
        s.study_area_id === area.study_area_id && !taken.has(s.seat_id)
      );

      if (!seat) {
        alert('No free seats in ' + areaName + ' at that time.');
        return;
      }

      const res = await fetch(API_BASE + '/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: member.member_id,
          seat_id: seat.seat_id,
          start_time,
          end_time,
          status: 'Confirmed'
        })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert('Reservation saved! Seat: ' + (seat.seat_label || seat.seat_id));
        reservationForm.reset();
      } else {
        alert(data.error || data.message || 'Reservation failed.');
      }
    } catch (err) {
      alert('Cannot connect to the server. Is it running?');
    }
  });
}