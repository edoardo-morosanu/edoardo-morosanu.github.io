const routes = new Map([
  ["#home", "pages/home.html"],
  ["#projects", "pages/projects.html"],
  ["#about", "pages/about.html"],
]);

const pageCache = new Map();
const loadingIndicator = document.getElementById("loading");

async function loadContent(hash) {
  const page = routes.get(hash || "#home");
  const contentElement = document.getElementById("content");

  contentElement.classList.remove("loaded");
  contentElement.classList.add("page-transition");

  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (!page) throw new Error("Page not found");
    document.body.classList.add("loading");
    loadingIndicator.hidden = false;

    let content;
    if (pageCache.has(page)) {
      content = pageCache.get(page);
    } else {
      const response = await fetch(page);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      content = doc.querySelector(".content").outerHTML;
      pageCache.set(page, content);
    }

    contentElement.innerHTML = content;
  } catch (error) {
    console.error("Error:", error);
    contentElement.innerHTML = `
      <div class="error-boundary">
        <h1>Error</h1>
        <p>${error.message}</p>
        <button onclick="window.location.hash='#home'">Return Home</button>
      </div>`;
  } finally {
    document.body.classList.remove("loading");
    loadingIndicator.hidden = true;

    requestAnimationFrame(() => {
      contentElement.classList.remove("page-transition");
      contentElement.classList.add("loaded");
    });
  }
}

window.addEventListener("hashchange", () => loadContent(window.location.hash));
window.addEventListener("load", () => loadContent(window.location.hash));
