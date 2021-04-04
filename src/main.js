import { createApp } from 'vue'
import App from './App.vue'

// Bootstrap style include
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css' 

// Font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faSyncAlt, faSun, faMoon, faTrash, faPlayCircle  } from '@fortawesome/free-solid-svg-icons'
import { faJs, faVuejs, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// icon library
library.add(faJs, faVuejs, faGithub, faTimes, faSyncAlt, faSun, faMoon, faTrash, faPlayCircle)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
