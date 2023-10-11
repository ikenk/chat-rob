<!-- 聊天页面根组件 -->
<script setup lang="ts">
import ChatLog from "@/views/chat/chatlog/index.vue";
import TopButton from "@/views/chat/topbutton/index.vue";
import SetAccount from "@/views/chat/setaccount/index.vue";
import ChatBox from "@/views/chat/chatbox/index.vue";
import "@/icons/js/ChatPageIcon.js";
import { getUserInfo } from "@/api/user/index";
import { getUserChatLog } from "@/api/chat/index";
import type { ChatHistory } from "@/types/chatHistory.d.ts";
const route = useRoute();

const chatHistory = ref<ChatHistory>();

//定义用户名变量
const accountName = ref<string>("");
/**
 * onMounted周期
 * 获取用户信息
 * 获取侧边栏的历史记录信息
 */

//获取聊天历史记录信息
const getUserChatTitles = async (chatlogID: string) => {
  const resUserChatLog = await getUserChatLog(chatlogID);
  resUserChatLog.data?.reverse().forEach((item) => {
    item.chatlogs.reverse();
  });
  // console.log(resUserChatLog.data);
  chatHistory.value = resUserChatLog.data;
};

onMounted(async () => {
  //获取用户信息
  const resUserInfo = await getUserInfo();
  // console.log(res.data!.account);
  accountName.value = resUserInfo.data!.account;

  //获取聊天历史记录信息
  await getUserChatTitles(route.params.params);
});

//对话框中显示与chatlogID相应的对话内容
const chatBoxRef = ref<InstanceType<typeof ChatBox>>();
const chooseChat = (chatlogID: string) => {
  chatBoxRef.value?.getChatContent(chatlogID);
};

//删除某个对话之后，重新获取对话标题列表
const deleteChat = async (chatlogID: string) => {
  console.log("deleteChat");
  await getUserChatTitles(chatlogID);
  clearChatBox();
};

const chatLogRef = ref<InstanceType<typeof ChatLog>>();

//新建聊天或者删除某个聊天后，清除对话框里的聊天记录
const clearChatBox = () => {
  chatLogRef.value!.indexActive = "";
  chatBoxRef.value!.diaList = [];
};

//第一次发送消息后，需要刷新侧边栏，显示最新的Chat Titles
const refreshChatTitles = async (chatlogID: string) => {
  await getUserChatTitles(chatlogID);
};

//是否显示侧边栏
// const isShow = ref<boolean>(true)
const aside = ref<HTMLDivElement>();
const menu = ref<HTMLDivElement>();
//隐藏侧边栏
const collapseAsideMenu = () => {
  aside.value!.style.opacity = "0";
  aside.value!.style.width = "0";
  setTimeout(() => {
    menu.value!.style.display = "block";
    for (let i = 0; i < aside.value!.children.length; i++) {
      aside.value!.children[i].style.display = "none";
    }
  }, 200);
};
//显示侧边栏
const showAsideMenu = () => {
  menu.value!.style.display = "none";
  setTimeout(() => {
    for (let i = 0; i < aside.value!.children.length; i++) {
      aside.value!.children[i].style.display = "flex";
    }
  }, 200);
  aside.value!.style.opacity = "1";
  aside.value!.style.width = "260px";
};

const dialogFormVisible = ref();
</script>

<template>
  <div class="container">
    <div ref="aside" class="aside">
      <!-- 顶部添加聊天按钮和菜单按钮 -->
      <top-button
        class="topbtn"
        @clear-chat-box="clearChatBox"
        @collapse-aside-menu="collapseAsideMenu"
      />
      <!-- 聊天历史记录 -->
      <chat-log
        ref="chatLogRef"
        :chat-history="chatHistory"
        class="chatlog"
        @chooseChat="chooseChat"
        @deleteChat="deleteChat"
      />
      <!-- 底部设置按钮以及账户按钮 -->
      <set-account :accout-name="accountName" class="account" />
    </div>

    <!-- 显示左侧侧边栏 -->
    <div ref="menu" class="menu" style="display: none" @click="showAsideMenu">
      <icon-svg icon-class="toggle-right" class="menuicon" />
    </div>

    <div class="chatbox">
      <chat-box ref="chatBoxRef" @refreshChatTitles="refreshChatTitles" />
    </div>

    <el-dialog v-model="dialogFormVisible" title="Shipping address">
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 左侧侧边栏 -->
    <!-- 左侧侧边栏隐藏 -->
    <!-- <Transition name="collapse">
      <div class="aside" v-if="isShow">
        <top-button class="topbtn" @clear-chat-box="clearChatBox" @collapse-aside-menu="collapseAsideMenu"></top-button>
        <chat-log ref="chatLogRef" :chat-history="chatHistory" class="chatlog" @chooseChat="chooseChat" @deleteChat="deleteChat"></chat-log>
        <set-account :accout-name="accountName" class="account"></set-account>
      </div>
    </Transition> -->
    <!-- 做侧边栏显示 -->
    <!-- <Transition name="show">
      <div class="menu" v-if="!isShow" @click="showAsideMenu">
        <icon-svg iconClass="toggle-right" class="menuicon" ></icon-svg>
      </div>
    </Transition> -->
  </div>
</template>

<style lang="scss" scoped>
//发送信息窗口的位置
@mixin msgboxPosition {
  position: absolute;
  bottom: 30px;
  left: 0;
}

//侧边栏整体样式
@mixin asideStyle {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 260px;
  height: 100vh;
  padding: 10px;
  border-radius: 10px 0 0 10px;
  @include backgroundColor;
  transition: all 0.3s ease;
}

//对话部分整体样式
@mixin chatboxStyle {
  position: relative;
  box-sizing: border-box;
  flex: 1 0 0%;
  padding: 10px;
  // background-color: yellow;
  height: 100vh;
  transition: flex 0.3s ease;
}

// 大屏布局
@media screen and (min-width: 768px) {
  .container {
    display: flex;

    //侧边栏
    .aside {
      @include asideStyle;
      .topbtn {
        width: 100%;
      }
      .chatlog {
        flex: 1;
        height: 20vh;
      }
      .account {
        width: 100%;
        height: 64px;
      }
    }

    .menu {
      position: absolute;
      z-index: 99;
      margin-top: 18px;
      left: 20px;
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      // background-color: red;
      border-radius: 6px;
      .menuicon {
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        padding: 0 10px;
        font-size: 16px;
        line-height: 38px;
        color: rgb(0, 0, 0);
        border: 1px solid rgba(39, 39, 39, 0.6);
        border-radius: 6px;
        &:deep(.icon) {
          margin-bottom: 0px;
        }

        &:hover {
          cursor: pointer;
          @include hoverBackgroundColor;
          outline: none;
        }
      }
    }

    // 对话框
    .chatbox {
      @include chatboxStyle;
      border-radius: 0 10px 10px 0;
      // 大屏时顶部导航栏不出现
      &:deep(.nav) {
        display: none;
      }

      // 底部输入框
      &:deep(.msgbox) {
        @include msgboxPosition;
      }
    }
  }

  // 隐藏侧边栏过度动画
  // .collapse-enter-active,.collapse-leave-active {
  //   transition: all 0.6s ease-in;
  // }
  // .collapse-enter-from {
  //   transform: translateX(-260px);
  // }
  // .collapse-enter-to{
  //   transform: translateX(0);
  // }
  // .collapse-leave-from{
  //   transform: translateX(0);
  // }
  // .collapse-leave-to{
  //   transform: translateX(-260px);
  // }

  // 显示侧边栏过度动画
  // .show-enter-active{
  //   animation: enter-in 0.5s ease-in;
  // }
  // @keyframes enter-in {
  //   0% {
  //     transform: translateX(180px);
  //     opacity: 0;
  //   }
  //   97%{
  //     opacity: 0.1;
  //   }
  //   100% {
  //     opacity: 1;
  //   }
  // }
  // .show-leave-active {
  //   transition: all 0.6s ease-in;
  // }
  // .show-leave-from{
  //   transform: translateX(-70px);
  //   opacity: 1;
  // }
  // .show-leave-to{
  //   transform: translateX(190px);
  //   opacity: 0;
  // }
}

//小屏布局
@media screen and (max-width: 767px) {
  .container {
    display: flex;

    //侧边栏
    .aside {
      @include asideStyle;
      display: none;
    }

    //对话框
    .chatbox {
      @include chatboxStyle;
      border-radius: 10px 10px 10px 10px;

      // 小屏时顶部导航栏出现
      &:deep(.nav) {
        box-sizing: border-box;
        padding: 10px 30px;
        display: flex;
        height: 50px;
        @include backgroundColor;
        justify-content: space-between;
        border-radius: 5px;
        .icon {
          font-size: 25px;
          line-height: 30px;
          color: white;
        }
      }

      // 底部输入框
      &:deep(.msgbox) {
        @include msgboxPosition;
      }
    }
  }
}
</style>
