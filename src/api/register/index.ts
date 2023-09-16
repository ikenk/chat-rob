import request from '@/utils/http'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function login({ account, password,checkpass }:RegisterInfo) {
  return request({
    url: '/api/register',
    method: 'POST',
    data: {
      account,
      password,
      checkpass
    }
  })
}