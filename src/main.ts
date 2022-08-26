// INFO: Bemærk ændringer til denne fil, vil ikke blive inkluderet i den endelige applikation
import 'core-js';
import 'dkfds/dist/css/dkfds.css';
import { createApp } from 'vue';
import App from './App.vue';

// TODO: AJP - ERF-7566 - ser ikke ud til at være nøvendig
//import axios from 'axios';
//import VueAxios from 'vue-axios';
//Vue.use(VueAxios, axios);

/*
Vue.config.productionTip = false;

const vue = new Vue({
  render: (h: any) => h(App)
});

vue.$mount('#app');
*/

const app = createApp(App);
app.config.globalProperties.productionTip = false;
app.mount('#app');
