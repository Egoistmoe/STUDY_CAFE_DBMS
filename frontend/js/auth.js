// Admin pages only: send visitors to login if nobody is logged in.
const staff = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');
if (!staff) {
  window.location.href = 'login.html';
}
document.querySelectorAll('.logout-link').forEach(link => {
  link.addEventListener('click', () => sessionStorage.removeItem('loggedInUser'));
});
