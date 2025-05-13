document.addEventListener('DOMContentLoaded', () => {
  // Check if device is mobile or has low performance
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Only add decorative UI if NOT mobile AND animations are NOT reduced
  if (!isMobile && !prefersReducedMotion) {
    const uiContainer = document.createElement('div');
    uiContainer.className = 'ui-container';

    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    for (const corner of corners) {
      const cornerElement = document.createElement('div');
      cornerElement.className = `corner ${corner}`;
      uiContainer.appendChild(cornerElement);
    }

    document.body.appendChild(uiContainer);
  }

  // Use more efficient selectors and batch DOM operations
  if (isMobile) {
    // Add mobile optimization class to body for CSS targeting
    document.body.classList.add('mobile-optimized');
    
    // On mobile, only add essential classes and avoid unnecessary DOM operations
    const navItems = document.querySelectorAll('nav li, .navbar li');
    for (const item of navItems) {
      item.classList.add('nav-item');
    }
  } else {
    // On desktop, add all decorative classes
    for (const item of document.querySelectorAll('li')) {
      item.classList.add('list-item');
    }

    for (const item of document.querySelectorAll('nav li, .navbar li')) {
      item.classList.add('nav-item');
    }
  }
});
