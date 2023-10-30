// /trimpic
<script setup lang="ts">
const uploadFile = ref<HTMLInputElement>();
const sendFileBtn = () => {
  if (uploadFile.value) {
    uploadFile.value.click();
  }
};
onMounted(() => {
  if (uploadFile.value) {
    uploadFile.value.addEventListener("change", handler);
  }
});

const image = ref<HTMLImageElement>();
const isShow = ref<boolean>(false);
const handler = (e: Event) => {
  isShow.value = true;
  isDragging.value = false;
  isTrimmed.value = false;
  // console.log((e.target as HTMLInputElement).files);
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length <= 0) {
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = (e: Event) => {
    // console.log((e.target as FileReader).result);
    // 实例一个Image对象，为了获取宽、高（下文预览图片时需要）
    image.value = new Image();
    image.value.onload = () => {
      // console.dir(e.target);
      drawImage(image.value!, ctx.value as CanvasRenderingContext2D);
    };
    image.value.src = (e.target as FileReader).result as string;
    image.value.crossOrigin = "Anonymous"; //解决跨域问题
  };
};

/**
 * 使用canvas裁剪图片
 */
const canvas = ref<HTMLCanvasElement>();
// 获取canvas的上下文
const ctx = ref<CanvasRenderingContext2D | null>();
const initCxt = () => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext("2d", { willReadFrequently: true });
  } else {
    return;
  }
};
onMounted(() => {
  if (document.querySelector("img")) {
    const img = document.querySelector("img");
    document.body.removeChild(img!);
  }
  initCxt();
});
//将上传的图片画在canvas上
const drawImage = (image: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
  // 设置默认canvas元素大小
  const canvasDefaultSize = 300;
  // 初始化canvas画布大小, 获取等比例缩放后的canvas宽高尺寸
  let proportion = image.width / image.height;
  let scale =
    proportion > 1
      ? canvasDefaultSize / image.width
      : canvasDefaultSize / image.height;
  //需要考虑dpr 但下面的代码没考虑（笑）
  let canvasWidth = image.width * scale;
  let canvasHeight = image.height * scale;
  if (canvas.value) {
    canvas.value.width = canvasWidth;
    canvas.value.height = canvasHeight;
    canvas.value.style.width = canvasWidth + "px";
    canvas.value.style.height = canvasHeight + "px";
  } else {
    return;
  }
  ctx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);
};

/**
 * 裁剪图片函数
 */
const isDragging = ref<boolean>(false); //鼠标是否在拖动
const startX = ref<number>(0); //起点x坐标
const startY = ref<number>(0); //起点y坐标
const trimWidth = ref<number>(0); //裁剪宽度
const trimHeight = ref<number>(0); //裁剪高度
// 点下鼠标，定位裁剪起点
const mouseDownEvent = (e: MouseEvent) => {
  if (isTrimmed.value) {
    return;
  }
  isDragging.value = true;
  // console.log("mouseDownEvent", e);
  startX.value = e.offsetX;
  startY.value = e.offsetY;
  // console.log(startX.value, startY.value);
};
// 移动鼠标，划定裁剪范围
const mouseMoveEvent = (e: MouseEvent) => {
  if (!isDragging.value) return;
  // console.log(e);
  // 计算临时裁剪框的宽高
  let tempWidth = e.offsetX - startX.value;
  let tempHeight = e.offsetY - startY.value;
  // 调用绘制裁剪框的方法
  trimPic(
    startX.value,
    startY.value,
    tempWidth,
    tempHeight,
    ctx.value as CanvasRenderingContext2D,
    image.value as HTMLImageElement,
  );
};
// 抬起鼠标，定位裁剪终点
const mouseUpEvent = (e: MouseEvent) => {
  if (isTrimmed.value) {
    return;
  }
  isDragging.value = false;
  if (!(e.offsetX - startX.value) || !(e.offsetY - startY.value)) {
    return;
  }
  isTrimmed.value = true;
  // console.log("mouseUpEvent", e);
  trimWidth.value = e.offsetX - startX.value;
  trimHeight.value = e.offsetY - startY.value;
  if (ctx.value) {
    ctx.value.save();
    ctx.value.beginPath();
    ctx.value.rect(
      startX.value,
      startY.value,
      trimWidth.value,
      trimHeight.value,
    );
    console.log(startX.value, startY.value, trimWidth.value, trimHeight.value);
    // ctx.value.stroke(); // 绘制路径
    ctx.value.closePath();
    ctx.value.restore();
  }
};
//判断是否正在裁剪
let isTrimmed = ref<boolean>(false);
// 绘制裁剪框方法
const trimPic = (
  startX: number,
  startY: number,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
) => {
  // 每一帧都需要清除画布
  if (canvas.value && ctx) {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  } else {
    return;
  }

  ctx.save();

  // 绘制蒙层
  ctx.fillStyle = "rgba(0,0,0,0.6)"; // 蒙层颜色
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

  // 将蒙层凿开
  ctx.globalCompositeOperation = "source-atop";
  ctx.clearRect(startX, startY, width, height); // 裁剪选择框

  // 绘制8个边框像素点并保存坐标信息以及事件参数
  const size = 10; //边框点尺寸
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#fc178f";
  // 左上顶点
  ctx.fillRect(startX - size / 2, startY - size / 2, size, size);
  // 右上顶点
  ctx.fillRect(startX + width - size / 2, startY - size / 2, size, size);
  // 左下顶点
  ctx.fillRect(startX - size / 2, startY + height - size / 2, size, size);
  //右下顶点
  ctx.fillRect(
    startX + width - size / 2,
    startY + height - size / 2,
    size,
    size,
  );

  ctx.restore();

  ctx.save();

  // 再次使用drawImage将图片绘制到蒙层下方
  ctx.globalCompositeOperation = "destination-over";
  ctx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);

  ctx.restore();
};

//取消裁剪
const cancelTrim = () => {
  if (image.value && ctx.value && isTrimmed.value) {
    drawImage(image.value, ctx.value);
    // console.log("cancelled");
    isTrimmed.value = false;
  } else {
    return;
  }
};

/**
 * 获取剪裁后的图片
 */
// 图片像素信息
const imageData = ref<ImageData>();
//获取裁剪后图片的方法
const getTrimmedImage = () => {
  if (ctx.value) {
    if (isTrimmed.value) {
      // 如果裁剪过就按裁剪过后的尺寸来获取图片像素信息
      imageData.value = ctx.value.getImageData(
        startX.value,
        startY.value,
        trimWidth.value,
        trimHeight.value,
      );
    } else {
      //如果没有裁剪过则获取整张图的像素信息
      if (image.value) {
        imageData.value = ctx.value.getImageData(
          startX.value,
          startY.value,
          image.value.width,
          image.value.height,
        );
      } else {
        throw Error("no image,please select one image");
      }
    }
    // console.log(imageData.value);
    imageData2Blob(imageData.value);
  } else {
    throw Error("ctx:CanvasRenderingContext2D is not defined");
  }
};
//将(裁剪过后的)图片转换成Blob格式
const imageData2Blob = (imageData: ImageData) => {
  const saveCanvas = document.createElement("canvas");
  //设置canvas的尺寸，与输入的imageData保持一致
  saveCanvas.width = imageData.width * window.devicePixelRatio;
  saveCanvas.height = imageData.height * window.devicePixelRatio;
  saveCanvas.style.width = imageData.width + "px";
  saveCanvas.style.height = imageData.height + "px";
  const saveCtx = saveCanvas.getContext("2d", { willReadFrequently: true });
  if (saveCtx) {
    saveCtx.clearRect(0, 0, imageData.width, imageData.height);
    //将imageData放入canvas中
    saveCtx.putImageData(imageData, 0, 0);
    //将canvas中的图片转换成Blob格式
    saveCanvas.toBlob((blob) => {
      console.log(blob);
      const reader = new FileReader();
      reader.readAsDataURL(blob!);
      reader.onload = (e) => {
        // console.log(e.target?.result);
        const img = document.createElement("img");
        img.style.display = "block";
        img.src = e.target!.result as string;
        document.body.appendChild(img);
      };
    });
  }
};

/**
 * 拖动裁剪功能
 */
//点击的地方是否在裁剪区域内
const isInPath = ref<boolean>(false);
//是否在点击区域拖动
const isInPathDraging = ref<boolean>(false);
//在裁剪区域内开始拖动的坐标
const isInPathStartX = ref<number>(0);
const isInPathStartY = ref<number>(0);
onMounted(() => {
  if (canvas.value) {
    //开始拖动裁剪区域
    canvas.value.onmousedown = (e: MouseEvent) => {
      if (ctx.value && canvas.value && isTrimmed.value) {
        isInPath.value = ctx.value.isPointInPath(e.offsetX, e.offsetY);
        console.log(isInPath.value);
        if (isInPath.value) {
          canvas.value.style.cursor = "pointer";
          isInPathDraging.value = true;
          isInPathStartX.value = e.offsetX;
          isInPathStartY.value = e.offsetY;
        }
      } else {
        return;
      }
    };
    //拖动裁剪区域
    canvas.value.onmousemove = (e: MouseEvent) => {
      if (isTrimmed.value && isInPathDraging.value) {
        console.log(e.offsetX, e.offsetY);
        trimPic(
          startX.value + (e.offsetX - isInPathStartX.value),
          startY.value + (e.offsetY - isInPathStartY.value),
          trimWidth.value,
          trimHeight.value,
          ctx.value as CanvasRenderingContext2D,
          image.value as HTMLImageElement,
        );
      }
    };
    //停止拖动裁剪区域
    canvas.value.onmouseup = (e: MouseEvent) => {
      if (isTrimmed.value && isInPathDraging.value) {
        startX.value = startX.value + (e.offsetX - isInPathStartX.value);
        startY.value = startY.value + (e.offsetY - isInPathStartY.value);
        trimPic(
          startX.value,
          startY.value,
          trimWidth.value,
          trimHeight.value,
          ctx.value as CanvasRenderingContext2D,
          image.value as HTMLImageElement,
        );
        if (ctx.value) {
          ctx.value.save();
          ctx.value.beginPath();
          ctx.value.rect(
            startX.value,
            startY.value,
            trimWidth.value,
            trimHeight.value,
          );
          ctx.value.stroke();
          ctx.value.closePath();
          ctx.value.restore();
        }
      }
      isInPathDraging.value = false;
    };
  }
});
</script>

<template>
  <el-button class="send-file-btn" @click="sendFileBtn">
    upload
    <input ref="uploadFile" type="file" style="display: none" />
  </el-button>
  <canvas
    v-show="isShow"
    id="canvas"
    ref="canvas"
    @mousedown="mouseDownEvent"
    @mousemove="mouseMoveEvent"
    @mouseup="mouseUpEvent"
  ></canvas>
  <el-button class="send-file-btn" @click="cancelTrim"> cancel </el-button>
  <el-button class="send-file-btn" @click="getTrimmedImage">
    confirm
  </el-button>
  <!-- <svg width="300" height="200">
    <rect width="100%" height="100%" fill="blue" />
    <circle cx="50" cy="50" r="50" fill="red"></circle>
  </svg> -->
</template>

<style scoped>
.send-file-btn {
  padding: 5px 5px 5px 2px;
  font-size: 26px;
  background-color: white;

  &:active {
    border-color: rgb(214, 214, 214, 0);
    box-shadow: 1px 1px 1px 1px rgba(32, 33, 35, 0.2) inset;
  }
}
#canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* border: 1px solid rgba(32, 33, 35, 0.9); */
}
</style>
