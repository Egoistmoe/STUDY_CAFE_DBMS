
const usersMessage = document.getElementById('usersMessage');
const usersTableBody = document.getElementById('usersTableBody');
const userForm = document.getElementById('userForm');
const formMessage = document.getElementById('formMessage');

const userIdInput = document.getElementById('userId');
const fullNameInput = document.getElementById('full_name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role_id');
const branchInput = document.getElementById('branch_id');
const activeInput = document.getElementById('is_active');

const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const formTitle = document.getElementById('formTitle');
const passwordHint = document.getElementById('passwordHint');

// LOAD ROLES AND BRANCHES
async function loadDropdowns() {
    try {
        const [rolesResponse, branchesResponse] = await Promise.all([
            fetch('/roles'),
            fetch('/branches')
        ]);

        if (!rolesResponse.ok || !branchesResponse.ok) {
            throw new Error('Unable to load roles or branches.');
        }

        const roles = await rolesResponse.json();
        const branches = await branchesResponse.json();

        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.role_id;
            option.textContent = role.role_name;
            roleInput.appendChild(option);
        });

        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.branch_id;
            option.textContent = branch.branch_name;
            branchInput.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        formMessage.textContent = 'Unable to load roles and branches.';
    }
}

// LOAD ALL USERS
async function loadUsers() {
    try {
        const response = await fetch('/users');
        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.message || 'Failed to load users.');
        }

        usersTableBody.innerHTML = '';

        if (users.length === 0) {
            usersMessage.textContent = 'No users found.';
            return;
        }

        usersMessage.textContent = 'Users loaded successfully!';

        users.forEach(user => {
            const row = document.createElement('tr');

            const values = [
                user.user_id,
                user.full_name,
                user.email,
                user.role_name,
                user.branch_name || 'No branch',
                user.is_active ? 'Active' : 'Inactive'
            ];

            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                cell.style.padding = '12px';
                cell.style.borderBottom = '1px solid #ddd';
                row.appendChild(cell);
            });

            const actionCell = document.createElement('td');
            actionCell.style.padding = '12px';
            actionCell.style.borderBottom = '1px solid #ddd';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.type = 'button';
            editButton.onclick = () => editUser(user.user_id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.type = 'button';
            deleteButton.style.marginLeft = '6px';
            deleteButton.onclick = () => deleteUser(user.user_id);

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            usersTableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        usersMessage.textContent = 'Unable to load users. Please check the server.';
    }
}

// ADD OR UPDATE USER
userForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = userIdInput.value;

    const userData = {
        full_name: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        role_id: Number(roleInput.value),
        branch_id: branchInput.value || null,
        is_active: Number(activeInput.value) === 1
    };

    if (passwordInput.value) {
        userData.password = passwordInput.value;
    }

    if (!id && !passwordInput.value) {
        formMessage.textContent = 'Password is required for a new user.';
        return;
    }

    if (id && !passwordInput.value) {
        delete userData.password;
    }

    const url = id ? `/users/${id}` : '/users';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to save user.');
        }

        formMessage.textContent = data.message;
        resetForm();
        await loadUsers();

    } catch (error) {
        formMessage.textContent = error.message;
    }
});

// EDIT USER
async function editUser(id) {
    try {
        const response = await fetch(`/users/${id}`);
        const user = await response.json();

        if (!response.ok) {
            throw new Error(user.message || 'Unable to get user.');
        }

        userIdInput.value = user.user_id;
        fullNameInput.value = user.full_name;
        emailInput.value = user.email;
        roleInput.value = user.role_id;
        branchInput.value = user.branch_id || '';
        activeInput.value = user.is_active ? '1' : '0';

        passwordInput.value = '';
        passwordInput.required = false;
        passwordHint.textContent = 'Leave blank to keep the current password.';

        formTitle.textContent = 'Edit User';
        saveButton.textContent = 'Update User';
        cancelButton.style.display = 'inline-block';
        formMessage.textContent = 'Editing user ID: ' + user.user_id;

        userForm.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        formMessage.textContent = error.message;
    }
}

// DELETE USER
async function deleteUser(id) {
    const confirmed = confirm(
        'Are you sure you want to delete user ID ' + id + '?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/users/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to delete user.');
        }

        formMessage.textContent = data.message;
        await loadUsers();

    } catch (error) {
        formMessage.textContent = error.message;
    }
}

// RESET FORM
function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    passwordInput.required = true;

    formTitle.textContent = 'Add New User';
    saveButton.textContent = 'Add User';
    cancelButton.style.display = 'none';
    passwordHint.textContent = 'Required for a new user.';
}

// CANCEL EDIT
cancelButton.addEventListener('click', function () {
    resetForm();
    formMessage.textContent = '';
});

// INITIAL LOAD
loadDropdowns();
loadUsers();
