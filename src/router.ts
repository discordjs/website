import { createRouter, createWebHashHistory } from 'vue-router';
import routes from 'virtual:generated-pages';

export default createRouter({
	history: createWebHashHistory(),
	routes,
});
