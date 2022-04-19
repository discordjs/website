import { createRouter, createWebHashHistory } from 'vue-router';
import routes from '~pages';

export default createRouter({
	history: createWebHashHistory(),
	routes,
});
