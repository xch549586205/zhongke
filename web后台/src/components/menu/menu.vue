<template>
  <div style="padding-left: 24px; line-height: 40px; color: #fff">导航</div>
  <el-menu
    router
    active-text-color="#ffffff"
    background-color="rgb(0,21,24)"
    :default-active="activePath"
    class="el-menu-vertical-demo"
    text-color="#fff"
  >
    <menu-item
      v-for="(item, index) in props.routes"
      :key="item.path + index"
      :item="item"
      :index="index + ''"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import menuItem from './menuItem.vue'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'

interface Props {
  routes: Array<any>
}
const props = defineProps<Props>()
const route = useRouter()

// 菜单激活的路由
const activePath = ref<string>('')

watch(
  () => route.currentRoute.value.path,
  (path: string) => {
    const currentRoute = route.currentRoute.value
    console.log(currentRoute, 'currentRoute')
    const arr = path.split('/')
    if (arr.length > 3) {
      activePath.value = '/' + [arr[1], arr[2]].join('/')
    } else {
      activePath.value = path
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/deep/.el-menu-item.is-active {
  background: rgb(24, 144, 255);
}
</style>
