import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import {axp} from '@/axiosPme'
import axios from 'axios'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  courseInfo: {},
  shop: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
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
  SET_SHOP: (state, shop) => {
    state.shop = shop
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: username.trim(), loginPwd: password }).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { data } = response
        // eslint-disable-next-line no-trailing-spaces
        console.log(data)
        // eslint-disable-next-line space-infix-ops
        // const token = 'admin-token'

        const token = data.token
        commit('SET_TOKEN', token)
        setToken(token)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info,获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('http://hc.6636fu.com/BusinessAfter/GetMenusList', {
        params: {
          token: state.token
        }
      }).then((rst) => {
        // console.log(rst.data.data, '----------------rst')
        return rst.data.data
      }).then((rootRes) => {
        axios.get('http://hc.6636fu.com/BusinessAfter/GetBusinessInfo', {
          params: {
            token: state.token
          }
        }).then((response) => {
          const rootResarr = rootRes.filter(item => item.childData.length > 0);
    
        
          // const roles = ['editor', 'admin1']
          const roleArr = rootResarr.map((i) => {
            return i.childData.map(val => val.menusId)
          })
          const arr = []
          const roles = arr.concat(...roleArr)
          const introduction = 'I am a super administrator'
          const avatar = response.data.data.userImg
          const name = response.data.data.userName
          const shop = {
            shopName: response.data.data.shopName,
            auditStatus: response.data.data.auditStatus,
            money: response.data.data.money,
            shopPhone: response.data.data.shopPhone,
            shopID: response.data.data.shopId
          }
          const jsons = { roles }
          resolve(jsons)
          console.log(response.data)
          console.log(roles, 'roleArr---------------')
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          commit('SET_SHOP', shop)
        })
      }).catch((error) => {
        reject(error)
      })

      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   // const { roles, name, avatar, introduction } = data
      //   const roles = ['admin']
      //   const introduction = 'I am a super administrator'
      //   const avatar = 'dsfgsdg'
      //   const name = 'afaf'
      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout用户注销
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   // logout(state.token).then(() => {
    //   //   commit('SET_TOKEN', '')
    //   //   commit('SET_ROLES', [])
    //   //   commit('SET_NAME', '')
    //   //   removeToken()
    //   //   resetRouter()
    //   //   resolve()
    //   // }).catch(error => {
    //   //   reject(error)
    //   // })
    //   commit('SET_TOKEN', '')
    //   commit('SET_ROLES', [])
    //   commit('SET_NAME', '')
    //   removeToken()
    //   resetRouter()
    // })
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('SET_NAME', '')
    removeToken()
    resetRouter()
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions 动态修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      // const token = role + '-token'

      // commit('SET_TOKEN', token)
      // setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles  基于角色生成可访问路由图
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      console.log(accessRoutes, '-------------r')
      // dynamically add accessible routes动态添加可访问路由
      router.addRoutes(accessRoutes)

      // reset visited views and cached views 重置访问的视图和缓存的视图
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
