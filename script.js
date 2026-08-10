const year = document.querySelector('#year');
const menuButton = document.querySelector('#menuButton');
const navLinks = document.querySelector('#navLinks');
const themeButton = document.querySelector('#themeButton');
const form = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const filters = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project')];

year.textContent = new Date().getFullYear();
menuButton.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navLinks.addEventListener('click', event => { if (event.target.matches('a')) { navLinks.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); } });
themeButton.addEventListener('click', () => document.body.classList.toggle('dark'));
filters.forEach(button => button.addEventListener('click', () => { const category = button.dataset.filter; filters.forEach(item => item.classList.toggle('active', item === button)); projects.forEach(project => project.classList.toggle('is-hidden', category !== 'all' && !project.dataset.category.includes(category))); }));
form.addEventListener('submit', event => { event.preventDefault(); formStatus.textContent = form.checkValidity() ? 'Your message is ready. Connect an email service before publishing to send it.' : 'Please complete the required fields.'; });
