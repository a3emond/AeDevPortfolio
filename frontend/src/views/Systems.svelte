<script lang="ts">
    import { onMount } from "svelte"
    import { t } from "../i18n"
    import {
        landFromTop,
        landFromLeft,
        landFromRight,
        attachCardHover,
        focusGroup,
        resetGroup
    } from "../lib/motion"

    let hero: HTMLElement
    let layer1: HTMLElement
    let layer2: HTMLElement
    let layer3: HTMLElement

    onMount(() => {
        const layers = [layer1, layer2, layer3]

        landFromTop(hero, 0.05)
        landFromLeft(layer1, 0.18)
        landFromRight(layer2, 0.28)
        landFromLeft(layer3, 0.38)

        layers.forEach(el => attachCardHover(el))

        layers.forEach(el => {
            el.addEventListener("mouseenter", () =>
                focusGroup(el, layers)
            )
            el.addEventListener("mouseleave", () =>
                resetGroup(layers)
            )
        })
    })
</script>

<section>
    <div class="stack">

        <div class="card card--raised" bind:this={hero}>
            <h1>{$t("systems.title")}</h1>
            <p>{$t("systems.intro")}</p>
        </div>

        <div class="card" bind:this={layer1}>
            <h3>{$t("systems.layers.frontend.title")}</h3>
            <p>{$t("systems.layers.frontend.text")}</p>
        </div>

        <div class="card" bind:this={layer2}>
            <h3>{$t("systems.layers.backend.title")}</h3>
            <p>{$t("systems.layers.backend.text")}</p>
        </div>

        <div class="card" bind:this={layer3}>
            <h3>{$t("systems.layers.infrastructure.title")}</h3>
            <p>{$t("systems.layers.infrastructure.text")}</p>
        </div>

    </div>
</section>
