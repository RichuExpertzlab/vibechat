// ThemeToggle.jsx
import { useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        setDark(!dark);
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}