import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from '@/axios/axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/css/all.css'
import { VueCookies } from 'vue-cookies'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$cookies = VueCookies;
app.use(ElementPlus);
app.mount('#app');
