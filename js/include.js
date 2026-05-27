document.addEventListener('DOMContentLoaded', async () => {
  const includes = document.querySelectorAll('[data-include]');
  for (const el of includes) {
    const file = `components/${el.dataset.include}.html`;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`Error al cargar ${file}: ${res.status}`);
      const html = await res.text();
      el.outerHTML = html;
    } catch (err) {
      console.error(err);
      el.outerHTML = `<p style="color:red">Error al cargar ${file}</p>`;
    }
  }
  document.dispatchEvent(new CustomEvent('includes-loaded'));
});
