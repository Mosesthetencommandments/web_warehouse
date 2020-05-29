import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getUserToken, getAccountToken } from '@/utils/auth' // 验权
import { getUserPermissionMenu } from '@/api/login'

const whiteList = ['/login', '/404', '/select_account'] // 不重定向白名单
function getUserInfo(to, from, next) {
  // store.dispatch('GetActivity')
  store.dispatch('GetInfo').then(() => {
    store.dispatch('GetMenu').then(menuCode => {
      store.dispatch('GenerateRoutes', menuCode).then(() => { // 生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      })
    })
  }).then(() => {
    store.dispatch('GetUserAccountTypeList').then(() => {
      next()
    })
  })
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  /**
   * 系统独立登陆
   */
  if (whiteList.indexOf(to.path) !== -1) {
    next()
    return false
  }
  if (getAccountToken()) {
    if (store.getters.roles.length === 0) {
      getUserInfo(to, from, next)
    } else {
      next()
    }
  }
  if (!getAccountToken() && getUserToken()) {
    let isSelectAccount = false
    store.dispatch('LoginAccount').then(res => {
      if (res.data.length === 1) {
        return store.dispatch('LoginAccount', res.data[0].id)
      } else {
        next({ path: '/select_account' })
        isSelectAccount = true
      }
    }).then(() => {
      if (!isSelectAccount) {
        getUserInfo(to, from, next)
      }
      next()
    })
  }
  if (!getAccountToken() && !getUserToken()) {
    window.location.href = process.env.HOME_URL
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
