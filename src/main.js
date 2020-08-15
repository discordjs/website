import Vue from 'vue';
import marked from 'marked';

import App from './App.vue';
import './register-service-worker';
import router from './router';
import { hljs } from './util';
import ContainerComponent from './components/Container.vue';
import SlideComponent from './components/Slide.vue';
import LoadingComponent from './components/Loading.vue';
import UnknownPageComponent from './components/UnknownPage.vue';

Vue.config.productionTip = false;

require('./styles/master.scss');

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
  text = marked(text);
  return text.replace(/<(info|warn)>([\s\S]+)<\/\1>/gi, '<div class="$1">$2</div>');
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
