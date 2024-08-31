<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="在售商品" name="onSale"> </el-tab-pane>
    <el-tab-pane label="下架商品" name="offShelf"> </el-tab-pane>
    <el-tab-pane label="草稿箱" name="drafts"> </el-tab-pane>
  </el-tabs>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue'
const router = useRouter()
const tabMap = {
  在售商品: 'onSale',
  下架商品: 'offShelf',
  草稿箱: 'drafts'
}
const activeName = ref<string>('onSale')

onMounted(() => {
  console.log(router.currentRoute.value.name)
  activeName.value = tabMap[router.currentRoute.value.name] || ''
})

watch(
  () => router.currentRoute.value.name,
  (name: any) => {
    activeName.value = tabMap[name] || ''
  }
)
watch(
  () => activeName.value,
  (activeName: any) => {
    router.push({
      path: `/goodsMng/myGoods/${activeName}`,
      query: { page: 1 }
    })
  }
)
</script>
