<script setup lang="ts">
import ChatLog from '@/views/chat/chatlog/index.vue'
import TopButton from '@/views/chat/topbutton/index.vue'
import SetAccount from '@/views/chat/setaccount/index.vue'
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
      <nav class="nav">
        <icon-svg icon-class="toggle-right" class="icon"></icon-svg>
        <icon-svg icon-class="add" class="icon"></icon-svg>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>

@media screen and (min-width: 768px) {
  .container{
    display: flex;
    .aside{
      position: relative;
      box-sizing: border-box;
      width: 260px;
      height: 100vh;
      padding: 10px;
      border-radius: 10px 0 0 10px;
      @include backgroundColor;

      .account{
        position: absolute;
        width: 240px;
        bottom: 5px;
      }
    }


    .chatbox{
      box-sizing: border-box;
      flex: 1 0 0%;
      padding: 10px;
      border-radius:  0 10px 10px 0;
      background-color: yellow;
      
      .nav{
        display: none;
      }
    }
  }
}


@media screen and (max-width: 767px) {
  .container{
    display: flex;

    .aside{
      display: none;
      box-sizing: border-box;
      width: 260px;
      height: 100vh;
      padding: 10px;
      border-radius: 10px 0 0 10px;
      background-color: rgba(32,33,35,$bg-opacity);
    }


    .chatbox{
      box-sizing: border-box;
      flex: 1 0 0%;
      border-radius:  10px 10px 10px 10px;
      background-color: yellow;
      height: 100vh;
      .nav{
        box-sizing: border-box;
        padding: 10px 30px;
        display: flex;
        height: 50px;
        background-color: rgba(32,33,35,$bg-opacity);
        justify-content: space-between;
        .icon{
          font-size: 25px;
          line-height: 30px;
          color:white;
        }
      }
    }
  }
}
</style>