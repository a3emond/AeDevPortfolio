<script lang="ts">
  import NavBar from "./components/NavBar.svelte"
  import Footer from "./components/Footer.svelte"
  import Assistant from "./components/Assistant.svelte"

  import Overview from "./views/Overview.svelte"
  import Projects from "./views/Projects.svelte"
  import Systems from "./views/Systems.svelte"
  import Skills from "./views/Skills.svelte"
  import Contact from "./views/Contact.svelte"

  import { toggleTheme } from "./theme"

  type View = "overview" | "projects" | "systems" | "skills" | "contact"
  let view: View = "overview"

  function navigate(v: View) {
    view = v
  }

  let theme: "dark" | "light" =
          document.body.dataset.theme === "light" ? "light" : "dark"

  function onToggleTheme() {
    theme = toggleTheme()
  }
</script>

<NavBar
        {view}
        onNavigate={navigate}
        {theme}
        {onToggleTheme}
/>

<main>
  <div class="main-content">
    {#if view === "overview"} <Overview />
    {:else if view === "projects"} <Projects />
    {:else if view === "systems"} <Systems />
    {:else if view === "skills"} <Skills />
    {:else if view === "contact"} <Contact />
    {/if}
  </div>
</main>

<Assistant />
<Footer />
