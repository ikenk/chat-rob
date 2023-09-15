import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function login({ mobile, password }:LoginInfo) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data: {
      mobile,
      password
    }
  })
}
