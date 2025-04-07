'use client';

import { useEffect, useState } from "react";
import AuthProvider from "../../components/providers/AuthProvider";
import Navbar, { NotificationProvider } from "../../components/navigation/Navbar";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (e.matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Prevent hydration issues by rendering children only after mounting
  if (!mounted) {
    return null; // or a loading state/skeleton
  }

  return children;
}

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 