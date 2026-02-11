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
    let submitBtn: HTMLButtonElement

    let name = ""
    let email = ""
    let message = ""

    let loading = false
    let success = false
    let error = ""

    let touched = {
        name: false,
        email: false,
        message: false
    }

    function isEmailValid(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }

    function validate(): boolean {

        touched = {
            name: true,
            email: true,
            message: true
        }

        if (!name || !email || !message)
            return false

        if (!isEmailValid(email))
            return false

        return true
    }

    function resetForm() {

        name = ""
        email = ""
        message = ""

        touched = {
            name: false,
            email: false,
            message: false
        }

    }

    async function submit() {

        if (loading)
            return

        error = ""
        success = false

        if (!validate()) {

            highlightOnce(formCard)
            return

        }

        loading = true

        try {

            const response =
                await fetch("/api/contact", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        message
                    })

                })

            if (!response.ok) {

                let serverMessage = ""

                try {

                    const data = await response.json()
                    serverMessage = data?.error ?? ""

                }
                catch {}

                throw new Error(
                    serverMessage ||
                    "Server rejected request"
                )

            }

            success = true

            resetForm()

        }
        catch (err: any) {

            if (
                err?.message?.includes("Failed to fetch")
            ) {

                error =
                    "Connection failed. Please try again."

            }
            else if (err?.message) {

                error = err.message

            }
            else {

                error =
                    "Unexpected error occurred."

            }

            highlightOnce(formCard)

        }
        finally {

            loading = false

        }

    }

    onMount(() => {

        landFromTop(hero, 0.05)
        landFromTop(formCard, 0.15)
        attachPress(submitBtn)

    })
</script>


<section>
    <div class="stack">

        <div class="card card--raised" bind:this={hero}>
            <h1>{$t("contact.title")}</h1>
            <p>{$t("contact.subtitle")}</p>
        </div>

        <div class="card card--raised" bind:this={formCard}>

            <form on:submit|preventDefault={submit}>

                <div class="field">

                    <label for="name">
                        {$t("contact.form.name")}
                    </label>

                    <input
                            id="name"
                            type="text"
                            bind:value={name}
                            on:blur={() => touched.name = true}
                            disabled={loading}
                    />

                    {#if touched.name && !name}
                        <span class="error">
                            {$t("contact.errors.name_required")}
                        </span>
                    {/if}

                </div>


                <div class="field">

                    <label for="email">
                        {$t("contact.form.email")}
                    </label>

                    <input
                            id="email"
                            type="email"
                            bind:value={email}
                            on:blur={() => touched.email = true}
                            disabled={loading}
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

                    <label for="message">
                        {$t("contact.form.message")}
                    </label>

                    <textarea
                            id="message"
                            rows="5"
                            bind:value={message}
                            on:blur={() => touched.message = true}
                            disabled={loading}
                    ></textarea>

                    {#if touched.message && !message}
                        <span class="error">
                            {$t("contact.errors.message_required")}
                        </span>
                    {/if}

                </div>


                <div class="actions">

                    <button
                            bind:this={submitBtn}
                            type="submit"
                            disabled={loading}
                    >

                        {#if loading}
                            Sending...
                        {:else}
                            {$t("contact.form.submit")}
                        {/if}

                    </button>

                </div>


                {#if success}
                    <div class="success">
                        Message sent successfully.
                    </div>
                {/if}


                {#if error}
                    <div class="error">
                        {error}
                    </div>
                {/if}

            </form>

        </div>

    </div>
</section>
