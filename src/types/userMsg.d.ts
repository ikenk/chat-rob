//传给后台的用户发的信息的格式
type OpenAIMessage = {
  content:string
  temperature?:number
}

//用户和gpt对话的信息格式
type DialogMsg = {
  _id:symbol | string
  role:string
  content:string
}

type DialogList = DialogMsg[]