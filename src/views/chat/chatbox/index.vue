<script setup lang="ts">
import ChatItem from './ChatItem.vue';
import {sendUserMsg} from '@/api/chat/index.ts'
const msg = ref<string>('')
const userMsg =ref<OpenAIMessage>()

const diaList = ref<DialogList>([])

//向后台发送消息
const sendMsgToBack = async ()=>{
  if(msg.value){
      // console.log(msg.value);
      userMsg.value = {
        content:msg.value
      }
      diaList.value.push({
        id:Symbol(),
        role:'user',
        content:msg.value
      })
      msg.value=''
      const res = await sendUserMsg(userMsg.value)
      diaList.value.push({
        id:Symbol(),
        role:'assist',
        content: res
      })
      // console.log(res);
      // console.log(diaList.value);
  }else{
    return
  }   
}


//按钮发送消息
const sendmsgBtn =()=>{
  //向后台发送消息
  sendMsgToBack()
}

//键盘enter键发送消息
const sendmsgKey =async (e:KeyboardEvent)=>{
  // console.log(e.shiftKey);
  // console.log(e.keyCode);
  if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.key === 'Enter') {
    // e.cancelBubble = true; //ie阻止冒泡行为
    e.stopPropagation();//Firefox阻止冒泡行为
    e.preventDefault(); //取消事件的默认动作*换行
    //向后台发送消息
    sendMsgToBack()
  }
  

}
</script>

<template>
  <nav class="nav">
    <icon-svg icon-class="toggle-right" class="icon"></icon-svg>
    <icon-svg icon-class="add" class="icon"></icon-svg>
  </nav>
  <div class="conversation">
    <el-scrollbar>
      <ChatItem 
      v-for="item in diaList" 
      v-bind:key="item.id"
      :message="item.content"
      :role="item.role"
      ></ChatItem>
    </el-scrollbar>
  </div>
  <div class="msgbox">
    <el-input
      class="sendmsg"
      v-model="msg"
      maxlength="1000"
      placeholder="你想说点什么..."
      show-word-limit
      type="textarea"
      resize="none"
      :autosize="{ minRows: 1, maxRows: 9 }"
      @keydown="sendmsgKey"
    />
    <el-button class="sendbtn" @click="sendmsgBtn">
      <icon-svg icon-class="RectangleCopy"></icon-svg>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
  .conversation{
    height: 88%;
  }

  .msgbox{
    box-sizing: border-box;
    width:100%;
    display:flex;
    justify-content:center;
    align-items:end;

    //输入框
    .sendmsg{
      width:66%;
      &:deep(.el-textarea__inner){
        &:focus{
          box-shadow:0 0 0 1px rgba( 32,33,35,0) inset;
        }
      }
    }

    // 输入框旁的确认按钮
    .sendbtn{
      padding:5px 5px 5px 2px;
      font-size:26px;
      background-color:white;

      &:active{
        border-color:rgb(214, 214, 214,0);
        box-shadow:1px 1px 1px 1px rgba( 32,33,35,0.2) inset;
      }
    }
  }
</style>