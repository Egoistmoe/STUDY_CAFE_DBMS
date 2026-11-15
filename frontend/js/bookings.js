const API_URL = `${CONFIG.API_URL}/bookings`;

const bookingTableBody = document.getElementById('bookingTableBody');
const bookingMessage = document.getElementById('bookingMessage');

async function loadBookings() {
    try {
        const response = await fetch(API_URL);
        const bookings = await response.json();

        if (!response.ok) {
            throw new Error(bookings.error || 'Failed to load bookings');
        }

        bookingTableBody.innerHTML = '';

        if (bookings.length === 0) {
            bookingMessage.textContent = 'No bookings found.';
            return;
        }

        bookingMessage.textContent = `${bookings.length} booking(s) found.`;

        bookings.forEach(booking => {
            const row = document.createElement('tr');

            const statusClass = booking.status
                .toLowerCase()
                .replace('-', '')
                .replace(' ', '-');

            row.innerHTML = `
                <td>${booking.booking_id}</td>
                <td>${booking.member_id}</td>
                <td>${booking.seat_label}</td>
                <td>${booking.area_name}</td>
                <td>${formatDate(booking.start_time)}</td>
                <td>${formatDate(booking.end_time)}</td>
                <td>
                    <span class="booking-status status-${statusClass}">
                        ${booking.status}
                    </span>
                </td>
                <td>₱${Number(booking.total_price).toFixed(2)}</td>
                <td>
                    <button class="booking-action edit-booking"
                        onclick="editBooking(${booking.booking_id})">
                        Edit
                    </button>
                    <button class="booking-action delete-booking"
                        onclick="deleteBooking(${booking.booking_id})">
                        Delete
                    </button>
                </td>
            `;

            bookingTableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        bookingMessage.textContent = 'Error loading bookings.';
    }
}

function formatDate(date) {
    return new Date(date).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

async function editBooking(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();

    const booking = result.booking;

    if (!booking) {
        alert('Booking not found.');
        return;
    }

    const status = prompt(
        'Enter new booking status:\nConfirmed\nChecked-In\nCompleted\nCancelled\nNo-Show',
        booking.status
    );

    if (!status) return;

    const validStatuses = [
        'Confirmed',
        'Checked-In',
        'Completed',
        'Cancelled',
        'No-Show'
    ];

    if (!validStatuses.includes(status)) {
        alert('Invalid booking status.');
        return;
    }

    const updateResponse = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            member_id: booking.member_id,
            seat_id: booking.seat_id,
            start_time: booking.start_time,
            end_time: booking.end_time,
            status: status
        })
    });

    const updateResult = await updateResponse.json();

    if (!updateResponse.ok) {
        alert(updateResult.error || 'Failed to update booking.');
        return;
    }

    alert('Booking updated successfully.');
    loadBookings();
}

async function deleteBooking(id) {
    const confirmDelete = confirm(
        `Are you sure you want to delete booking #${id}?`
    );

    if (!confirmDelete) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || 'Failed to delete booking.');
        return;
    }

    alert('Booking deleted successfully.');
    loadBookings();
}

loadBookings();