<!-- 左侧中间部分聊天标题组件 -->
<script setup lang="ts">
import { renameChatLog, deleteChatLog } from "@/api/chat/index";
import type { ChatHistory } from "@/types/chatHistory.d.ts";
const router = useRouter();
const route = useRoute();

const prop = defineProps<{
  chatHistory?: ChatHistory; //聊天记录
}>();

const emit = defineEmits(["chooseChat", "deleteChat"]);

/**
 * 选择对话功能
 * @param chatlogID 对话记录id
 */
const indexActive = ref<string>("");
const chooseDialog = async (chatlogID: string) => {
  // console.log(chatlogID);
  indexActive.value = chatlogID;
  if (!isEdited.value) {
    router.push(`/chat/${chatlogID}`);
    emit("chooseChat", chatlogID);
  }
};
onMounted(() => {
  indexActive.value = route.params.params;
});

defineExpose({
  indexActive,
});

/**
 * 编辑对话名称
 */
//是否在修改状态
const isEdited = ref<boolean>(false);
//输入框
const rename = ref<string>("");
//编辑对话名称功能
const editChatName = async () => {
  isEdited.value = true;
};
//确定需要编辑名字
const ensureName = async () => {
  console.log(rename.value);
  if (rename.value === "") {
    isEdited.value = false;
    return;
  }
  const res = await renameChatLog(route.params.params, { name: rename.value });
  prop.chatHistory?.forEach((item) => {
    item.chatlogs.forEach((item) => {
      if (item.chatlogID === route.params.params) {
        item.chatTitle = rename.value;
      }
    });
  });
  console.log(res);
  rename.value = "";
  isEdited.value = false;
};

//取消编辑名字
const cancelRename = () => {
  rename.value = "";
  isEdited.value = false;
};

//删除对话功能
const delChat = () => {
  // console.log('delete');
  dialogVisible.value = true;
};

/**
 * 删除时的警告框
 * @param {dialogVisible} 是否可见
 * @function {deleteDialog} 删除操作
 */
const dialogVisible = ref(false);

const deleteDialog = async () => {
  dialogVisible.value = false;
  console.log("sure delete");
  const res = await deleteChatLog(route.params.params);
  console.log(res);
  emit("deleteChat", "delete");
  router.push("/");
};
</script>

<template>
  <div class="container">
    <el-scrollbar class="scroller">
      <div
        v-for="(logOnDate, index) in chatHistory"
        :key="index"
        class="chatlogbox"
      >
        <span class="timelog">{{ logOnDate.date }}</span>
        <div
          v-for="datalog in logOnDate.chatlogs"
          :key="datalog.chatlogID"
          class="content"
          :class="{ active: datalog.chatlogID === indexActive }"
          @click="chooseDialog(datalog.chatlogID)"
        >
          <icon-svg icon-class="shenqingapplications" class="text" />
          <el-input
            v-if="isEdited && datalog.chatlogID === indexActive"
            v-model="rename"
            class="edit-input"
            placeholder="Please input"
            clearable
            @click.stop
          />
          <el-text v-else class="el-text" truncated>
            {{ datalog.chatTitle }}
          </el-text>
          <icon-svg
            v-if="datalog.chatlogID === indexActive && !isEdited"
            icon-class="bianji"
            class="edit"
            @click.stop="editChatName"
          />
          <icon-svg
            v-if="datalog.chatlogID === indexActive && isEdited"
            icon-class="select"
            class="edit"
            @click.stop="ensureName"
          />
          <icon-svg
            v-if="datalog.chatlogID === indexActive && isEdited"
            icon-class="close"
            class="edit"
            @click.stop="cancelRename"
          />
          <icon-svg
            v-if="datalog.chatlogID === indexActive && !isEdited"
            icon-class="shanchu"
            class="delete"
            @click.stop="delChat"
          />
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      v-model="dialogVisible"
      title="警告"
      width="30%"
      class="warning-dialog"
    >
      <span>您确定要删除吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteDialog"> 删除 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
$margin: 10px;
.container {
  margin: $margin 0;
  // padding: 5px;
  border-radius: 5px;
  // background-color: #fff;
  display: flex;
  flex-direction: column;
  color: white;

  .scroller {
    .chatlogbox {
      .timelog {
        padding-left: 15px;
        font-size: 13px;
        line-height: 15px;
        color: $color-font-aside;
      }

      .content {
        display: flex;
        box-sizing: border-box;
        padding: 0 10px 0 10px;
        // line-height: 20px;
        // border: 1px solid $color-border-aside;
        margin: 7px 5px;
        border-radius: 5px;
        height: 40px;

        .text {
          width: 23px;
          line-height: 40px;
          margin-right: 3px;
          &:deep(.icon) {
            margin-top: 9px;
            font-size: 22px;
          }
        }

        .edit {
          width: 20px;
          line-height: 40px;
          margin-right: 3px;
          color: rgb(207, 207, 207);
          &:deep(.icon) {
            font-size: 16px;
            &:hover {
              color: rgb(255, 255, 255);
            }
          }
        }

        .delete {
          width: 20px;
          line-height: 40px;
          margin-right: 3px;
          color: rgb(207, 207, 207);
          &:deep(.icon) {
            font-size: 16px;
            &:hover {
              color: rgb(255, 255, 255);
            }
          }
        }

        .el-text {
          flex: 1;
          font-size: 14px;
          color: $color-font-aside;
        }

        .edit-input {
          margin-top: 7px;
          margin-right: 5px;
          height: 25px;
          &:deep(.el-input__wrapper) {
            border-radius: 5px;
            &.is-focus {
              box-shadow: 0 0 0 0;
            }
          }
        }

        &:hover {
          @include hoverBackgroundColor;
        }

        &:first-of-type {
          margin-top: 12px;
        }
        &:last-of-type {
          margin-bottom: 12px;
        }
      }
    }
  }
  // 警告框样式
  &:deep(.el-overlay) {
    // background-color: red;
    & .el-dialog {
      border-radius: 6px;
    }
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
}

//当前点击的对话的激活样式
.active {
  background-color: rgba(52, 53, 65, 1);
}
</style>
