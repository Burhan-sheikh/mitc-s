import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  }
}));