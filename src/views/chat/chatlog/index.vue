<script setup lang="ts">
const props = defineProps<{
  chatHistory:ChatHistory //聊天记录
}>()

/**
 * 编辑对话名称，删除对话
 */
//是否显示编辑和删除按钮
const isShowEditIcon = ref<Boolean>(true)
//编辑对话名称功能
const editChatName = ()=>{}
//删除对话功能
const delChat = ()=>{}

/**
 * 选择对话功能
 * @param logId 对话记录id
 */
const chooseDialog = (logId:string)=>{
  console.log(logId);
}
</script>

<template>
  <div class="container">
    <el-scrollbar class="scroller">
      <div class="chatlogbox" v-for="logOnDate in chatHistory">
        <span class="timelog">{{logOnDate.date}}</span>
        <div class="content" v-for="datalog in logOnDate.chatlogs" :key="datalog.id" @click="chooseDialog(datalog.id)">
          <icon-svg icon-class="shenqingapplications" class="text"></icon-svg>
          <el-text class="el-text" truncated>{{ datalog.summary }}</el-text>
          <icon-svg icon-class="bianji" v-if="isShowEditIcon" class="edit" @click="editChatName"></icon-svg>
          <icon-svg icon-class="shanchu" v-if="isShowEditIcon"  class="delete" @click="delChat"></icon-svg>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
$margin:10px;
  .container{
    margin:$margin 0;
    // padding: 5px;
    border-radius: 5px;
    // background-color: #fff;
    display: flex;
    flex-direction: column;
    color: white;

    .scroller{
      // height: ;

      .chatlogbox{
        .timelog{
          padding-left: 15px;
          font-size: 13px;
          line-height: 15px;
          color: $color-font-aside;
        }


        .content{
          display: flex;
          box-sizing: border-box;
          padding: 0px 10px 0 10px;
          // line-height: 20px;
          // border: 1px solid $color-border-aside;
          margin: 7px 5px;
          border-radius: 5px;
          height: 40px;

          .text{
            width: 23px;
            line-height: 40px;
            margin-right: 3px;
            &:deep(.icon){
              font-size: 22px;
            }
          }

          .edit{
            width: 20px;
            line-height: 40px;
            margin-right: 3px;
            &:deep(.icon){
              font-size: 16px;
            }
          }

          .delete{
            width: 20px;
            line-height: 40px;
            margin-right: 3px;
            &:deep(.icon){
              font-size: 16px;
            }
          }

          .el-text{
            flex: 1;
            font-size: 14px;
            color: $color-font-aside;
          }

          &:hover{
            @include hoverBackgroundColor;
          }

          &:first-of-type{
            margin-top: 12px;
          }
          &:last-of-type{
            margin-bottom: 12px;
          }
        }
      }

      .active{
        background-color: rgba(52,53,65,1);
      }
    }



  }
</style>