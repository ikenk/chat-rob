//单个聊天记录
export type ChatLog = {
  chatlogID: string;
  chatTitle: string;
};

//多个聊天记录的集合
export type ChatLogs = ChatLog[];

//根据日期区分的聊天记录
export type DateLog = {
  date: string;
  chatlogs: ChatLogs;
};

//所有的聊天记录集合
export type ChatHistory = DateLog[];
