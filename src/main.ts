import 'core-js';
import 'dkfds/dist/css/dkfds.css';
import Vue from 'vue';

// TODO: AJP - ERF-7566 - ser ikke ud til at være nøvendig
//import axios from 'axios';
//import VueAxios from 'vue-axios';
//Vue.use(VueAxios, axios);

const App = () => import(/* webpackPreload: true */ './App.vue');

Vue.config.productionTip = false;

const vue = new Vue({
  render: (h: any) => h(App)
});

vue.$mount('#app');
