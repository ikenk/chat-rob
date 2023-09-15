<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps<{
  iconClass:String
}>()

const icon = computed(()=>`#icon-${props.iconClass}`)

</script>

<template>
  <div class="svg-icon">
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="icon"></use>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.icon {
    width: 1em; 
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor; //封装后的svg组件无法继承颜色
    overflow: hidden;
}
</style>