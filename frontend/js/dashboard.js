async function loadDashboardSummary() {
    try {
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
            throw new Error('Failed to load dashboard summary');
        }

        const data = await response.json();

        document.getElementById('totalMembers').textContent =
            data.total_members;

        document.getElementById('totalReviews').textContent =
            data.total_reviews;

        document.getElementById('averageRating').textContent =
            data.avg_rating ?? 'No ratings yet';

    } catch (error) {
        console.error('Dashboard error:', error);
    }
}


async function loadReviewCountPerArea() {
    try {
        const response = await fetch('/api/dashboard/review-count-per-area');

        if (!response.ok) {
            throw new Error('Failed to load review counts');
        }

        const data = await response.json();

        const reviewCountList = document.getElementById('reviewCountList');

        reviewCountList.innerHTML = data.map(area => `
            <p>${area.area_name} — ${area.review_count} reviews</p>
        `).join('');

    } catch (error) {
        console.error('Review count error:', error);

        document.getElementById('reviewCountList').textContent =
            'Unable to load review counts.';
    }
}


// LOAD DASHBOARD DATA
loadDashboardSummary();
loadReviewCountPerArea();