import request from '@/utils/request'

/**
 * 发送用户消息
 * data即为用户发送的消息
 */

export const sendUserMsg = (data:OpenAIMessage)=>{
  return request<any,string>({
    method:'post',
    url:'/chat',
    data
  })
}