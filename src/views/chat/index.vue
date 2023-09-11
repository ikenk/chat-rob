<script setup lang="ts">
import ChatLog from '@/views/chat/chatlog/index.vue'
import TopButton from '@/views/chat/topbutton/index.vue'
import SetAccount from '@/views/chat/setaccount/index.vue'
import ChatBox from '@/views/chat/chatbox/index.vue'
import '@/icons/js/chat-topbutton.js'

</script>

<template>
  <div class="container">
    <div class="aside">
      <!-- 顶部添加聊天按钮和菜单按钮 -->
      <!-- <el-row class="topbutton">
        <el-col :span="18">
          <button class="newchat">+ newchat</button>
        </el-col>
        <el-col :span="6">
          <button class="menu">
            <icon-svg iconClass="toggle-left"></icon-svg>
          </button>
        </el-col>
      </el-row> -->
      <top-button class="topbtn"></top-button>
      <!-- 聊天历史记录 -->
      <chat-log class="content"></chat-log>
      <!-- 底部设置按钮以及账户按钮 -->
      <set-account class="account"></set-account>
    </div>
    <div class="chatbox">
      <chat-box></chat-box>
      <!-- <nav class="nav">
        <icon-svg icon-class="toggle-right" class="icon"></icon-svg>
        <icon-svg icon-class="add" class="icon"></icon-svg>
      </nav>
      <div class="sendmsg">
        <el-input
          v-model="sendmsg"
          maxlength="1000"
          placeholder="你想说点什么..."
          show-word-limit
          type="textarea"
          resize="none"
          :autosize="{ minRows: 1, maxRows: 9 }"
        />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
//发送信息窗口的位置
@mixin msgboxPosition{
  position: absolute;
  bottom: 30px;
}

//侧边栏整体样式
@mixin asideStyle{
  position: relative;
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
  background-color: yellow;
  height: 100vh;
}


// 大屏布局
@media screen and (min-width: 768px) {
  .container{
    display: flex;

    //侧边栏
    .aside{
      @include asideStyle;

      .account{
        position: absolute;
        width: 240px;
        bottom: 5px;
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
      display: none;
      @include asideStyle;
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