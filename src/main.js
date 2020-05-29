import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)
import i18n from './lang' // Internationalization
import '@/icons' // icon
import '@/permission' // permission control
import echarts from 'echarts'
// 拖拽排序
import VueDND from 'awe-dnd'
Vue.use(VueDND)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
