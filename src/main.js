// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Vant from 'vant';
import 'vant/lib/index.css';
import BaiduMap from 'vue-baidu-map'
import VueAMap from 'vue-amap'
import 'lib-flexible/flexible';
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

// 引入全局样式
import './assets/css/global.css'

import axios from 'axios' // axios 引入
Vue.prototype.$axios = axios

import Cookies from 'js-cookie' // js-cookie 引入
Vue.prototype.$Cookies = Cookies

import md5 from 'js-md5' // md5 引入模块
Vue.prototype.$md5 = md5 //配置全局变量

import {Base64} from 'js-base64' // base64 加密解密
Vue.prototype.$Base64 = Base64 

import {compressImage} from './javascript/compressImg.js' // 压缩图片
Vue.prototype.$compreImg = compressImage 

import utils from './javascript/utils' // 刘家军引入
Vue.prototype.utils = utils;

import {server} from './request/http' // 接口引入
Vue.prototype.$api = server


// 引入公共方法
import {toLogin, 
validatePassword, validatePhone, validateIdCard, 
formatNumber, numberFormat, isAndroid, getString, 
dateCurFull, dateCurrent, dateCurYearMonth, dateCurMonth, dateCurMonthDate, dateCurrentAfterNum, dateCurrentAfter} from "./javascript/common";
Vue.prototype.$toLogin = toLogin // 跳转登录页面
Vue.prototype.$validatePassword = validatePassword // 验证密码
Vue.prototype.$validatePhone = validatePhone // 验证手机号
Vue.prototype.$validateIdCard = validateIdCard // 验证身份证号
Vue.prototype.$formatNumber = formatNumber // 将数字转成 k w 方式显示
Vue.prototype.$numberFormat = numberFormat
Vue.prototype.$isAndroid = isAndroid // 判断机型是isAndroid
Vue.prototype.$getString = getString 
Vue.prototype.$dateCurFull = dateCurFull //日期
Vue.prototype.$dateCurrent = dateCurrent
Vue.prototype.$dateCurYearMonth = dateCurYearMonth
Vue.prototype.$dateCurMonth = dateCurMonth
Vue.prototype.$dateCurMonthDate = dateCurMonthDate
Vue.prototype.$dateCurrentAfterNum = dateCurrentAfterNum
Vue.prototype.$dateCurrentAfter = dateCurrentAfter

Vue.config.productionTip = false

// Vue.prototype.$isAndroid = ''
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  // ak: 'YOUR_APP_KEY'
  ak: 'smZPCVTuah1zIemCZPgjrNvOlx074Ca0'
})


Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '29158da2f55417cb62242251293b6fcf',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation']
})

Vue.use(Vant);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
