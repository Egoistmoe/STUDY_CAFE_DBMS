
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    loginMessage.textContent = 'Logging in...';

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message || 'Login failed.';
            return;
        }

        loginMessage.textContent = 'Login successful! Welcome, ' + data.user.full_name + '!';

        // Save the logged-in user's information for the next page.
        sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));

    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent = 'Cannot connect to the server. Please try again.';
    }
});
