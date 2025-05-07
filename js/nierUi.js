document.addEventListener('DOMContentLoaded', () => {
  const uiContainer = document.createElement('div');
  uiContainer.className = 'ui-container';

  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  for (const corner of corners) {
    const cornerElement = document.createElement('div');
    cornerElement.className = `corner ${corner}`;
    uiContainer.appendChild(cornerElement);
  }

  document.body.appendChild(uiContainer);

  // Decorative bullet points
  const listItems = document.querySelectorAll('li');
  for (const item of listItems) {
    item.classList.add('list-item');
  }

  // Navbar bullets
  const navItems = document.querySelectorAll('nav li, .navbar li');
  for (const item of navItems) {
    item.classList.add('nav-item');
  }
});
