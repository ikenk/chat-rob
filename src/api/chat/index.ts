import {request} from '@/utils/http'

/**
 * 接收新对话的uuid
 */
export const getUUID = (url:string)=>{
  return request<{chatID:string}>(
    `/chat/uuid/${url}`,
    'GET'
  )
}

/**
 * 根据地址里的对话id，向后台请求用户对话 具体内容
 */
export const getUserChat = (id:string)=>{
  return request<{
    chatlog:DialogList
    chatlogID:string
    _id:string
  }>(
    `/chat/content/${id}`,
    'GET'
  )
}

/**
 * 每次进入chat组件时，向后台获取用户 对话记录
 */
export const getUserChatLog = (url:string)=>{
  return request<ChatHistory>(`/chat/titles/${url}`,'GET')
}

/**
 * 修改对话名字
 */
export const renameChatLog = (url:string,data:Object)=>{
  return request<Object>(`/chat/titles/${url}`,'POST',data)
}

/**
 * 删除对话
 */
export const deleteChatLog = (url:string)=>{
  return request<Object>(`/chat/titles/${url}`,'DELETE')
}


// export const request = <T>(
//   url:string,
//   method:Method = 'GET',
//   data?:object
// )=>{
//   return instance.request<any,Data<T>>({
//     url,
//     method,
//     [method.toUpperCase()==='GET'?'params':'data']:data
//   })
// }