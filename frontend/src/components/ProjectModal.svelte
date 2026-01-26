<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte"
    import { t } from "../i18n"

    export let projectKey: string | null = null
    export let open = false

    const dispatch = createEventDispatcher()

    function close() {
        dispatch("close")
    }

    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") close()
    }

    onMount(() => window.addEventListener("keydown", onKey))
    onDestroy(() => window.removeEventListener("keydown", onKey))

    $: base = projectKey ? `project_modals.${projectKey}` : null
</script>

{#if open && projectKey}
    <!-- BACKDROP -->
    <div class="modal-backdrop" on:click={close} />

    <!-- MODAL -->
    <div class="modal-card card card--raised" role="dialog" aria-modal="true">
        <!-- CLOSE -->
        <button class="modal-close" on:click={close} aria-label="Close">
            ×
        </button>

        <header>
            <h2>{$t(`${base}.title`)}</h2>
            <p class="muted">{$t(`${base}.tagline`)}</p>

            <!-- LINKS -->
            <div class="modal-links">
                <a
                        href={$t(`${base}.links.0.url`)}
                        target="_blank"
                        rel="noopener"
                >
                    <i class="fa-solid fa-globe"></i>
                    {$t(`${base}.links.0.label`)}
                </a>

                <a
                        href={$t(`${base}.links.1.url`)}
                        target="_blank"
                        rel="noopener"
                >
                    <i class="fa-brands fa-github"></i>
                    {$t(`${base}.links.1.label`)}
                </a>
            </div>
        </header>

        <section>
            <p>{$t(`${base}.overview`)}</p>
        </section>

        <section>
            <h4>Architecture</h4>
            <ul>
                <li>{$t(`${base}.architecture.0`)}</li>
                <li>{$t(`${base}.architecture.1`)}</li>
                <li>{$t(`${base}.architecture.2`)}</li>
            </ul>
        </section>

        <section>
            <h4>Constraints</h4>
            <ul>
                <li>{$t(`${base}.constraints.0`)}</li>
                <li>{$t(`${base}.constraints.1`)}</li>
                <li>{$t(`${base}.constraints.2`)}</li>
            </ul>
        </section>

        <section>
            <h4>Stack</h4>
            <ul>
                <li>{$t(`${base}.stack.0`)}</li>
                <li>{$t(`${base}.stack.1`)}</li>
                <li>{$t(`${base}.stack.2`)}</li>
                <li>{$t(`${base}.stack.3`)}</li>
                <li>{$t(`${base}.stack.4`)}</li>
            </ul>
        </section>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(2px);
        z-index: 1000;
    }

    .modal-card {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(92vw, 720px);
        max-height: 85vh;
        overflow-y: auto;
        z-index: 1001;
        padding: 1.5rem;
    }

    .modal-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text);
    }

    .modal-links {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .modal-links a {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.9rem;
        color: var(--accent);
        text-decoration: none;
    }

    .modal-links a:hover {
        opacity: 0.7;
    }
</style>
