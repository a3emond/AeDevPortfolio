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

    import { applyIconGlow } from "../lib/skills/glow"
    import type { Skill } from "../lib/skills/types"

    let hero: HTMLElement
    let wall: HTMLElement

    let activeId: string | null = null
    let activeSkill: Skill | null = null

    const iconMap = new Map<string, HTMLElement>()
    const iconEls: HTMLElement[] = []

    let skills: Skill[] = []
    let paddedItems: (Skill | null)[] = []

    const dict = { en, fr } as const

    function loadSkills(currentLang: "en" | "fr") {
        skills = dict[currentLang].skills_catalog.items
        recomputeGrid()
    }

    function recomputeGrid() {
        if (!wall || skills.length === 0) return

        const cellSize = 68 + 18
        const cols = Math.floor(wall.clientWidth / cellSize)
        if (cols <= 0) return

        const rowsNeeded = Math.ceil(skills.length / cols)
        const totalRows = Math.max(6, rowsNeeded + 2)
        const totalCells = totalRows * cols

        const grid: (Skill | null)[] = Array(totalCells).fill(null)
        const startRow = Math.floor((totalRows - rowsNeeded) / 2)

        skills.forEach((skill, index) => {
            const row = Math.floor(index / cols)
            const colInRow = index % cols

            const skillsInThisRow =
                row === rowsNeeded - 1
                    ? skills.length - row * cols
                    : cols

            const colOffset = Math.floor(
                (cols - skillsInThisRow) / 2
            )

            const col = colOffset + colInRow
            const cellIndex = (startRow + row) * cols + col

            grid[cellIndex] = skill
        })

        paddedItems = grid
    }

    function iconRef(node: HTMLElement, skillId: string) {
        iconMap.set(skillId, node)
        iconEls.push(node)

        return {
            destroy() {
                iconMap.delete(skillId)
                const i = iconEls.indexOf(node)
                if (i !== -1) iconEls.splice(i, 1)
            }
        }
    }

    async function selectSkill(skill: Skill) {
        activeId = skill.id
        activeSkill = skill

        const el = iconMap.get(skill.id)
        if (el) focusGroupStrong(el, iconEls)

        await tick()
    }

    function clearSelection() {
        activeId = null
        activeSkill = null
        resetGroupStrong(iconEls)
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") clearSelection()
    }

    let unsubscribeLang: () => void

    onMount(async () => {
        landFromTop(hero, 0.05)

        unsubscribeLang = lang.subscribe((l) => {
            loadSkills(l)
        })

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("resize", recomputeGrid)

        await tick()

        for (const s of skills) {
            const el = iconMap.get(s.id)
            if (el) applyIconGlow(el)
        }
    })

    onDestroy(() => {
        unsubscribeLang?.()
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("resize", recomputeGrid)
    })
</script>

<section>
    <div class="stack">

        <!-- HERO -->
        <div class="card card--raised" bind:this={hero}>
            <h1>{$t("skills.title")}</h1>
            <p>{$t("skills.intro")}</p>
        </div>

        <!-- SKILLS WALL -->
        <div class="skills-wall" bind:this={wall}>
            {#each paddedItems as item}
                {#if item}
                    <button
                            class="skill-btn"
                            class:is-active={activeId === item.id}
                            class:is-dimmed={activeId && activeId !== item.id}
                            use:iconRef={item.id}
                            on:mouseenter={() => selectSkill(item)}
                            on:focus={() => selectSkill(item)}
                            on:click={() => selectSkill(item)}
                            aria-pressed={activeId === item.id}
                            aria-label={`Select ${item.name}`}
                    >
                        <span class="skill-badge">
                            <img src={item.icon} alt={item.name} />
                        </span>
                    </button>
                {:else}
                    <div class="slot empty" aria-hidden="true"></div>
                {/if}
            {/each}
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
