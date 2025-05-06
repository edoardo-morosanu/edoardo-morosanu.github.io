document.addEventListener('DOMContentLoaded', () => {
    // Add UI frame decorations
    const uiContainer = document.createElement('div');
    uiContainer.className = 'ui-container';
    
    // Corner decorations
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    for (const corner of corners) {
      const cornerElement = document.createElement('div');
      cornerElement.className = `ui-corner ${corner}`;
      uiContainer.appendChild(cornerElement);
    }
    
    // Edge decorations
    const edges = ['top', 'right', 'bottom', 'left'];
    for (const edge of edges) {
      const edgeElement = document.createElement('div');
      edgeElement.className = `ui-edge ${edge}`;
      uiContainer.appendChild(edgeElement);
    }
    
    document.body.appendChild(uiContainer);
    
    // Add custom-style decorative bullet points to lists
    const listItems = document.querySelectorAll('li');
    for (const item of listItems) {
      item.classList.add('custom-list-item');
    }
    
    // Add special handling for navbar items
    const navItems = document.querySelectorAll('nav li, .navbar li');
    for (const item of navItems) {
      item.classList.add('custom-nav-item');
    }
  });
