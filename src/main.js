import {createApp} from 'vue'
import App from './App.vue'

// 国际化
import i18n from './i18n'

// ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 初始化
const app = createApp(App)

// 组件注册
app.use(i18n)
app.use(ElementPlus)

// 装载
app.mount('#app')
