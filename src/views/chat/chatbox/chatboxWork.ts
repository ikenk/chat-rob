import SparkMD5 from "spark-md5";
// import { useUserInfoStore } from "@/stores/userInfo";
import { fetchUtil } from "@/utils/fetch";

// const store = useUserInfoStore();

//定义接收消息的函数
//方式一
self.onmessage = async function (e: MessageEvent) {
  // onmessage获取传入的初始值
  console.log(e.data);
  //图片切片并返回切片数组
  const fileChunkList = createFileChunks(e.data.file, e.data.CHUNK_SIZE);
  //将文件切片数组做信息摘要
  const fileHash = (await calculateHash(
    fileChunkList,
    e.data.CHUNK_SIZE,
  )) as string;
  //上传文件分片
  await uploadChunks(fileChunkList, fileHash, e.data.file.name, e.data.token);
  //等待上传完后向服务器发送合并请求
  const res = await mergeRequest(
    e.data.CHUNK_SIZE,
    fileHash,
    e.data.file.name,
    e.data.token,
  );
  console.log(res);
  self.close();
};
//方式二
// self.addEventListener("message", (e) => {
//   console.log(e);
//   console.log("xxxxx");
// });

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
  token: string,
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

  // console.log(formDatas);

  //浏览器并发请求
  let index = 0;
  const concurrentMax = 6; // 并发请求数量
  const taskPool: any = [];
  let percentage;

  while (index < formDatas.length) {
    const task = fetchUtil(
      "/upload",
      "POST",
      {
        Authorization: `Bearer ${token}`,
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
      percentage = ((index / formDatas.length) * 100).toFixed(2);
      // 将percentage计算的结果传递出去
      self.postMessage({ percentage });
    }
  }
  await Promise.all(taskPool);
};

/**
 * 发请求通知服务器，合并切片
 */
const mergeRequest = (
  CHUNK_SIZE: number,
  fileHash: string,
  fileName: string,
  token: string,
) => {
  return fetchUtil(
    "/upload/merge",
    "POST",
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    undefined,
    JSON.stringify({
      size: CHUNK_SIZE,
      fileHash: fileHash,
      fileName: fileName,
    }),
  );
};

// //图片切片并返回切片数组
// const fileChunkList = createFileChunks(file, CHUNK_SIZE);
// // console.log(fileChunkList);
// //将文件切片数组做信息摘要
// fileHash = (await calculateHash(fileChunkList, CHUNK_SIZE)) as string;
// // console.log(fileHash.value);
// //上传文件分片
// await uploadChunks(fileChunkList, fileHash, fileName);
// //等待上传完后向服务器发送合并请求
// const res = await mergeRequest();
// console.log(res);
