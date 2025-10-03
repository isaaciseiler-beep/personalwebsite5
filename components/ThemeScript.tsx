// components/ThemeScript.tsx
export default function ThemeScript() {
  const code = `
  (function() {
    try {
      // Temporarily force dark as default
      var theme = "dark";
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = "dark";
      // Persist so refresh stays dark while the toggle is removed
      try { localStorage.setItem("theme", theme); } catch(e){}
    } catch(e){}
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning />;
}
