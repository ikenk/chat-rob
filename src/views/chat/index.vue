<script setup lang="ts">
import ChatLog from '@/views/chat/chatlog/index.vue'
import TopButton from '@/views/chat/topbutton/index.vue'
import SetAccount from '@/views/chat/setaccount/index.vue'
import ChatBox from '@/views/chat/chatbox/index.vue'
import '@/icons/js/ChatPageIcon.js'
import {getUserInfo}from '@/api/user/index'
import {getUserChatLog} from  "@/api/chat/index";
const route = useRoute()


const chatHistory = ref<ChatHistory>()

//定义用户名变量
const accountName = ref<string>('')
/**
 * onMounted周期
 * 获取用户信息
 * 获取侧边栏的历史记录信息
 */

//获取聊天历史记录信息
const getUserChatTitles = async (chatlogID:string)=>{
  const resUserChatLog = await getUserChatLog(chatlogID)
  resUserChatLog.data?.reverse().forEach((item)=>{item.chatlogs.reverse()})
  // console.log(resUserChatLog.data);
  chatHistory.value = resUserChatLog.data
}

onMounted(async ()=>{
  //获取用户信息
  const resUserInfo = await getUserInfo()
  // console.log(res.data!.account);
  accountName.value = resUserInfo.data!.account

  //获取聊天历史记录信息
  await getUserChatTitles(route.params.params)
})

//对话框中显示与chatlogID相应的对话内容
const chatBoxRef = ref<InstanceType<typeof ChatBox>>()
const chooseChat = (chatlogID:string)=>{
  chatBoxRef.value?.getChatContent(chatlogID)
}

//删除某个对话之后，重新获取对话标题列表
const deleteChat = async (chatlogID:string)=>{
  console.log('deleteChat')
  await getUserChatTitles(chatlogID)
  clearChatBox()
}

const chatLogRef = ref<InstanceType<typeof ChatLog>>()

//新建聊天或者删除某个聊天后，清除对话框里的聊天记录
const clearChatBox = ()=>{
  chatLogRef.value!.indexActive = ''
  chatBoxRef.value!.diaList = []
}

//第一次发送消息后，需要刷新侧边栏，显示最新的Chat Titles
const refreshChatTitles = async (chatlogID:string)=>{
  await getUserChatTitles(chatlogID)
  nextTick()
  await getUserChatTitles(chatlogID)
}

</script>

<template>
  <div class="container">
    <div class="aside">
      <!-- 顶部添加聊天按钮和菜单按钮 -->
      <top-button class="topbtn" @clear-chat-box="clearChatBox"></top-button>
      <!-- 聊天历史记录 -->
      <chat-log ref="chatLogRef" :chat-history="chatHistory" class="chatlog" @chooseChat="chooseChat" @deleteChat="deleteChat"></chat-log>
      <!-- 底部设置按钮以及账户按钮 -->
      <set-account :accout-name="accountName" class="account"></set-account>
    </div>
    <div class="chatbox">
      <chat-box ref="chatBoxRef" @refreshChatTitles="refreshChatTitles"></chat-box>
    </div>
  </div>
</template>

<style lang="scss" scoped>
//发送信息窗口的位置
@mixin msgboxPosition{
  position: absolute;
  bottom: 30px;
  left: 0;
}

//侧边栏整体样式
@mixin asideStyle{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 260px;
  height: 100vh;
  padding: 10px;
  border-radius: 10px 0 0 10px;
  @include backgroundColor;
}

//对话部分整体样式
@mixin chatboxStyle{
  position: relative;
  box-sizing: border-box;
  flex: 1 0 0%;
  padding: 10px;
  // background-color: yellow;
  height: 100vh;
}


// 大屏布局
@media screen and (min-width: 768px) {
  .container{
    display: flex;
    //侧边栏
    .aside{
      @include asideStyle;

      .chatlog{
        flex: 1;
        height: 20vh;
      }

      .account{
        width: 240px;
        height: 64px
      }
    }

    // 对话框
    .chatbox{
      @include chatboxStyle;
      border-radius:  0 10px 10px 0;
      
      // 大屏时顶部导航栏不出现
      &:deep(.nav){
        display: none;
      }

      // 底部输入框
      &:deep(.msgbox){
        @include msgboxPosition;
      }
    }
  }
}

//小屏布局
@media screen and (max-width: 767px) {
  .container{
    display: flex;

    //侧边栏
    .aside{
      @include asideStyle;
      display: none;
    }

    //对话框
    .chatbox{
      @include chatboxStyle;
      border-radius:  10px 10px 10px 10px;

      // 小屏时顶部导航栏出现
      &:deep(.nav){
        box-sizing: border-box;
        padding: 10px 30px;
        display: flex;
        height: 50px;
        @include backgroundColor;
        justify-content: space-between;
        border-radius: 5px;
        .icon{
          font-size: 25px;
          line-height: 30px;
          color:white;
        }
      }

      // 底部输入框
      &:deep(.msgbox){
        @include msgboxPosition;
      }
    }
  }
}
</style>