import { writable, derived } from "svelte/store"
import en from "./en.json"
import fr from "./fr.json"

export type Lang = "en" | "fr"

const dict = { en, fr } as const
const STORAGE_KEY = "lang"

// ---- language store ----
export const lang = writable<Lang>("en")

// ---- initialization (call once at startup) ----
export function initLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null

    if (stored && stored in dict) {
        lang.set(stored)
        return
    }

    const device = navigator.language.toLowerCase()
    const detected: Lang = device.startsWith("fr") ? "fr" : "en"

    lang.set(detected)
    localStorage.setItem(STORAGE_KEY, detected)
}

// ---- explicit user change ----
export function setLanguage(l: Lang) {
    if (!(l in dict)) return
    localStorage.setItem(STORAGE_KEY, l)
    lang.set(l)
}

// ---- reactive translator ----
export const t = derived(lang, ($lang) => {
    return (path: string): string => {
        const parts = path.split(".")
        let value: any = dict[$lang]

        for (const p of parts) {
            value = value?.[p]
            if (value == null) break
        }

        return typeof value === "string" ? value : path
    }
})



