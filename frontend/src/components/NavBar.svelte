<script lang="ts">
    import { t, lang, setLanguage } from "../i18n"
    import logo from "../assets/logo.png"


    export let view: string
    export let onNavigate: (view: string) => void

    export let theme: "dark" | "light" = "dark"
    export let onToggleTheme: () => void = () => {}

    let mobileOpen = false

    function go(v: string) {
        mobileOpen = false
        onNavigate(v)
    }
</script>

<nav>
    <!-- Logo -->
    <button
            class="nav-logo"
            aria-label="Home"
            on:click={() => go("overview")}
    >
        <img src={logo} alt="AEDev logo" />

    </button>

    <!-- Navigation -->
    <div class="nav-links" data-open={mobileOpen}>
        <button data-active={view === "overview"} on:click={() => go("overview")}>
            {$t("nav.overview")}
        </button>
        <button data-active={view === "projects"} on:click={() => go("projects")}>
            {$t("nav.projects")}
        </button>
        <button data-active={view === "systems"} on:click={() => go("systems")}>
            {$t("nav.systems")}
        </button>
        <button data-active={view === "skills"} on:click={() => go("skills")}>
            {$t("nav.skills")}
        </button>
        <button data-active={view === "contact"} on:click={() => go("contact")}>
            {$t("nav.contact")}
        </button>
    </div>

    <!-- Right controls -->
    <div class="nav-right">
        <!-- Social links -->
        <a
                href="https://github.com/a3emond"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style="text-decoration: none;"
        >
            <i class="fa-brands fa-github"></i>
        </a>

        <a
                href="https://www.linkedin.com/in/a-emond/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style="text-decoration: none;"
        >
            <i class="fa-brands fa-linkedin-in"></i>
        </a>

        <a
                href="mailto:admin@aedev.pro"
                aria-label="Email"
                style="text-decoration: none;"
        >
            <i class="fa-solid fa-envelope"></i>
        </a>

        <!-- Language toggle -->
        <button
                class="nav-icon"
                on:click={() => setLanguage($lang === "fr" ? "en" : "fr")}
        >
            {$lang === "fr" ? "FR" : "EN"}
        </button>

        <!-- Theme toggle -->
        <button
                class="nav-icon"
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                on:click={onToggleTheme}
        >
            <i
                    aria-hidden="true"
                    class={theme === "dark"
            ? "fa-solid fa-moon"
            : "fa-solid fa-sun"}
            ></i>
        </button>


        <!-- Mobile menu -->
        <button
                class="nav-burger"
                aria-label="Menu"
                data-open={mobileOpen}
                on:click={() => (mobileOpen = !mobileOpen)}
        >
            <span></span>
            <span></span>
        </button>
    </div>
</nav>
