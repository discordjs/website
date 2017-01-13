import Vue from 'vue';
import VueRouter from 'vue-router';
import marked from 'marked';
import { hljs } from './util';

import App from './App';
import UnknownPageComponent from './components/UnknownPage.vue';
import HomePageComponent from './components/pages/Home.vue';
import DocumentationPageComponent from './components/pages/Documentation.vue';
import UnknownRoutePageComponent from './components/pages/UnknownRoute.vue';
import ContainerComponent from './components/Container.vue';
import SlideComponent from './components/Slide.vue';
import LoadingComponent from './components/Loading.vue';
import DocsLoaderComponent from './components/docs/Loader.vue';
import DocsViewerComponent from './components/docs/Viewer.vue';
import FileViewerComponent from './components/docs/FileViewer.vue';
import ClassViewerComponent from './components/docs/class-viewer/ClassViewer.vue';
import TypedefViewerComponent from './components/docs/TypedefViewer.vue';
import DocsSearchComponent from './components/docs/Search.vue';

require('./styles/master.scss');

// Set up the router!
Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    { path: '/', name: 'home', component: HomePageComponent },
    { path: '/docs', name: 'docs', component: DocumentationPageComponent, children: [
      { path: ':source', name: 'docs-source', component: DocsLoaderComponent, children: [
        { path: ':tag', name: 'docs-tag', component: DocsViewerComponent, children: [
          { path: 'search', name: 'docs-search', component: DocsSearchComponent },
          { path: 'class/:class', name: 'docs-class', component: ClassViewerComponent },
          { path: 'typedef/:typedef', name: 'docs-typedef', component: TypedefViewerComponent },
          { path: ':category/:file', name: 'docs-file', component: FileViewerComponent },
        ] },
      ] },
    ] },

    // Old URLs
    { path: '/!', redirect: { name: 'home' }, children: [
      { path: 'docs', redirect: { name: 'docs' }, children: [
        { path: 'tag/:tag', redirect(to) {
          return {
            name: 'docs-tag',
            params: { source: 'main', tag: to.params.tag },
            query: { scrollTo: to.query.scrollto },
          };
        }, children: [
          { path: 'file/:category/:file', redirect(to) {
            return {
              name: 'docs-file',
              params: { source: 'main', tag: to.params.tag, category: to.params.category, file: to.params.file },
              query: { scrollTo: to.query.scrollto },
            };
          } },
          { path: 'class/:class', redirect(to) {
            return {
              name: 'docs-class',
              params: { source: 'main', tag: to.params.tag, class: to.params.class },
              query: { scrollTo: to.query.scrollto },
            };
          } },
          { path: 'typedef/:typedef', redirect(to) {
            return {
              name: 'docs-typedef',
              params: { source: 'main', tag: to.params.tag, typedef: to.params.typedef },
              query: { scrollTo: to.query.scrollto },
            };
          } },
        ] },
      ] },
    ] },

    // Catch-all
    { path: '*', component: UnknownRoutePageComponent },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    return { x: 0, y: 0 };
  },
});

// Register global components
Vue.component('container', ContainerComponent);
Vue.component('slide', SlideComponent);
Vue.component('loading', LoadingComponent);
Vue.component('unknown-page', UnknownPageComponent);

// Register the hightlight.js directive
Vue.directive('hljs', hljs);

// Register filters
Vue.filter('marked', text => {
  if (!text) text = '**Documentation missing.**';
  text = text.replace(/<(info|warn)>([\s\S]+)<\/\1>/gi, '<div class="$1">$2</div>');
  return marked(text);
});

// Initialise the application
const app = new Vue({ // eslint-disable-line no-unused-vars
  el: '#app',
  components: { App },
  template: '<App />',
  router,
});
