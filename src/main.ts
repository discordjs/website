import 'focus-visible';
import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import VueTippy from 'vue-tippy';
import App from './App.vue';
import router from './router';
import { store, key } from './store';

import './styles/index.css';
import './styles/discord-hljs.css';
import 'tippy.js/dist/tippy.css';
import './styles/discord-tippy.css';

const app = createApp(App);
const head = createHead();
app.use(head);
app.use(store, key);
app.use(router);
app.use(VueTippy);
app.mount('#app');
