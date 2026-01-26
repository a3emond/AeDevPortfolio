export async function applyIconGlow(buttonEl: HTMLElement) {
    const img = buttonEl.querySelector("img") as HTMLImageElement | null
    if (!img) return

    if (!img.complete || img.naturalWidth === 0) {
        await new Promise<void>((resolve) => {
            const done = () => resolve()
            img.addEventListener("load", done, { once: true })
            img.addEventListener("error", done, { once: true })
        })
    }

    if (!img.complete || img.naturalWidth === 0) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const w = 24
    const h = 24
    canvas.width = w
    canvas.height = h

    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)

    const data = ctx.getImageData(0, 0, w, h).data

    let r = 0
    let g = 0
    let b = 0
    let count = 0

    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3]
        if (a < 24) continue
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
    }

    if (count === 0) return

    buttonEl.style.setProperty("--glow-r", String(Math.round(r / count)))
    buttonEl.style.setProperty("--glow-g", String(Math.round(g / count)))
    buttonEl.style.setProperty("--glow-b", String(Math.round(b / count)))
}
