import {request} from '@/utils/http'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function getLogin(data:LoginInfo) {
  return request<{token:string}>( '/api/login','POST',data)
}
