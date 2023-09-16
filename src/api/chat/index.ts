// import request from '@/utils/http'

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