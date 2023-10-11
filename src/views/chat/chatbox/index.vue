<!-- 右侧聊天对话框组件 -->
<script setup lang="ts">
import ChatItem from "./ChatItem.vue";
import type { ElScrollbar, ElButton } from "element-plus";
import { fetchUtil } from "@/utils/fetch";
import { getUUID, getUserChat } from "@/api/chat/index";
import { useUserInfoStore } from "@/stores/userInfo";
import type {
  OpenAIMessage,
  DialogList,
  DialogMsg,
} from "@/types/userMsg.d.ts";
import SparkMD5 from "spark-md5";
const store = useUserInfoStore();
const router = useRouter();
const route = useRoute();

const msg = ref<string>(""); //input输入框的v-model
const userMsg = ref<OpenAIMessage>(); //发送给后台的消息(格式)
const diaList = ref<DialogList>([]); //对话列表(格式)

//为了能够实现流式数据在自组件上的响应，需要先在diaList里添加一个响应式对象，然后再向对象的content中添加流式数据
const assistItem = ref<DialogMsg>();
const userItem = ref<DialogMsg>();

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>(); // el-scrollbar 组件对象
const conversation = ref(); // conversation组件对象

const emit = defineEmits(["refreshChatTitles"]);

//获取后台对话数据函数
const getChatContent = async (chatlogID: string) => {
  const res = await getUserChat(chatlogID);
  diaList.value = res.data!.chatlog;
  nextTick(() => {
    // console.log(scrollbarRef.value!.wrapRef!.scrollHeight);
    // console.log(conversation.value.clientHeight );
    // console.dir(scrollbarRef.value!.wrapRef!);
    if (
      scrollbarRef.value!.wrapRef!.scrollHeight >
      conversation.value.clientHeight -
        +conversation.value.style["padding-bottom"].slice(0, 2)
    ) {
      scrollbarRef.value!.setScrollTop(
        scrollbarRef.value!.wrapRef!.scrollHeight -
          conversation.value.clientHeight +
          +conversation.value.style["padding-bottom"].slice(0, 2),
      );
    }
  });
};

defineExpose({
  diaList,
  getChatContent,
});

//根据地址栏的id，向后台请求响应的对话数据
onMounted(async () => {
  // console.log(route.params.params);
  await getChatContent(route.params.params);
});

/**
 * 1.发送消息
 */
//中止控制器
let controller: AbortController;
//向后台发送消息函数
const sendMsgToBack = async () => {
  if (msg.value) {
    isShowAbortBtn.value = true; //显示中断按钮
    // console.log(msg.value);
    userMsg.value = {
      content: msg.value,
    };
    userItem.value = {
      _id: Symbol(),
      role: "user",
      content: msg.value,
    };
    diaList.value.push(userItem.value);
    /**
     * 向@diaList 中推入 @userItem 后紧接着判断是否需要下滚，并执行下滚操作并不会立即下滚
     * 这是由于vue的更新机制所导致的，这个同步更新视图的操作还在一个 @nexttick 周期中
     * 因此需要使用 @nextTick 函数来对视图进行更新
     */
    //判断用户输入后是否需要下滚
    if (
      scrollbarRef.value!.wrapRef!.scrollHeight >
      conversation.value.clientHeight -
        +conversation.value.style["padding-bottom"].slice(0, 2)
    ) {
      nextTick(() => {
        /**
         * @setScrollTop 方法是 el-scrollbar 组件提供的滚动到指定位置的方法之一
         * @scrollbarRef 无法直接取到组件的 @scrollHeight ，而必需使用 @wrapRef 取到 @scrollHeight
         * @conversation 组件的高度是不变的，因此 @clientHeight 可以用作滚动高度的参考
         * 当滚动条内的滚动高度大于外部的父元素高度时，表明需要自动向下滚动了，
         * 这时使用 @setScrollTop 方法设置滚动高度
         */
        scrollbarRef.value!.setScrollTop(
          scrollbarRef.value!.wrapRef!.scrollHeight -
            conversation.value.clientHeight +
            +conversation.value.style["padding-bottom"].slice(0, 2),
        );
      });
    }
    msg.value = "";

    //判断是否为新建对话，若是，则向后台获取uuid，并跳转到响应路由
    const rep = await getUUID(`${route.params.params}`);
    // console.log(rep.data?.chatID);
    if (rep.data?.chatID) {
      router.push("/chat/" + rep.data?.chatID);
      emit("refreshChatTitles", rep.data?.chatID);
    }

    // 创建一个新的请求中止控制器
    controller = new AbortController();
    const res = await fetchUtil(
      `/chat/conversation/${route.params.params}`,
      "POST",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.getToken("user-token")}`,
      },
      controller.signal, // 请求中止标识
      JSON.stringify(userMsg.value),
    );
    assistItem.value = {
      _id: Symbol(),
      role: "assist",
      content: "",
    };
    //token过期的情况下需要跳转到登录页面，并且删除最近的一次对话
    if (res.status === 401) {
      // ElMessage({
      //   type: "error",
      //   message:"身份验证过期"
      // })
      router.push({ name: "login" });
      diaList.value.pop();
    }
    diaList.value.push(assistItem.value);
    // console.log(diaList.value);
    // 流式读取
    const reader = res.body?.getReader(); //读取器
    // console.log(reader);
    const decoder = new TextDecoder(); //解析器
    while (reader) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const txt = decoder.decode(value);
      // console.log(txt);
      assistItem.value.content += txt;
      /**
       * @setScrollTop 方法是 el-scrollbar 组件提供的滚动到指定位置的方法之一
       * @scrollbarRef 无法直接取到组件的 @scrollHeight ，而必需使用 @wrapRef 取到 @scrollHeight
       * @conversation 组件的高度是不变的，因此 @clientHeight 可以用作滚动高度的参考
       * 当滚动条内的滚动高度大于外部的父元素高度时，表明需要自动向下滚动了，
       * 这时使用 @setScrollTop 方法设置滚动高度
       */
      if (
        scrollbarRef.value!.wrapRef!.scrollHeight >
        conversation.value.clientHeight -
          +conversation.value.style["padding-bottom"].slice(0, 2)
      ) {
        scrollbarRef.value!.setScrollTop(
          scrollbarRef.value!.wrapRef!.scrollHeight -
            conversation.value.clientHeight +
            +conversation.value.style["padding-bottom"].slice(0, 2),
        );
      }
    }
    // console.log(diaList.value);
    isShowAbortBtn.value = false; //隐藏中断按钮
    // console.log(res.status);
    if (rep.data?.chatID) {
      emit("refreshChatTitles", rep.data?.chatID);
    }
  } else {
    return;
  }
};

//按钮发送消息
const sendMsgBtn = () => {
  //向后台发送消息
  sendMsgToBack();
};

//键盘enter键发送消息
const sendmsgKey = (evt: KeyboardEvent | Event) => {
  if (evt instanceof KeyboardEvent) {
    // 类型守卫
    if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && evt.key === "Enter") {
      // e.cancelBubble = true; //ie阻止冒泡行为
      evt.stopPropagation(); //Firefox阻止冒泡行为
      evt.preventDefault(); //取消事件的默认动作*换行
      //向后台发送消息
      sendMsgToBack();
    }
  }
};

/**
 * 2.打断消息
 */
//是否显示打断消息按钮
const isShowAbortBtn = ref(false);
const abortbtn = ref<InstanceType<typeof ElButton>>();
// 打断消息
const abortmsgBtn = async () => {
  // console.log('abort');
  controller.abort();
  await fetchUtil(
    `/chat/conversation/${route.params.params}`,
    "POST",
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.getToken("user-token")}`,
    },
    undefined,
    JSON.stringify({ abort: true }),
  );
  isShowAbortBtn.value = false;
};

/**
 * 3.发送文件给后台
 */
//获取input元素
const uploadFile = ref<HTMLInputElement>();
//设置分片大小
const CHUNK_SIZE = 1024;
//文件的hash值
const fileHash = ref<string>("");
//文件名字
const fileName = ref<string>("");
//文件上传百分比
const percentage = ref<string>();
onMounted(() => {
  //给input元素添加change事件
  uploadFile.value!.addEventListener("change", handler);
});
//input元素change事件的callback函数
const handler = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files?.length <= 0) {
    return;
  }
  // console.log(files);
  //设置文件名字
  fileName.value = files[0].name;
  // console.log(fileName.value);
  //预览图片
  previewPic(files[0]);
  //图片切片并返回切片数组
  const fileChunkList = createFileChunks(files[0], CHUNK_SIZE);
  // console.log(fileChunkList);
  //将文件切片数组做信息摘要
  fileHash.value = (await calculateHash(fileChunkList, CHUNK_SIZE)) as string;
  // console.log(fileHash.value);
  await uploadChunks(fileChunkList, fileHash.value, fileName.value);
  uploadImgUrl.value = "";
  // e.target.value = "";
};
//添加点击事件
const sendFileBtn = () => {
  uploadFile.value!.click();
};

//图片预览URL
const uploadImgUrl = ref<string>();
//将图片转成base64格式进行预览
const previewPic = (file: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e: Event) => {
    uploadImgUrl.value = e.target.result;
  };
};

//对文件进行分片处理
const createFileChunks = (file: Blob, chunkSize: number) => {
  const fileChunkList = [];
  let curSize = 0; //当前起点
  while (curSize < file.size) {
    fileChunkList.push({
      file: file.slice(curSize, curSize + chunkSize),
    });
    curSize = curSize + chunkSize;
  }
  return fileChunkList;
};

//计算文件分片的hash值,
// 第一个和最后一个切片的内容全部参与计算,
// 中间剩余的切片我们分别在前面、后面和中间取2个字节参与计算
const calculateHash = (
  fileChunkList: Array<{ file: Blob }>,
  chunkSize: number,
) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const chunksForHash: Blob[] = []; //存放需要进行信息摘要的文本

    fileChunkList.forEach((chunk, index, array) => {
      if (index === 0 || index === array.length - 1) {
        // 第一个和最后一个切片的内容全部参与计算
        chunksForHash.push(chunk.file);
      } else {
        // 中间剩余的切片我们分别在前面、后面和中间取2个字节参与计算
        // 前面的2字节
        chunksForHash.push(chunk.file.slice(0, 2));
        // 中间的2字节
        chunksForHash.push(chunk.file.slice(chunkSize / 2, chunkSize / 2 + 2));
        // 后面的2字节
        chunksForHash.push(chunk.file.slice(chunkSize - 2, chunkSize));
      }
    });
    // console.log(chunks);
    // console.log(new Blob(chunks));
    const reader = new FileReader();
    reader.readAsArrayBuffer(new Blob(chunksForHash));
    reader.onload = (e: Event) => {
      spark.append(e?.target?.result as ArrayBuffer);
      resolve(spark.end());
    };
  });
};

//上传切片文件
const uploadChunks = async (
  fileChunkList: Array<{ file: Blob }>,
  fileHash: string,
  fileName: string,
) => {
  //对文件切片做标记，以便后端的文件合成
  const data = fileChunkList.map(({ file }, index) => {
    return {
      fileHash,
      index,
      chunk: file,
      chunkHash: `${fileHash}-${index}`,
      size: file.size,
    };
  });

  // console.log(data);

  //做formdata数组
  const formDatas = data.map(({ chunk, chunkHash }) => {
    const formData = new FormData();
    // 添加切片文件
    formData.append("chunk", chunk);
    // 添加切片文件的切片hash值
    formData.append("chunkHash", chunkHash);
    //添加切片文件名称
    formData.append("fileName", fileName);
    //添加切片文件的hash值
    formData.append("fileHash", fileHash);
    return formData;
  });

  console.log(formDatas);

  //浏览器并发请求
  let index = 0;
  const concurrentMax = 6; // 并发请求数量
  const taskPool: any = [];

  while (index < formDatas.length) {
    const task = fetchUtil(
      "/upload",
      "POST",
      {
        Authorization: `Bearer ${store.getToken("user-token")}`,
      },
      undefined,
      formDatas[index],
    );
    task.then(() => {
      taskPool.splice(
        taskPool.findIndex((item: any) => item === task),
        1,
      );
    });
    taskPool.push(task);
    if (taskPool.length === concurrentMax) {
      await Promise.race(taskPool);
      index++;
      percentage.value = ((index / formDatas.length) * 100).toFixed(0);
      // console.log(index);
      // console.log(percentage.value);
    }
  }
  await Promise.all(taskPool);
};
</script>

<template>
  <nav class="nav">
    <icon-svg icon-class="toggle-right" class="icon"></icon-svg>
    <icon-svg icon-class="add" class="icon"></icon-svg>
  </nav>
  <div ref="conversation" class="conversation" style="padding-bottom: 40px">
    <el-scrollbar ref="scrollbarRef">
      <ChatItem
        v-for="item in diaList"
        :key="item._id"
        :message="item.content"
        :role="item.role"
      ></ChatItem>
    </el-scrollbar>
  </div>
  <div class="msgbox">
    <el-button class="send-file-btn" @click="sendFileBtn">
      <icon-svg icon-class="RectangleCopy"></icon-svg>
      <input ref="uploadFile" type="file" style="display: none" />
    </el-button>
    <div class="send-content">
      <div v-if="uploadImgUrl" class="upload-img" @click="uploadImgUrl = ''">
        <div class="img-container">
          <img class="img" :src="uploadImgUrl" alt="" />
        </div>
      </div>
      <el-input
        v-model="msg"
        class="sendmsg"
        maxlength="1000"
        placeholder="你想说点什么..."
        show-word-limit
        type="textarea"
        resize="none"
        :autosize="{ minRows: 1, maxRows: 9 }"
        @keydown="sendmsgKey"
      />
      <div v-if="isShowAbortBtn" class="abort">
        <el-button ref="abortbtn" class="abortbtn" @click="abortmsgBtn">
          <ChatLoading class="chatloading"></ChatLoading> 停止...响应
        </el-button>
      </div>
    </div>
    <el-button class="send-msg-btn" @click="sendMsgBtn">
      <icon-svg icon-class="RectangleCopy"></icon-svg>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.conversation {
  box-sizing: border-box;
  height: 88%;
}

.msgbox {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: end;

  //图片输入和消息输入
  .send-content {
    width: 66%;
    position: relative;
    //图片显示框
    .upload-img {
      position: relative;
      padding-left: 5px;
      // box-sizing: border-box;
      height: 40px;
      line-height: 40px;
      border: 1px solid #dcdfe6;
      border-bottom: 0;
      border-radius: 4px 4px 0 0;
      .img-container {
        position: absolute;
        height: 100%;
        .img {
          height: 100%;
        }

        &:hover::before {
          position: absolute;
          content: "x";
          color: #fff;
          font-size: 20px;
          text-align: center;
          display: block;
          width: 100%;
          height: 100%;
          background-color: rgba($color: #000000, $alpha: 0.5);
        }
      }

      // &:hover::before {
      //   position: absolute;
      //   content: "x";
      //   color: #fff;
      //   font-size: 20px;
      //   text-align: center;
      //   display: block;
      //   width: 100%;
      //   height: 100%;
      //   background-color: rgba($color: #000000, $alpha: 0.5);
      // }
    }

    //输入框
    .sendmsg {
      width: 100%;
      &:deep(.el-textarea__inner) {
        &:focus {
          box-shadow: 0 0 0 1px rgba(32, 33, 35, 0) inset;
        }
      }
    }

    //中断对话
    .abort {
      position: absolute;
      // bottom: 40px;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      .abortbtn {
        font-size: 13px;
        font-weight: 400;
        padding: 5px 10px;
        color: $color-font-chatbox;
        &:hover {
          background-color: #fff;
          color: #409eff;
          .chatloading {
            &:deep(.loading) {
              color: #409eff;
            }
          }
        }
        &:active {
          border-color: rgb(214, 214, 214, 0);
          box-shadow: 1px 1px 1px 1px rgba(32, 33, 35, 0.2) inset;
        }

        .chatloading {
          font-size: 18px;
          margin-right: 5px;
        }
      }
    }
  }

  // 输入框旁的确认按钮
  .send-msg-btn,
  .send-file-btn {
    padding: 5px 5px 5px 2px;
    font-size: 26px;
    background-color: white;

    &:active {
      border-color: rgb(214, 214, 214, 0);
      box-shadow: 1px 1px 1px 1px rgba(32, 33, 35, 0.2) inset;
    }
  }
}
</style>
