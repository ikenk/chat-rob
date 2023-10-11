<!-- 底部账户及设置组件 -->
<script setup lang="ts">
import { useUserInfoStore } from "@/stores/userInfo";
import { getUserChat } from "@/api/chat/index";
import type { DialogList } from "@/types/userMsg.d.ts";

const router = useRouter();
const route = useRoute();
const store = useUserInfoStore();
defineProps<{
  accoutName: string;
}>();

/**
 * 退出登录
 */
const logoutAccount = () => {
  store.delToken("user-token");
  router.push({ name: "login" });
};

/**
 * 导出对话
 */
//导出对话框是否显示
const dialogFormVisible = ref(false);
//打开导出对话框
const openExportDialog = () => {
  dialogFormVisible.value = true;
};

const diaList = ref<DialogList>([]); //对话列表(格式)
//获取后台对话数据函数
const getChatContent = async (chatlogID: string) => {
  const res = await getUserChat(chatlogID);
  diaList.value = res.data!.chatlog;
  console.log(diaList.value);
};

const exportWord = () => {
  dialogFormVisible.value = false;
  getChatContent(route.params.params);
};

const exportExcel = () => {
  dialogFormVisible.value = false;
};

const exportPdf = () => {
  dialogFormVisible.value = false;
};
</script>

<template>
  <div class="container">
    <div class="account">
      <div class="userpic">
        <span>{{ accoutName.slice(0, 2) }}</span>
      </div>
      <div class="username">
        <span>{{ accoutName }}</span>
      </div>
    </div>
    <div class="button">
      <!-- 设置logo -->
      <el-dropdown class="setting-dropdown">
        <span class="el-dropdown-link">
          <icon-svg class="setting" icon-class="shezhi"></icon-svg>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="setting-dropdown-menu">
            <el-dropdown-item class="setting-dropdown-item"
              >账户设置</el-dropdown-item
            >
            <el-dropdown-item class="setting-dropdown-item" disabled
              >Action 2</el-dropdown-item
            >
            <el-dropdown-item
              class="setting-dropdown-item"
              @click="openExportDialog"
              >导出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出logo -->
      <div class="logout">
        <icon-svg icon-class="icon-" @click="logoutAccount"></icon-svg>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" class="export-dialog" title="导出">
      <div class="export">
        <span>导出为Word(.doc .docx文件)</span>
        <el-button @click="exportWord">导出</el-button>
      </div>
      <div class="export">
        <span>导出为Excel(.xsl文件)</span>
        <el-button @click="exportExcel">导出</el-button>
      </div>
      <div class="export">
        <span>导出为PDF(.pdf文件)</span>
        <el-button @click="exportPdf">导出</el-button>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            Confirm
          </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.container {
  // width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
  // background-color: yellow;
  // border: 1px solid $color-border-aside;
  border-radius: 5px;
  box-sizing: border-box;
  .account {
    display: flex;
    margin-bottom: 5px;
    // width: 100%;
    .userpic {
      flex: 1 1 0%;
      // background-color: red;
      padding-left: 5px;
      span {
        display: inline-block;
        width: 28px;
        font-size: 20px;
        text-align: center;
        color: $color-font-aside;
        border-radius: 3px;
        background-color: rgba(98, 153, 175, 0.8);
      }
    }

    .username {
      flex: 4 1 0%;
      overflow: hidden;
      color: $color-font-aside;
      background-color: rgba(59, 59, 59, 0.8);
      font-size: 14px;
      display: flex;
      align-items: center;
      padding-left: 8px;
      border-radius: 3px;
    }
  }

  .button {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    // width: 100%;

    .setting-dropdown {
      flex: 1 1 0%;

      .setting {
        flex: 1 1 0%;
        // background-color: red;
        padding-left: 7px;
        color: $color-font-aside;
        font-size: 20px;
        line-height: 20px;

        &:deep(.icon) {
          &:hover {
            cursor: pointer;
            color: #e4e4e4;
          }
        }
      }
    }

    .logout {
      flex: 4 1 0%;
      padding-right: 5px;
      // background-color: green;
      color: $color-font-aside;
      font-size: 18px;
      line-height: 20px;
      display: flex;
      justify-content: end;

      &:deep(.icon) {
        &:hover {
          cursor: pointer;
          color: #fff;
        }
      }
    }
  }

  &:deep(.el-overlay) {
    // background-color: red;
    .el-overlay-dialog {
      .el-dialog {
        border-radius: 8px;

        .el-dialog__body {
          padding: 10px 20px;

          .export {
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              display: inline-block;
            }
          }
        }
      }
    }
  }
}

.setting-dropdown-menu {
  // background-color: red;

  &:deep(.setting-dropdown-item) {
    &:hover {
      background-color: #fff;
      color: $color-font-setting;
    }
  }
}
</style>
