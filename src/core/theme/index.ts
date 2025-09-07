import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

type ThemeStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme })
        applyThemeToDocument(theme)
      },
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        applyThemeToDocument(newTheme)
      },
    }),
    {
      name: 'laplas-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDocument(state.theme)
        }
      },
    }
  )
)

const applyThemeToDocument = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }
}

// Initialize theme on app start
export const initializeTheme = () => {
  const { theme } = useTheme.getState()
  applyThemeToDocument(theme)
}