import { animate } from "motion"

/* ======================================================
   MOTION TOKENS (SECONDS, LOCKED)
   ====================================================== */

const DUR_FAST = 0.12
const DUR = 0.18
const DUR_LAND = 0.65

const EASE_OUT = "ease-out"
const EASE_IN = "ease-in"

/* ======================================================
   INTERNAL PREP (CRITICAL)
   ====================================================== */

function prepare(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(el.style, styles)
}

/* ======================================================
   CARD HOVER
   ====================================================== */

export function attachCardHover(el: HTMLElement) {
    el.addEventListener("mouseenter", () => {
        animate(el, { scale: 1.03 }, { duration: DUR, easing: EASE_OUT })
        el.style.boxShadow = "0 0 0 1px var(--accent), var(--shadow-md)"
    })

    el.addEventListener("mouseleave", () => {
        animate(el, { scale: 1 }, { duration: DUR, easing: EASE_IN })
        el.style.boxShadow = "var(--shadow-sm)"
    })
}

/* ======================================================
   LANDING / BOUNCE ENTRANCES
   ====================================================== */

export function landFromLeft(el: HTMLElement, delay = 0) {
    prepare(el, { opacity: "0", transform: "translateX(-140px)" })

    requestAnimationFrame(() => {
        animate(
            el,
            { x: [-140, 16, -6, 0], opacity: [0, 1] },
            { duration: DUR_LAND, easing: EASE_OUT, delay }
        )
    })
}

export function landFromRight(el: HTMLElement, delay = 0) {
    prepare(el, { opacity: "0", transform: "translateX(140px)" })

    requestAnimationFrame(() => {
        animate(
            el,
            { x: [140, -16, 6, 0], opacity: [0, 1] },
            { duration: DUR_LAND, easing: EASE_OUT, delay }
        )
    })
}

export function landFromTop(el: HTMLElement, delay = 0) {
    prepare(el, { opacity: "0", transform: "translateY(-36px)" })

    requestAnimationFrame(() => {
        animate(
            el,
            { y: [-36, 10, -4, 0], opacity: [0, 1] },
            { duration: DUR_LAND * 0.85, easing: EASE_OUT, delay }
        )
    })
}

/* ======================================================
   LIGHT GROUP DIMMING (HOVER FOCUS)
   ====================================================== */

export function focusGroup(active: HTMLElement, group: HTMLElement[]) {
    group.forEach((el) => {
        animate(el, { opacity: el === active ? 1 : 0.7 }, { duration: DUR_FAST })
    })
}

export function resetGroup(group: HTMLElement[]) {
    group.forEach((el) => {
        animate(el, { opacity: 1 }, { duration: DUR_FAST })
    })
}

/* ======================================================
   PRESS FEEDBACK
   ====================================================== */

export function attachPress(el: HTMLElement) {
    el.addEventListener("mousedown", () => {
        animate(el, { scale: 0.98 }, { duration: DUR_FAST })
    })

    el.addEventListener("mouseup", () => {
        animate(el, { scale: 1 }, { duration: DUR_FAST })
    })

    el.addEventListener("mouseleave", () => {
        animate(el, { scale: 1 }, { duration: DUR_FAST })
    })
}

/* ======================================================
   SYSTEM HIGHLIGHT
   ====================================================== */

export function highlightOnce(el: HTMLElement) {
    el.style.boxShadow = "0 0 0 2px var(--accent)"

    animate(el, { scale: [1, 1.04, 1] }, { duration: 0.4, easing: EASE_OUT })

    setTimeout(() => {
        el.style.boxShadow = "var(--shadow-sm)"
    }, 400)
}

/* ======================================================
   GRID / SKILL WALL HELPERS (ADD-ONLY)
   ====================================================== */

// Slightly stronger focus effect for dense icon walls
export function focusGroupStrong(active: HTMLElement, group: HTMLElement[]) {
    group.forEach((el) => {
        animate(
            el,
            { opacity: el === active ? 1 : 0.45, scale: el === active ? 1.02 : 0.98 },
            { duration: 0.12, easing: "ease-out" }
        )
    })
}

export function resetGroupStrong(group: HTMLElement[]) {
    group.forEach((el) => {
        animate(el, { opacity: 1, scale: 1 }, { duration: 0.12, easing: "ease-out" })
    })
}
