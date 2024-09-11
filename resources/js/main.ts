import '../css/app.css'
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('../views/**/*.svelte')
    return pages[`../views/${name}.svelte`]()
  },
  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})