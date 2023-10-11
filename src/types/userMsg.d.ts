//传给后台的用户发的信息的格式
export type OpenAIMessage = {
  content: string;
  temperature?: number;
};

//用户和gpt对话的信息格式
export type DialogMsg = {
  _id: symbol | string;
  role: string;
  content: string;
};

export type DialogList = DialogMsg[];
