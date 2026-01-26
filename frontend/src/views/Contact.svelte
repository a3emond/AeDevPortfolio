<script lang="ts">
    import { onMount } from "svelte"
    import { t } from "../i18n"
    import {
        landFromTop,
        attachPress,
        highlightOnce
    } from "../lib/motion"

    let hero: HTMLElement
    let formCard: HTMLElement
    let submitBtn: HTMLElement

    let name = ""
    let email = ""
    let message = ""

    let touched = {
        name: false,
        email: false,
        message: false
    }

    function isEmailValid(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }

    onMount(() => {
        landFromTop(hero, 0.05)
        landFromTop(formCard, 0.15)
        attachPress(submitBtn)
    })

    function submit() {
        touched = { name: true, email: true, message: true }

        if (!name || !email || !message) {
            highlightOnce(formCard)
            return
        }

        if (!isEmailValid(email)) {
            highlightOnce(formCard)
            return
        }

        // TODO backend
        console.log("Contact submit", { name, email, message })

        highlightOnce(formCard)
    }
</script>

<section>
    <div class="stack">

        <!-- HERO -->
        <div class="card card--raised" bind:this={hero}>
            <h1>{$t("contact.title")}</h1>
            <p>{$t("contact.subtitle")}</p>
        </div>

        <!-- FORM -->
        <div class="card card--raised" bind:this={formCard}>
            <form on:submit|preventDefault={submit}>

                <div class="field">
                    <label for="name">{$t("contact.form.name")}</label>
                    <input
                            id="name"
                            type="text"
                            bind:value={name}
                            on:blur={() => (touched.name = true)}
                    />
                    {#if touched.name && !name}
                        <span class="error">
                            {$t("contact.errors.name_required")}
                        </span>
                    {/if}
                </div>

                <div class="field">
                    <label for="email">{$t("contact.form.email")}</label>
                    <input
                            id="email"
                            type="email"
                            bind:value={email}
                            on:blur={() => (touched.email = true)}
                    />
                    {#if touched.email && !email}
                        <span class="error">
                            {$t("contact.errors.email_required")}
                        </span>
                    {:else if touched.email && !isEmailValid(email)}
                        <span class="error">
                            {$t("contact.errors.email_invalid")}
                        </span>
                    {/if}
                </div>

                <div class="field">
                    <label for="message">{$t("contact.form.message")}</label>
                    <textarea
                            id="message"
                            rows="5"
                            bind:value={message}
                            on:blur={() => (touched.message = true)}
                    ></textarea>
                    {#if touched.message && !message}
                        <span class="error">
                            {$t("contact.errors.message_required")}
                        </span>
                    {/if}
                </div>

                <div class="actions">
                    <button bind:this={submitBtn} type="submit">
                        {$t("contact.form.submit")}
                    </button>
                </div>

            </form>
        </div>

    </div>
</section>
