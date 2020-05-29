import { login, logout, getInfo } from '@/api/login'
import { getUserToken, getAccountToken, setAccountToken, removeUserToken, removeAccountToken } from '@/utils/auth'
import { getUserAccountTypeList, loginAccount } from '@/api/login'
const user_token = getUserToken()

const user = {
  state: {
    token: getAccountToken(),
    name: '',
    avatar: '',
    roles: [],
    getaways: [],
    user_account_group_id: undefined,
    important_notice: 0
    // achievement: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_ACCOUNT_ID: (state, user_account_id) => {
      state.user_account_id = user_account_id
    },
    SET_USER_ACCOUNT_GROUP_ID: (state, user_account_group_id) => {
      state.user_account_group_id = user_account_group_id
    },
    SET_IMPORTANT_NOTICE: (state, important_notice) => {
      state.important_notice = important_notice
    },
    SET_GATEWAYS: (state, getaways) => {
      state.getaways = getaways
    }
    // SET_ACHIEVEMENT: (state, achievement) => {
    //   state.achievement = achievement
    // }
  },

  actions: {
    // 子系统独立登录
    Login({ commit, state }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const token = response.data.token
          setAccountToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.user_account_role.role_code)
          commit('SET_USER_ACCOUNT_GROUP_ID', data.user_account_group_id)
          commit('SET_NAME', data.nickname)
          commit('SET_AVATAR', data.head_img)
          commit('SET_USER_ACCOUNT_ID', data.id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeUserToken()
          removeAccountToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeUserToken()
        removeAccountToken()
        resolve()
      })
    },
    // 获取子系统orders_secondary_receiver_info
    GetUserAccountTypeList({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserAccountTypeList().then(response => {
          commit('SET_GATEWAYS', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    LoginAccount({ commit, state }, id) {
      if (id) {
        return new Promise((resolve, reject) => {
          loginAccount({
            user_account_id: id,
            token: user_token
          }).then(res => {
            commit('SET_TOKEN', res.data)
            setAccountToken(res.data)
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          loginAccount({
            token: user_token
          }).then(res => {
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  }
}

export default user
