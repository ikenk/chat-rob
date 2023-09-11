<script setup lang="ts">
const sendmsg = ref<string>('')
</script>

<template>
  <nav class="nav">
    <icon-svg icon-class="toggle-right" class="icon"></icon-svg>
    <icon-svg icon-class="add" class="icon"></icon-svg>
  </nav>
  <div class="msgbox">
    <el-input
      class="sendmsg"
      v-model="sendmsg"
      maxlength="1000"
      placeholder="你想说点什么..."
      show-word-limit
      type="textarea"
      resize="none"
      :autosize="{ minRows: 1, maxRows: 9 }"
    />
    <el-button class="sendbtn">
      <icon-svg icon-class="RectangleCopy"></icon-svg>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
  .msgbox{
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