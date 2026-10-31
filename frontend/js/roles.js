
async function loadRoles() {
    const rolesTable = document.getElementById('rolesTable');

    try {
        const response = await fetch('/roles');

        if (!response.ok) {
            throw new Error('Failed to load roles');
        }

        const roles = await response.json();

        rolesTable.innerHTML = '';

        roles.forEach(role => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${role.role_id}</td>
                <td>${role.role_name}</td>
            `;

            rolesTable.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading roles:', error);
        rolesTable.innerHTML = `
            <tr>
                <td colspan="2">Unable to load roles.</td>
            </tr>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadRoles);
