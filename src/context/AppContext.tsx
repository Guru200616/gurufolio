import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  trackPageView: () => void;
  trackDownload: () => void;
  trackNewVisitor: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state init
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('guru-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Dark theme default as requested or modern vibe
  });

  // Toasts queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('guru-theme', theme);
  }, [theme]);

  // Initial visitor logging
  useEffect(() => {
    const sessionVisited = sessionStorage.getItem('guru-visited');
    if (!sessionVisited) {
      trackNewVisitor();
      sessionStorage.setItem('guru-visited', 'true');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Telemetry wrappers
  const trackPageView = async () => {
    try {
      await fetch('/api/analytics/view', { method: 'POST' });
    } catch (e) {
      console.warn('PageView tracker silent status update fail.', e);
    }
  };

  const trackNewVisitor = async () => {
    try {
      await fetch('/api/analytics/visitor', { method: 'POST' });
    } catch (e) {
      console.warn('Visitor tracker silent status update fail.', e);
    }
  };

  const trackDownload = async () => {
    try {
      await fetch('/api/analytics/download', { method: 'POST' });
      showToast('Resume download logged securely!', 'info');
    } catch (e) {
      console.warn('Download telemetry sync error.', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
        trackPageView,
        trackDownload,
        trackNewVisitor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used inside an AppProvider wrapper.');
  }
  return context;
};
