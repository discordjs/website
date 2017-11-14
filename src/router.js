import Vue from 'vue';
import Router from 'vue-router';
import HomePageComponent from './components/pages/Home.vue';
import DocumentationPageComponent from './components/pages/Documentation.vue';
import UnknownRoutePageComponent from './components/pages/UnknownRoute.vue';
import DocsLoaderComponent from './components/docs/Loader.vue';
import DocsViewerComponent from './components/docs/Viewer.vue';
import FileViewerComponent from './components/docs/FileViewer.vue';
import ClassViewerComponent from './components/docs/class-viewer/ClassViewer.vue';
import TypedefViewerComponent from './components/docs/TypedefViewer.vue';
import DocsSearchComponent from './components/docs/Search.vue';

Vue.use(Router);

export default new Router({
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
});
