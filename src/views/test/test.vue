<!-- <script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'

const userInfoStore = useUserInfoStore()

type Item = {
  id: number
  name: string
}

// 所有的数据，比如这个数组存放了十万条数据
const allListData = ref<Item[]>([])

const itemHeight = ref(40) // 每一条（项）的高度，比如 40 像素
const count = ref(10) // 一屏展示几条数据
const startIndex = ref(0) // 开始位置的索引
const endIndex = ref(10) // 结束位置的索引
const topVal = ref(0) // 父元素滚动位置

// 计算展示的列表
const showListData = computed(() => allListData.value.slice(startIndex.value, endIndex.value))

// 获取十万条数据
const getData = async () => {
  const res = await axios({
    url:'http://192.168.3.59:7010/large-data',
    method:'GET',
    headers:{
      'Authorization' :`Bearer ${userInfoStore.getToken('user-token')}`
    }
  })
  allListData.value = res.data.data
}

// 初始化加载
onMounted(() => {
  getData()
})

// 虚拟列表视口
const viewport = ref<HTMLDivElement>()

// 滚动这里可以加上节流，减少触发频次
const handleScroll = () => {
  // 非空判断
  if (!viewport.value) return
  // 获取滚动距离
  const scrollTop = viewport.value.scrollTop
  // 计算起始下标和结束下标，用于 computed 计算
  startIndex.value = Math.floor(scrollTop / itemHeight.value)
  endIndex.value = startIndex.value + count.value
  // 动态更改定位的 top 值，确保联动，动态展示相应内容
  topVal.value = viewport.value.scrollTop
}
</script> -->

<template>
  <h2>手写虚拟列表-原理{{ topVal }}</h2>
  <!-- 
    虚拟列表容器：类似“视口”，视口的高度取决于一次展示几条数据
    比如视口只能看到10条数据，一条40像素，10条400像素
    故，视口的高度为400像素，注意要开定位和滚动条 
  -->
  <div
    ref="viewport"
    class="viewport"
    :style="{ height: itemHeight * count + 'px' }"
    @scroll="handleScroll"
  >
    <!-- 占位 dom 元素，其高度为所有的数据的总高度 -->
    <div
      class="placeholder"
      :style="{ height: allListData.length * itemHeight + 'px' }"
    />
    <!-- 内容区，展示10条数据，注意其定位的top值是变化的 -->
    <div class="list"
:style="{ top: topVal + 'px' }">
      <!-- 每一条（项）数据 -->
      <div
        v-for="item in showListData"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 虚拟列表容器盒子
.viewport {
  box-sizing: border-box;
  width: 240px;
  border: solid 1px #000000;
  // 开启滚动条
  overflow-y: auto;
  // 开启相对定位
  position: relative;
  .list {
    width: 100%;
    height: auto;
    // 搭配使用绝对定位
    position: absolute;
    top: 0;
    left: 0;
    .item {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      // 隔行变色
      &:nth-child(even) {
        background: #c7edcc;
      }
      &:nth-child(odd) {
        background: pink;
      }
    }
  }
}
</style>
