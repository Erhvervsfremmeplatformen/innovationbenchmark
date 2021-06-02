import 'core-js';
import 'dkfds/dist/css/dkfds.css';

import axios from 'axios';
import Vue from 'vue';
import VueAxios from 'vue-axios';

const App = () => import(/* webpackPreload: true */ './App.vue');

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

const vue = new Vue({
  render: (h: any) => h(App)
});

vue.$mount('#app');
