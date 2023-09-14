type OpenAIMessage = {
  content:string
  temperature?:number
}

type DialogMsg = {
  id:symbol
  role:string
  content:string
}

type DialogList = DialogMsg[]