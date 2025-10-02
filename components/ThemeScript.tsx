// runs before paint to prevent theme FOUC
export default function ThemeScript() {
  const code = `
(function() {
  try {
    const ls = localStorage.getItem('theme');
    const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const theme = (ls === 'light' || ls === 'dark') ? ls : sys;
    document.documentElement.setAttribute('data-theme', theme);
    // keep color-scheme in sync for UA widgets
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute('data-theme','dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning />;
}
