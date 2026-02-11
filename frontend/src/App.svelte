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

  let container: HTMLElement

  let observer: IntersectionObserver

  function scrollToView(v: View, smooth = true) {

    if (!container) return

    const target =
            container.querySelector(`#${v}`)

    if (!target) return

    target.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start"
    })

  }

  function navigate(v: View) {

    if (v === view) return

    view = v

    history.pushState(null, "", "#" + v)

    scrollToView(v, true)

  }

  let theme: "dark" | "light" =
          document.body.dataset.theme === "light"
                  ? "light"
                  : "dark"

  function onToggleTheme() {
    theme = toggleTheme()
  }

  function handlePopState() {

    const hash =
            location.hash.replace("#", "") as View

    if (!hash) return

    view = hash

    scrollToView(hash, false)

  }

  onMount(() => {

    if (!container) return

    observer =
            new IntersectionObserver(

                    (entries) => {

                      for (const entry of entries) {

                        if (!entry.isIntersecting)
                          continue

                        const newView =
                                entry.target.id as View

                        if (newView === view)
                          continue

                        view = newView

                        history.replaceState(
                                null,
                                "",
                                "#" + newView
                        )

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

    window.addEventListener(
            "popstate",
            handlePopState
    )

    const initial =
            location.hash.replace("#", "") as View

    if (initial) {

      view = initial

      requestAnimationFrame(() => {
        scrollToView(initial, false)
      })

    }

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
