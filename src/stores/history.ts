//单个聊天记录
type ChatLog = {
  id:string,
  summary:string
}

//多个聊天记录的集合
type ChatLogs = ChatLog[]

//根据日期区分的聊天记录
type DateLog = {
  date:string,
  chatlogs:ChatLogs
}

//所有的聊天记录集合
type ChatHistory = DateLog[]
