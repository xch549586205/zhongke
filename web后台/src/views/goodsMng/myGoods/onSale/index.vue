<template>
  <div style="display: flex">
    <Screen />
    <el-button type="primary" @click="goGoodsDetail('')">+发布商品</el-button>
  </div>
  <el-table v-loading="loading" :data="goodsList" :row-style="{ height: '50px' }">
    <el-table-column type="index" label="序号" width="80">
      <template #default="scope">
        <div>
          {{ scope.$index + 1 * (pagination.currentPage - 1) * 12 + 1 }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="商品名称" />
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="goodsTypeId" label="商品类型">
      <template #default="scope">
        {{ getGoodsTypeName(scope.row.goodsTypeId) }}
      </template>
    </el-table-column>

    <el-table-column prop="description" label="备注" />
    <el-table-column prop="" label="详情">
      <template #default="scope">
        <a style="cursor: pointer" @click="goGoodsDetail(scope.row.id)">详情</a>
        <a style="cursor: pointer" @click="delGoods(scope.row.id, scope.row.name)">删除</a>
      </template>
    </el-table-column>
  </el-table>
  <div style="display: flex; padding-top: 10px">
    <el-pagination
      v-model:current-page="pagination.currentPage"
      style="margin-left: auto"
      background
      layout="prev, pager, next"
      :page-size="12"
      :pager-count="11"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, computed, watch } from 'vue'
import { searchGoodsApi, deleteGoodsApi } from '@/api/goods'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import Screen from './screen.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { useStore, mapState } from 'vuex'
const $store = useStore()
const route = useRoute()

const loading = ref(true)

let obj = mapState('goodsMng', ['screen'])
let screen: any = computed(obj.screen.bind({ $store }))

watch(
  () => route.query,
  (val: any) => {
    if (route.path === '/goodsMng/myGoods/onSale') {
      pagination.currentPage = val.page * 1
    }
  }
)

watch(
  () => screen,
  (newValue, oldValue) => {
    pagination.currentPage = 1
    router.push({
      path: '/goodsMng/myGoods/onSale',
      query: { page: 1 }
    })
  },
  { deep: true }
)

const router = useRouter()

const goodsList = ref([])
const currentGoods = ref<any>({})

interface pagination_type {
  currentPage: number
  pageSize: number
  total: number
}
const pagination = reactive<pagination_type>({
  currentPage: 0,
  pageSize: 12,
  total: 0
})

const handleCurrentChange = (currentPage: any) => {
  router.push({ path: '/goodsMng/myGoods/onSale', query: { page: currentPage } })
}

watchEffect(() => {
  pagination.currentPage && _searchGoods()
})

const delGoods = (id: string, name: string) => {
  ElMessageBox.alert(`确定删除商品“${name}”吗？`, '删除商品', {
    confirmButtonText: '删除',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        const res = await deleteGoodsApi({ id, successMessage: true })
      }
    }
  })
}

const goGoodsDetail = (id: string) => {
  router.push({
    path: '/goodsMng/myGoods/onSale/goodsDetail',
    query: { id }
  })
}

onMounted(() => {
  pagination.currentPage = router.currentRoute.value.query.page * 1
})

interface GoodsType {
  name: string
  id: string
}
const globalDataState = mapState('globalData', ['goodsTypeList'])
const goodsTypeList = computed<GoodsType[]>(globalDataState.goodsTypeList.bind({ $store }))

const getGoodsTypeName = (goodsTypeId: string) => {
  if (!goodsTypeId) {
    return ''
  }
  console.log(goodsTypeId)
  try {
    return goodsTypeList.value.filter((goodsType) => goodsType.id == goodsTypeId)[0].name
  } catch (error) {
    return ''
  }
}
const closeLocationModal = () => {
  currentGoods.value = {}
}
async function _searchGoods() {
  loading.value = true

  try {
    const { deviceName, siteName, goodsTypeId } = screen.value
    interface Screen {
      goodsTypeId?: number
      deviceName?: string
      siteName?: string
      time?: number
    }
    const screenParams: Screen = {}
    if (deviceName !== '') {
      screenParams.deviceName = deviceName
    }
    if (siteName !== '') {
      screenParams.siteName = siteName
    }
    if (goodsTypeId) {
      screenParams.goodsTypeId = goodsTypeId
      screenParams.time = 300
    }
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }

    const res: any = await searchGoodsApi({
      ...params,
      ...screenParams
    })
    if (!res.data.list) {
      goodsList.value = []
      return
    }
    let list = [...res.data.list]

    goodsList.value = list
    pagination.total = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
