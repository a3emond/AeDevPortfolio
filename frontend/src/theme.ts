export type Theme = "dark" | "light"

const STORAGE_KEY = "theme"

export function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null

    if (stored === "dark" || stored === "light") {
        applyTheme(stored)
        return
    }

    const prefersLight =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches

    applyTheme(prefersLight ? "light" : "dark")
}

export function toggleTheme(): Theme {
    const current =
        document.body.dataset.theme === "light" ? "light" : "dark"

    const next: Theme = current === "dark" ? "light" : "dark"
    applyTheme(next)
    return next
}

export function applyTheme(theme: Theme) {
    document.body.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
}
