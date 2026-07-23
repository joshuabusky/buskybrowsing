document.getElementById('site-footer').innerHTML = `
  buskybrows.ing &middot; made by hand in notepad++
  &middot; <span id="cookie-status">no cookies 🍪</span>
`;

if (document.cookie.split(';').some(c => c.trim().startsWith('auth_flag='))) {
  document.getElementById('cookie-status').textContent = '1 necessary cookie 🍪';
}