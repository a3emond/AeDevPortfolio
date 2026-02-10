<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte"
    import { t, lang } from "../i18n"
    import en from "../i18n/en.json"
    import fr from "../i18n/fr.json"

    import {
        landFromTop,
        focusGroupStrong,
        resetGroupStrong
    } from "../lib/motion"

    import { animate } from "motion"
    import { applyIconGlow } from "../lib/skills/glow"
    import type { Skill } from "../lib/skills/types"

    let hero: HTMLElement
    let wall: HTMLElement
    let orbitLayer: HTMLElement
    let sun: HTMLElement

    let resizeObserver: ResizeObserver
    let raf: number | null = null

    let activeId: string | null = null
    let activeSkill: Skill | null = null

    const dict = { en, fr } as const

    let skills: Skill[] = []
    let latticeCells = 0

    // Node element registry by skill id
    const nodeMap = new Map<string, HTMLElement>()
    const nodeEls: HTMLElement[] = []

    /* -------------------------------------------------- */
    /* DATA */
    /* -------------------------------------------------- */

    function loadSkills(l: "en" | "fr") {
        skills = dict[l].skills_catalog.items
    }

    /* -------------------------------------------------- */
    /* LATTICE (AMBIENT GRID) */
    /* -------------------------------------------------- */

    function computeLatticeCellCount(): number {

        if (!wall) return 0

        const style = getComputedStyle(wall)

        const cols = style
            .gridTemplateColumns
            .split(" ")
            .length

        const rowH = parseFloat(style.gridAutoRows)
        const gap = parseFloat(style.rowGap)

        const usable =
            wall.clientHeight -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom)

        const rows = Math.max(
            1,
            Math.floor((usable + gap) / (rowH + gap))
        )

        return cols * rows
    }

    /* -------------------------------------------------- */
    /* ORBIT GEOMETRY */
    /* -------------------------------------------------- */

    type OrbitPoint = { x: number; y: number; scale: number; z: number }

    function computeOrbitPoints(count: number) {

        const w = wall.clientWidth
        const h = wall.clientHeight

        const cx = w / 2
        const cy = h / 2

        const minDim = Math.min(w, h)

        const r1 = minDim * 0.28
        const r2 = minDim * 0.44

        const ring1Count = Math.round(count * 0.4)
        const ring2Count = count - ring1Count

        const points = []

        function ring(n, r, phase) {

            for (let i = 0; i < n; i++) {

                const a = phase + (i / n) * Math.PI * 2

                const x = cx + Math.cos(a) * r
                const y = cy + Math.sin(a) * r * 0.85

                const depth = (Math.sin(a) + 1) / 2

                const scale = 0.85 + depth * 0.25
                const z = Math.round(depth * 30)

                points.push({ x, y, scale, z })
            }
        }

        ring(ring1Count, r1, 0)
        ring(ring2Count, r2, Math.PI / 6)

        return points
    }


    /* -------------------------------------------------- */
    /* SUN (CENTER SWAP) */
    /* -------------------------------------------------- */

    function setSunToSkill(skill: Skill) {

        activeId = skill.id
        activeSkill = skill

        // update sun icon markup
        sun.innerHTML = `
        <span class="sun-badge">
            <img src="${skill.icon}" alt="${skill.name}" />
        </span>
    `

        // copy glow vars from the hovered node if present
        const node = nodeMap.get(skill.id)

        if (node) {
            const badge = node.querySelector(".orbit-badge") as HTMLElement | null
            const sunBadge = sun.querySelector(".sun-badge") as HTMLElement | null

            if (badge && sunBadge) {

                const s = getComputedStyle(badge)

                // only copy if present; fallback uses theme accent vars already
                const r = s.getPropertyValue("--glow-r").trim()
                const g = s.getPropertyValue("--glow-g").trim()
                const b = s.getPropertyValue("--glow-b").trim()

                if (r) sunBadge.style.setProperty("--glow-r", r)
                if (g) sunBadge.style.setProperty("--glow-g", g)
                if (b) sunBadge.style.setProperty("--glow-b", b)
            }
        }
    }

    /* -------------------------------------------------- */
    /* MASK (GLOW-SAFE) */
    /* -------------------------------------------------- */

    function updateMask() {

        if (!wall || nodeEls.length === 0) return

        const r = wall.getBoundingClientRect()

        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2

        let max = 0

        for (const el of nodeEls) {

            const e = el.getBoundingClientRect()

            const x = e.left + e.width / 2
            const y = e.top + e.height / 2

            const dx = x - cx
            const dy = y - cy

            const d = Math.sqrt(dx * dx + dy * dy)

            if (d > max) max = d
        }

        // allow glow + fade border
        const inner = max + 84
        const outer = inner + 110

        wall.style.setProperty("--mask-inner", inner + "px")
        wall.style.setProperty("--mask-outer", outer + "px")
    }

    /* -------------------------------------------------- */
    /* NODE ACTION */
    /* -------------------------------------------------- */

    function nodeRef(node: HTMLElement, skillId: string) {

        nodeMap.set(skillId, node)
        nodeEls.push(node)

        // apply glow extraction to the badge (not wrapper)
        const badge = node.querySelector(".orbit-badge") as HTMLElement | null
        if (badge) applyIconGlow(badge)

        return {
            destroy() {
                nodeMap.delete(skillId)
                const i = nodeEls.indexOf(node)
                if (i !== -1) nodeEls.splice(i, 1)
            }
        }
    }

    /* -------------------------------------------------- */
    /* ORBIT LOOP */
    /* -------------------------------------------------- */

    let orbitT0 = 0

    function orbitFrame(t: number) {

        if (!wall) return

        if (!orbitT0) orbitT0 = t
        const dt = t - orbitT0

        // slow continuous movement
        const phase1 = dt * 0.00014
        const phase2 = dt * 0.00010

        const points = computeOrbitPoints(skills.length)

        // stable ordering: map nodes in skills order to points
        // points already built ring1 then ring2; use small phase offsets to animate
        skills.forEach((skill, i) => {

            const el = nodeMap.get(skill.id)
            if (!el) return

            const p = points[i]
            if (!p) return

            // apply orbit phase animation without recomputing topology
            const cx = wall.clientWidth / 2
            const cy = wall.clientHeight / 2

            const baseDx = p.x - cx
            const baseDy = (p.y - cy) / 0.82

            const baseR = Math.sqrt(baseDx * baseDx + baseDy * baseDy)

            // decide ring by radius
            const ringPhase = baseR < Math.min(wall.clientWidth, wall.clientHeight) * 0.25
                ? phase1
                : phase2

            const a0 = Math.atan2(baseDy, baseDx)
            const a = a0 + ringPhase

            const x = cx + Math.cos(a) * baseR
            const y = cy + Math.sin(a) * baseR * 0.82

            const depth = (Math.sin(a) + 1) / 2
            const scale = 0.92 + depth * 0.18
            const z = Math.round(10 + depth * 20)

            const rect = el.getBoundingClientRect()
            const halfW = rect.width / 2
            const halfH = rect.height / 2

            el.style.transform =
                `translate(${x - halfW}px, ${y - halfH}px) scale(${scale})`


            el.style.zIndex = String(z)
            el.style.opacity = activeId && activeId !== skill.id ? "0.55" : "1"
        })

        raf = requestAnimationFrame(orbitFrame)
    }

    /* -------------------------------------------------- */
    /* INTERACTION */
    /* -------------------------------------------------- */

    async function selectSkill(skill: Skill) {

        setSunToSkill(skill)

        // focus dims others (uses your Motion helper on wrappers)
        const el = nodeMap.get(skill.id)
        if (el) focusGroupStrong(el, nodeEls)

        // sun pulse
        animate(
            sun,
            {
                transform: [
                    "translate(-50%, -50%) scale(1)",
                    "translate(-50%, -50%) scale(1.08)",
                    "translate(-50%, -50%) scale(1)"
                ]
            },
            { duration: 0.42, easing: "ease-out" }
        )


        await tick()
    }

    function clearSelection() {

        activeId = null
        activeSkill = null

        resetGroupStrong(nodeEls)

        // default sun if you want: first skill
        if (skills[0]) setSunToSkill(skills[0])
    }

    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") clearSelection()
    }

    /* -------------------------------------------------- */
    /* LIFECYCLE */
    /* -------------------------------------------------- */

    let unsubLang: () => void

    async function rebuild() {

        if (!wall) return

        latticeCells = computeLatticeCellCount()

        await tick()

        // ensure we have a sun skill
        if (!activeSkill && skills[0]) setSunToSkill(skills[0])

        updateMask()
    }

    onMount(async () => {

        landFromTop(hero, 0.05)

        unsubLang = lang.subscribe(async l => {

            loadSkills(l)

            await tick()

            await rebuild()
        })

        resizeObserver = new ResizeObserver(() => {
            // rebuild lattice and mask, orbit loop will continue
            rebuild()
        })

        resizeObserver.observe(wall)

        window.addEventListener("keydown", onKey)

        await tick()

        await rebuild()

        raf = requestAnimationFrame(orbitFrame)
    })

    onDestroy(() => {

        if (raf) cancelAnimationFrame(raf)

        resizeObserver.disconnect()

        window.removeEventListener("keydown", onKey)

        unsubLang?.()
    })
</script>

<section>
    <div class="stack">

        <!-- HERO -->
        <div class="card" bind:this={hero}>
            <h1>{$t("skills.title")}</h1>
            <p>{$t("skills.intro")}</p>
        </div>

        <!-- SKILLS WALL -->
        <div class="skills-wall" bind:this={wall}>

            <!-- ambient lattice (tapestry) -->
            {#each Array(latticeCells) as _}
                <div class="slot empty" aria-hidden="true"></div>
            {/each}

            <!-- orbit layer -->
            <div class="orbit-layer" bind:this={orbitLayer} aria-label="Skills orbit">

                <button
                        class="sun"
                        bind:this={sun}
                        on:click={() => activeSkill && selectSkill(activeSkill)}
                        aria-label="Focused skill"
                ></button>

                {#each skills as s (s.id)}
                    <button
                            class="orbit-node"
                            use:nodeRef={s.id}
                            class:is-active={activeId === s.id}
                            on:mouseenter={() => selectSkill(s)}
                            on:focus={() => selectSkill(s)}
                            on:click={() => selectSkill(s)}
                            aria-pressed={activeId === s.id}
                            aria-label={`Select ${s.name}`}
                    >
                        <span class="orbit-badge">
                            <img src={s.icon} alt={s.name} />
                        </span>
                    </button>
                {/each}

            </div>
        </div>

        <!-- DOCK -->
        <div class="skill-dock card">
            {#if activeSkill}
                <h3>{activeSkill.name}</h3>
                <p>{activeSkill.description}</p>
                <div class="tags">
                    {#each activeSkill.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            {:else}
                <p class="muted">
                    {$t("skills.dock.empty")}
                </p>
            {/if}
        </div>

    </div>
</section>
