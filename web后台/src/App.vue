<template>
  <div class="page" v-if="!isLoginPage">
    <div class="content">
      <div class="menu">
        <MenuBox :routes="routes" />
      </div>
      <div class="content_content">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 20px">
          <el-breadcrumb-item
            :to="item.path"
            v-for="(item, index) in breadcrumbList"
            :key="index"
            >{{ item.name }}</el-breadcrumb-item
          > </el-breadcrumb
        ><RouterView />
      </div>
    </div>
  </div>

  <login v-if="isLoginPage" />
</template>

<script lang="ts" setup>
import MenuBox from '@/components/menu/menu.vue'
import login from "@/views/login/index.vue";

import { routes } from '@/router'
import { useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue'
interface breadcrumb {
  name: string
  path: string
  redirect: string
}
const router = useRouter()
const isLoginPage = ref(false)

const breadcrumbList = ref<breadcrumb[]>([])
const generateBreadcrumb = () => {
  // 获取当前路由信息
  const matched = router.currentRoute.value.matched
  // 初始化面包屑导航数据
  breadcrumbList.value = []
  // 遍历路由信息，生成面包屑导航数据
  matched.forEach((item: { name: string; path: string; redirect: string }) => {
    const { name, path, redirect } = item
    breadcrumbList.value.push({
      name,
      path,
      redirect
    })
  })
}
watch(
  () => router.currentRoute.value.name,
  (newRouterName: any) => {
    generateBreadcrumb()
    isLoginPage.value = newRouterName === 'login'
  },
  { immediate: true }
)
</script>
<style scope lang="less">
.content {
  display: flex;
}
.header {
  color: #fff;
  height: 50px;
  background: #202020;
  padding: 0 24px;
  line-height: 50px;
  font-size: 18px;
  display: flex;
}
.header > div:nth-child(2) {
  margin-left: auto;
}
.menu {
  min-height: calc(100vh - 50px);
  min-width: 180px;
  background: rgb(28, 43, 54);
}
.content_content {
  flex-grow: 1;
}
.content_content_content {
  background: #fff;
  min-height: 80vh;
  margin: 0 20px;
  padding: 20px;
}
</style>
