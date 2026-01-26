<script lang="ts">
    import { onMount } from "svelte"
    import { t } from "../i18n"
    import ProjectModal from "../components/ProjectModal.svelte"
    import driftImg from "../assets/drift.png"
    import stickyboardImg from "../assets/stickyboard.png"
    import pokedexImg from "../assets/pokedex.png"
    import {
        landFromTop,
        attachCardHover,
        focusGroup,
        resetGroup
    } from "../lib/motion"

    let hero: HTMLElement
    let p1: HTMLElement
    let p2: HTMLElement
    let p3: HTMLElement

    let activeProject: string | null = null

    onMount(() => {
        const cards = [p1, p2, p3]

        landFromTop(hero, 0)

        cards.forEach((el, i) => {
            landFromTop(el, 0.14 + i * 0.08)
            attachCardHover(el)
        })

        cards.forEach(el => {
            el.addEventListener("mouseenter", () =>
                focusGroup(el, cards)
            )
            el.addEventListener("mouseleave", () =>
                resetGroup(cards)
            )
        })
    })
</script>

<section>
    <div class="stack">

        <!-- HERO -->
        <div class="card card--raised" bind:this={hero}>
            <h1>{$t("projects.title")}</h1>
            <p>{$t("projects.intro")}</p>
        </div>

        <!-- PROJECT GRID -->
        <div class="grid-3">

            <!-- DRIFT -->
            <div
                    class="card project-card"
                    bind:this={p1}
                    on:click={() => (activeProject = "drift")}
            >
                <div class="project-media">
                    <img
                            src={driftImg}
                            alt="Drift project preview"
                            loading="lazy"
                    />
                </div>


                <h3>{$t("projects.items.alpha.title")}</h3>

                <ul>
                    <li>{$t("projects.items.alpha.bullets.b1")}</li>
                    <li>{$t("projects.items.alpha.bullets.b2")}</li>
                    <li>{$t("projects.items.alpha.bullets.b3")}</li>
                </ul>
            </div>

            <!-- STICKYBOARD -->
            <div
                    class="card project-card"
                    bind:this={p2}
                    on:click={() => (activeProject = "stickyboard")}
            >
                <div class="project-media">
                    <img
                            src={stickyboardImg}
                            alt="Stickyboard project preview"
                            loading="lazy"
                    />
                </div>


                <h3>{$t("projects.items.beta.title")}</h3>

                <ul>
                    <li>{$t("projects.items.beta.bullets.b1")}</li>
                    <li>{$t("projects.items.beta.bullets.b2")}</li>
                    <li>{$t("projects.items.beta.bullets.b3")}</li>
                </ul>
            </div>

            <!-- POKEDEX -->
            <div
                    class="card project-card"
                    bind:this={p3}
                    on:click={() => (activeProject = "pokedex")}
            >
                <div class="project-media">
                    <img
                            src={pokedexImg}
                            alt="Pokédex project preview"
                            loading="lazy"
                    />
                </div>


                <h3>{$t("projects.items.gamma.title")}</h3>

                <ul>
                    <li>{$t("projects.items.gamma.bullets.b1")}</li>
                    <li>{$t("projects.items.gamma.bullets.b2")}</li>
                    <li>{$t("projects.items.gamma.bullets.b3")}</li>
                </ul>
            </div>

        </div>
    </div>

    <!-- MODAL -->
    <ProjectModal
            projectKey={activeProject}
            open={activeProject !== null}
            on:close={() => (activeProject = null)}
    />
</section>
<style>
    .project-media {
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius: 10px;
        margin-bottom: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.02);
    }

    .project-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    .project-card:hover .project-media {
        border-color: var(--accent);
    }

</style>