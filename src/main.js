import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/normalize.css'
import './assets/roots.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
