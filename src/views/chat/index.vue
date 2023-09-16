<script setup lang="ts">
import ChatLog from '@/views/chat/chatlog/index.vue'
import TopButton from '@/views/chat/topbutton/index.vue'
import SetAccount from '@/views/chat/setaccount/index.vue'
import ChatBox from '@/views/chat/chatbox/index.vue'
import '@/icons/js/ChatPageIcon.js'

</script>

<template>
  <div class="container">
    <div class="aside">
      <!-- 顶部添加聊天按钮和菜单按钮 -->
      <top-button class="topbtn"></top-button>
      <!-- 聊天历史记录 -->
      <chat-log class="chatlog"></chat-log>
      <!-- 底部设置按钮以及账户按钮 -->
      <set-account class="account"></set-account>
    </div>
    <div class="chatbox">
      <chat-box></chat-box>
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
</style>@/icons/js/chatPageIcon.js