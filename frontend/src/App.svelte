<script lang="ts">

  import { onMount } from "svelte"

  import NavBar from "./components/NavBar.svelte"
  import Footer from "./components/Footer.svelte"
  import Assistant from "./components/Assistant.svelte"

  import Overview from "./views/Overview.svelte"
  import Projects from "./views/Projects.svelte"
  import Systems from "./views/Systems.svelte"
  import Skills from "./views/Skills.svelte"
  import Contact from "./views/Contact.svelte"

  import { toggleTheme } from "./theme"

  type View =
          | "overview"
          | "projects"
          | "systems"
          | "skills"
          | "contact"

  let view: View = "overview"

  /* FIX: container must be declared */
  let container: HTMLElement

  function navigate(v: View) {

    view = v

    if (!container) return

    const target =
            container.querySelector(`#${v}`)

    if (target) {

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })

    }

  }

  let theme: "dark" | "light" =
          document.body.dataset.theme === "light"
                  ? "light"
                  : "dark"

  function onToggleTheme() {
    theme = toggleTheme()
  }

  onMount(() => {

    if (!container) return

    const observer =
            new IntersectionObserver(

                    (entries) => {

                      for (const entry of entries) {

                        if (entry.isIntersecting) {

                          view =
                                  entry.target.id as View

                        }

                      }

                    },

                    {
                      root: container,
                      threshold: 0.6
                    }

            )

    container
            .querySelectorAll(".snap-section")
            .forEach(el =>
                    observer.observe(el)
            )

  })

</script>



<NavBar
        {view}
        onNavigate={navigate}
        {theme}
        {onToggleTheme}
/>


<main
        class="snap-container"
        bind:this={container}
>

  <section
          id="overview"
          class="snap-section"
  >
    <Overview />
  </section>


  <section
          id="projects"
          class="snap-section"
  >
    <Projects />
  </section>


  <section
          id="systems"
          class="snap-section"
  >
    <Systems />
  </section>


  <section
          id="skills"
          class="snap-section"
  >
    <Skills />
  </section>


  <section
          id="contact"
          class="snap-section"
  >
    <Contact />
  </section>

</main>


<Assistant />

<Footer />
