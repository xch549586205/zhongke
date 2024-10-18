<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane :label="`在售商品（${goodsSum.onSale}）`" name="onSale"> </el-tab-pane>
    <el-tab-pane :label="`下架商品（${goodsSum.freezing}）`" name="offShelf"> </el-tab-pane>
    <!-- <el-tab-pane label="草稿箱" name="drafts"> </el-tab-pane> -->
  </el-tabs>
  <router-view @getGoodsNum="getGoodsNum"></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getGoodsNumApi } from '@/api/goods'
import { onMounted, watch, ref, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'

const $store = useStore()
const obj = mapState('goodsMng', ['screen'])
const screen: any = computed(obj.screen.bind({ $store }))
const { updateScreen } = mapMutations('goodsMng', ['updateScreen'])

function _updateScreen(key: string, value: string) {
  updateScreen.bind({ $store })({ key, value })
}

const router = useRouter()
const tabMap = {
  在售商品: 'onSale',
  下架商品: 'offShelf',
  草稿箱: 'drafts'
}
const activeName = ref<string>('onSale')

interface GoodsSum {
  freezing: number
  onSale: number
  total: number
}
const goodsSum = ref<GoodsSum>({
  freezing: 0,
  onSale: 0,
  total: 0
})

onMounted(() => {
  getGoodsNum()
  console.log(router.currentRoute.value.name)
  if (tabMap[router.currentRoute.value.name]) {
    activeName.value = tabMap[router.currentRoute.value.name]
  }
})

const getGoodsNum = async () => {
  const res: any = await getGoodsNumApi({})
  goodsSum.value = res.data.data
}

watch(
  () => router.currentRoute.value.name,
  (name: any) => {
    if (tabMap[name]) {
      activeName.value = tabMap[name]
    }
  }
)
watch(
  () => activeName.value,
  (activeName: any) => {
    _updateScreen('goodsTypeId', null)
    _updateScreen('name', '')
    _updateScreen('id', null)

    router.push({
      path: `/goodsMng/myGoods/${activeName}`,
      query: { page: 1 }
    })
  }
)
</script>
