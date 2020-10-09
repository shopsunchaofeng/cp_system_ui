import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data list数据
 * @param {*} id 主键ID
 * @param {*} pid 上级ID
 * @param childrenKey 子list数据的key
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId', childrenKey = 'children') {
  let res = []
  let temp = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]][childrenKey]) {
        temp[data[k][pid]][childrenKey] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]][childrenKey].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 根据orgNo翻译为orgName
 * @param orgNo
 */
export function transOrg (orgNo) {
  let orgList = JSON.parse(sessionStorage.getItem('orgList') || '[]')
  if (orgList.length > 0) {
    for (let i = 0; i < orgList.length; i++) {
      if (orgList[i].orgNo === orgNo) {
        return orgList[i].orgName
      }
    }
  }
  return '--'
}

/**
 * 根据userId翻译为realName
 * @param userId
 */
export function transUser (userId) {
  let userList = JSON.parse(sessionStorage.getItem('userList') || '[]')
  if (userList.length > 0) {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id === userId) {
        return userList[i].realName
      }
    }
  }
  return '--'
}

export function transParam (groupCode, paramValue) {
  if (!paramValue && paramValue !== 0) {
    return '--'
  }
  let paramList = JSON.parse(sessionStorage.getItem('paramList') || '[]')
  if (paramList.length > 0) {
    for (let i = 0; i < paramList.length; i++) {
      if (paramList[i].groupCode === groupCode && paramList[i].paramValue.toString() === paramValue.toString()) {
        return paramList[i].paramName
      }
    }
  }
  return '--'
}

/**
 * 根据systemId翻译为systemName
 * @param systemId
 */
export function transSystem (systemId) {
  let systemList = JSON.parse(sessionStorage.getItem('systemList') || '[]')
  if (systemList.length > 0) {
    for (let i = 0; i < systemList.length; i++) {
      if (systemList[i].systemId === systemId) {
        return systemList[i].systemName
      }
    }
  }
  return '--'
}

/**
 * 根据id翻译为clentName
 * @param id
 */
export function transClent (id) {
  let clentList = JSON.parse(sessionStorage.getItem('clentList') || '[]')
  if (clentList.length > 0) {
    for (let i = 0; i < clentList.length; i++) {
      if (clentList[i].id === id) {
        return clentList[i].clentName
      }
    }
  }
  return '--'
}

/**
 * 根据storeId翻译为storeName
 * @param id
 */
export function transStore (id) {
  let storeList = JSON.parse(sessionStorage.getItem('storeList') || '[]')
  if (storeList.length > 0) {
    for (let i = 0; i < storeList.length; i++) {
      if (storeList[i].id === id) {
        return storeList[i].storeName
      }
    }
  }
  return '--'
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  localStorage.clear()
  sessionStorage.clear()
  router.options.isAddDynamicMenuRoutes = false
}
