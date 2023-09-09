<script setup lang="ts">
import ChatLog from '@/views/chat/chatlog/ChatLog.vue'
import TopButton from '@/views/chat/topbutton/TopButton.vue'
import SetAccount from '@/views/chat/setaccount/SetAccount.vue'
</script>

<template>
  <el-row class="container">
    <el-col :xs="0" :sm="5" :md="5" :lg="6" :xl="2" class="aside">
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
      <top-button></top-button>
      <!-- 聊天历史记录 -->
      <chat-log></chat-log>
      <!-- 底部设置按钮以及账户按钮 -->
      <set-account></set-account>
    </el-col>
    <el-col :xs="24" :sm="19" :md="19" :lg="18" :xl="22" class="chatbox">
      123
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
$bg-opacity:1;
.container{
  // padding: 2px 5px;
}
.el-col {
  height: 100vh;

  &.aside{
    padding: 10px;
    border-radius: 10px 0 0 10px;
    background-color: rgba(32,33,35,$bg-opacity);
  }

  &.chatbox{
    padding: 10px;
    border-radius:  0 10px 10px 0;
    background-color: yellow;
  }
}

.topbutton{
  height: 40px;
  padding: 5px;
  background-color: red;
  .newchat{
    // width: 100%;
  }

  .menu{
    width: 100%;
  }
}

</style>
