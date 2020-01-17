import request from '@/utils/request'

export function login(data) {
  console.log(data)
  return request({
    // url: `http://hc.6636fu.com/BusinessAfter/BusinessLogin?loginName=${data.loginName}&loginPwd=${data.loginPwd}`,
    url: 'http://hc.6636fu.com/BusinessAfter/BusinessLogin',
    params: data,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: 'http://hc.6636fu.com/BusinessAfter/GetBusinessInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
