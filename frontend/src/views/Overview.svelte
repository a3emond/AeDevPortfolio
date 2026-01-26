<script lang="ts">
    import { onMount } from "svelte"
    import { t } from "../i18n"

    import {
        landFromLeft,
        landFromRight,
        landFromTop,
        attachCardHover,
        focusGroup,
        resetGroup
    } from "../lib/motion"

    let hero: HTMLElement
    let leftCol: HTMLElement
    let rightCol: HTMLElement

    onMount(() => {
        const cols = [leftCol, rightCol]

        landFromLeft(leftCol)
        landFromRight(rightCol, 0.06)
        landFromTop(hero, 0.18)

        attachCardHover(leftCol)
        attachCardHover(rightCol)

        cols.forEach(el => {
            el.addEventListener("mouseenter", () =>
                focusGroup(el, cols)
            )
            el.addEventListener("mouseleave", () =>
                resetGroup(cols)
            )
        })
    })
</script>

<section>
    <div class="stack">

        <div class="card card--raised" bind:this={hero}>
            <h1>{$t("overview.title")}</h1>
            <p>{$t("overview.intro")}</p>
        </div>

        <div class="grid-2">
            <div class="card" bind:this={leftCol}>
                <h3>{$t("overview.sections.profile.title")}</h3>
                <p>{$t("overview.sections.profile.text")}</p>
            </div>

            <div class="card" bind:this={rightCol}>
                <h3>{$t("overview.sections.philosophy.title")}</h3>
                <p>{$t("overview.sections.philosophy.text")}</p>
            </div>
        </div>

    </div>
</section>
