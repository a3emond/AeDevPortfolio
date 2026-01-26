<script lang="ts">
    import { t } from "../i18n"

    let open = false

    function toggle() {
        open = !open
    }
</script>

<div class="assistant">
    {#if !open}
        <!-- Collapsed dock -->
        <button class="assistant-dock" on:click={toggle}>
            <span class="assistant-dot"></span>
            <span class="assistant-label">
                {$t("assistant.label")}
            </span>
        </button>
    {:else}
        <!-- Expanded panel -->
        <div class="assistant-panel">
            <div class="assistant-header">
                <span class="assistant-title">
                    {$t("assistant.title")}
                </span>
                <button class="assistant-close" on:click={toggle}>×</button>
            </div>

            <div class="assistant-body">
                <p>
                    {$t("assistant.description")}
                </p>
            </div>

            <div class="assistant-input">
                <input
                        type="text"
                        placeholder={$t("assistant.placeholder")}
                        disabled
                />
            </div>
        </div>
    {/if}
</div>
