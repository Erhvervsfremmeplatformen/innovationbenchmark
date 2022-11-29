// INFO: Bemærk ændringer til denne fil, vil ikke blive inkluderet i den endelige applikation
import 'core-js';
import 'dkfds/dist/css/dkfds.css';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.globalProperties.productionTip = false;
app.config.globalProperties.$useMockData = true;
app.mount('#app');
