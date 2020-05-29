import { asyncRouterMap, constantRouterMap } from '@/router'
import { getUserPermissionMenu, getUserAccountTypeList } from '@/api/login'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(route, routesName) {
  if (route.name) {
    return routesName.indexOf(route.name) >= 0
  } else {
    return false
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, routesName) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(route, routesName)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, routesName)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function mapRoutesName(routes) {
  const routersCodes = routes.map(route => {
    return route.menu_code
  })
  return routersCodes
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 获取用户权限菜单
    GetMenu() {
      return new Promise((resolve, reject) => {
        getUserPermissionMenu().then(response => {
          const Code = mapRoutesName(response.data)
          resolve(Code)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 加载路由
    GenerateRoutes({ commit }, data) {
      const menuCode = data
      return new Promise(resolve => {
        let accessedRouters
        accessedRouters = filterAsyncRouter(asyncRouterMap, menuCode)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },

  }
}

export default permission
