document.getElementById('site-footer').innerHTML = `
  buskybrows.ing &middot; made by hand in notepad++
  &middot; <span id="cookie-status">no cookies 🍪</span>
  <br>
  <span id="checked-time" style="font-size: 0.7rem; color: #aaa;"></span>
`;

if (document.cookie.split(';').some(c => c.trim().startsWith('auth_flag='))) {
  document.getElementById('cookie-status').textContent = 'pass cookie 🍪';
}

const now = new Date();

let hours = now.getHours();
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');
const ms = String(now.getMilliseconds()).padStart(3, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';

hours = hours % 12;
hours = hours ? hours : 12; // 0 should show as 12
hours = String(hours).padStart(2, '0');

const timeString = `${hours}:${minutes}:${seconds}.${ms} ${ampm}`;

document.getElementById('checked-time').textContent = `(last checked ${timeString})`;

document.getElementById('checked-time').textContent = `(last checked ${timeString})`;