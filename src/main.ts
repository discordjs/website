import 'focus-visible';

import { createApp } from 'vue';
import VueTippy from 'vue-tippy';

import App from './App.vue';
import { store, key } from './store';
import router from './router';

import './styles/index.css';
import './styles/discord-hljs.css';
import 'tippy.js/dist/tippy.css';
import './styles/discord-tippy.css';

const app = createApp(App);
app.use(store, key);
app.use(router);
app.use(VueTippy);
app.mount('#app');
