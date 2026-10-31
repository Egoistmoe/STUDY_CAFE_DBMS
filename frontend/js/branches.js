
const branchesMessage = document.getElementById('branchesMessage');
const branchesTableBody = document.getElementById('branchesTableBody');

async function loadBranches() {
    try {
        const response = await fetch('/branches');
        const branches = await response.json();

        if (!response.ok) {
            throw new Error(branches.message || 'Failed to load branches.');
        }

        branchesTableBody.innerHTML = '';

        if (branches.length === 0) {
            branchesMessage.textContent = 'No branches found.';
            return;
        }

        branchesMessage.textContent = 'Branches loaded successfully!';

        branches.forEach(branch => {
            const row = document.createElement('tr');

            const values = [
                branch.branch_id,
                branch.branch_name,
                branch.address,
                branch.phone
            ];

            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value || 'Not provided';
                cell.style.padding = '12px';
                cell.style.borderBottom = '1px solid #ddd';
                row.appendChild(cell);
            });

            branchesTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading branches:', error);
        branchesMessage.textContent = 'Unable to load branches. Please check the server.';
    }
}

loadBranches();
