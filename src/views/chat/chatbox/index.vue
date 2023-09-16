<script setup lang="ts">
import ChatItem from './ChatItem.vue';
import type { ElScrollbar } from 'element-plus';

const msg = ref<string>('') //input输入框的v-model
const userMsg =ref<OpenAIMessage>() //发送给后台的消息(格式)
const diaList = ref<DialogList>([])//对话列表(格式)

//为了能够实现流式数据在自组件上的响应，需要先在diaList里添加一个响应式对象，然后再向对象的content中添加流式数据
const assistItem = ref<DialogMsg>()
const userItem = ref<DialogMsg>()


const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>(); // el-scrollbar 组件对象
const conversation = ref() // conversation组件对象


//向后台发送消息函数
const sendMsgToBack = async ()=>{
  if(msg.value){
      // console.log(msg.value);
      userMsg.value = {
        content:msg.value
      }
      userItem.value={
        id:Symbol(),
        role:'user',
        content:msg.value
      }
      diaList.value.push(userItem.value)
      /**
       * 向@diaList 中推入 @userItem 后紧接着判断是否需要下滚，并执行下滚操作并不会立即下滚
       * 这是由于vue的更新机制所导致的，这个同步更新视图的操作还在一个 @nexttick 周期中
       * 因此需要使用 @nextTick 函数来对视图进行更新
       */
      //判断用户输入后是否需要下滚
      if(scrollbarRef.value!.wrapRef!.scrollHeight>conversation.value.clientHeight){
        nextTick(()=>{
          /**
           * @setScrollTop 方法是 el-scrollbar 组件提供的滚动到指定位置的方法之一
           * @scrollbarRef 无法直接取到组件的 @scrollHeight ，而必需使用 @wrapRef 取到 @scrollHeight
           * @conversation 组件的高度是不变的，因此 @clientHeight 可以用作滚动高度的参考
           * 当滚动条内的滚动高度大于外部的父元素高度时，表明需要自动向下滚动了，
           * 这时使用 @setScrollTop 方法设置滚动高度
           */
          scrollbarRef.value!.setScrollTop(scrollbarRef.value!.wrapRef!.scrollHeight-conversation.value.clientHeight)
        })
      }
      msg.value=''
      // const res = await sendUserMsg(userMsg.value)
      const res =await fetch('http://192.168.3.59:7010/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMsg.value),
      })
      assistItem.value = {
        id:Symbol(),
        role:'assist',
        content:''
      }
      diaList.value.push(assistItem.value)
      // 流式读取
      const reader = res.body?.getReader() //读取器
      // console.log(reader);
      const decoder = new TextDecoder() //解析器
      while(reader){
        const {done,value} = await reader.read()
        if(done){
          break
        }
        const txt = decoder.decode(value)
        // console.log(txt);
        assistItem.value.content += txt
        /**
         * @setScrollTop 方法是 el-scrollbar 组件提供的滚动到指定位置的方法之一
         * @scrollbarRef 无法直接取到组件的 @scrollHeight ，而必需使用 @wrapRef 取到 @scrollHeight
         * @conversation 组件的高度是不变的，因此 @clientHeight 可以用作滚动高度的参考
         * 当滚动条内的滚动高度大于外部的父元素高度时，表明需要自动向下滚动了，
         * 这时使用 @setScrollTop 方法设置滚动高度
         */
        if(scrollbarRef.value!.wrapRef!.scrollHeight>conversation.value.clientHeight){
          scrollbarRef.value!.setScrollTop(scrollbarRef.value!.wrapRef!.scrollHeight-conversation.value.clientHeight)
        }
      }
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
  <div ref="conversation" class="conversation">
    <el-scrollbar ref="scrollbarRef">
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