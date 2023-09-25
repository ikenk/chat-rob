import {request} from '@/utils/http'

/**
 * 获取用户信息
 * @returns 获取的用户信息
 */

export const getUserInfo = ()=>{
  return request<BaseInfo>('/api/user','GET')
}