const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    mainNav.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });

  revealElements.forEach((element) => revealObserver.observe(element));
  document.documentElement.classList.add('has-motion');
}

const applicationForm = document.querySelector('#application-form');
const applicationResult = document.querySelector('#application-result');

if (applicationForm && applicationResult) {
  const preview = document.querySelector('#application-preview');
  const copyButton = document.querySelector('#copy-application');
  const editButton = document.querySelector('#edit-application');
  const copyStatus = document.querySelector('#copy-status');

  applicationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(applicationForm);
    const optionalLine = (label, value) => value.trim() ? `${label}: ${value.trim()}\n` : '';
    preview.value = `ЗАЯВКА — ИНДИГО ТЕХНОЛОГИИ\n\n` +
      `Имя: ${data.get('name').trim()}\n` +
      `Телефон: ${data.get('phone').trim()}\n` +
      `Услуга: ${data.get('service')}\n` +
      optionalLine('Оборудование', data.get('equipment')) +
      optionalLine('Адрес объекта', data.get('address')) +
      `\nОписание задачи:\n${data.get('description').trim()}`;
    applicationForm.hidden = true;
    applicationResult.hidden = false;
    copyStatus.textContent = '';
    copyButton.focus();
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      copyStatus.textContent = 'Заявка скопирована. Теперь её можно вставить в сообщение.';
    } catch {
      preview.focus();
      preview.select();
      copyStatus.textContent = 'Выделите текст и скопируйте его вручную: Ctrl+C или ⌘+C.';
    }
  });

  editButton.addEventListener('click', () => {
    applicationResult.hidden = true;
    applicationForm.hidden = false;
    copyStatus.textContent = '';
    applicationForm.querySelector('input').focus();
  });
}
