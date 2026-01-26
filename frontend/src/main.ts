import { mount } from "svelte"
import App from "./App.svelte"
import { initLanguage } from "./i18n"
import { initTheme } from "./theme"
import "./styles/app.css"
import "./styles/skills.css"


initTheme()
initLanguage()

mount(App, {
  target: document.getElementById("app")!
})


//export default app
