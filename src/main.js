import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import ElementUI from 'element-ui'            // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import echarts from 'echarts' // 引入echarts
import {isAuth, treeDataTranslate, transOrg, transUser, transParam, transSystem, transClent, transStore} from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import ElDict from './components/el-dict'
import Ueditor from './components/ueditor'
import VueAMap from 'vue-amap'

Vue.use(VueAMap)
Vue.use(VueCookie)
Vue.use(ElDict)
Vue.use(Ueditor)
Vue.use(ElementUI, {
  size: 'mini'
})

Vue.component('el-dict', ElDict)
Vue.component('ueditor', Ueditor)

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.$echarts = echarts
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.treeDataTranslate = treeDataTranslate     // 树形数据转换
Vue.prototype.transOrg = transOrg     // 机构翻译
Vue.prototype.transUser = transUser     // 用户翻译
Vue.prototype.transParam = transParam     // 数据字典翻译
Vue.prototype.transSystem = transSystem     // 系统
Vue.prototype.transClent = transClent     // 客户
Vue.prototype.transStore = transStore     // 商铺

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '3c964ccf6e7a6673f27a020b1ef7e5ba',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})
