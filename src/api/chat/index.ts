import {request} from '@/utils/http'

/**
 * 发送用户消息
 * data即为用户发送的消息
 */
//axios在前端无法做到流式接收
// export const sendUserMsg = (data:OpenAIMessage)=>{
//   return request<any,string>({
//     method:'post',
//     url:'/chat',
//     data
//   })
// }

/**
 * 接收新对话的uuid
 */
export const getUUID = (url:string)=>{
  return request<{chatID:string}>(
    url,
    'GET'
  )
}

/**
 * 根据地址里的对话id，向后台请求用户对话 具体内容
 */
export const getUserChat = (id:string)=>{
  return request<{chatID:string}>(
    `/chat/content/${id}`,
    'GET'
  )
}



/**
 * 每次进入chat组件时，向后台获取用户 对话记录
 */
export const getUserChatLog = ()=>{}