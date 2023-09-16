// const robot = createRobotContent();
//   const resp = await fetch('http://localhost:7010/chat', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       content,
//     }),
//   });
//   // 流式读取
//   const reader = resp.body.getReader();
//   const decoder = new TextDecoder();
//   while (1) {
//     const { done, value } = await reader.read();
//     if (done) {
//       break;
//     }
//     const txt = decoder.decode(value);
//     robot.append(txt);
//   }
//   robot.over();

// // 表示是否连接 SSE
// const isConnect = ref(false)

// // 请求中止控制器
// let controller: AbortController

// // 建立 SSE 连接
// const connectSSE = async () => {
//   // 将 isConnect 设置为 true，表示正在连接 SSE
//   isConnect.value = true
//   // 创建一个新的请求中止控制器
//   controller = new AbortController()
//   // 发送 POST 请求到服务器
//   const res = await fetch('http://localhost:3000/chat_typing_fetch', {
//     // 请求中止标识
//     signal: controller.signal,
//     // 使用 POST 方法发送请求
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ user: 'itheima' }),
//   })

//    // 获取响应内容的 ReadableStream
//    const reader = res.body?.getReader()
//    // 创建一个解码器，用来解码文本
//    const decoder = new TextDecoder()
//    while (reader) {
//      // 读取响应内容
//      const { done, value } = await reader.read()
//      if (done) {
//        // 如果请求已经完成，中止请求
//        closeSSE()
//        // 退出循环
//        break
//      }
//      // 将解码后的文本添加到文章内容中
//      article.value += decoder.decode(value)
//    }

//    // 关闭 SSE 连接
// const closeSSE = () => {
//   // 将 isConnect 设置为 false，表示已经关闭 SSE 连接
//   isConnect.value = false
//   // 中止请求
//   controller.abort()
// }