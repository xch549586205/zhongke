<template>
  <editKuCunDialog
    :skuInfo="skuInfo"
    v-model="editKuCunDialogVisible"
    v-if="editKuCunDialogVisible"
    @changeKuCun="changeKuCun"
  />
  <div style="display: flex">
    <Screen :key="screenKey" />
  </div>
  <el-table v-loading="loading" :data="goodsList" :row-style="{ height: '50px' }">
    <el-table-column type="index" label="序号" width="80">
      <template #default="scope">
        <div>
          {{ scope.$index + 1 * (pagination.currentPage - 1) * 12 + 1 }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="goodsName" label="商品名称" />
    <el-table-column prop="goodsId" label="商品ID" />
    <el-table-column prop="id" label="SKU编码" />
    <el-table-column prop="specName" label="销售规格" />
    <el-table-column prop="goodsTypeId" label="商品状态">
      <template #default="scope">
        {{ scope.row.goodsStateId === 1 ? '在售' : '下架' }}
      </template>
    </el-table-column>
    <el-table-column prop="kuCun" label="可售库存" />

    <el-table-column prop="" label="详情">
      <template #default="scope">
        <a style="cursor: pointer" @click="openEditKuCunDialog(scope.row)">编辑</a>
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
import { getGoodsSkuListApi, deleteGoodsSkuApi, updateGoodsSkuApi } from '@/api/sku'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import Screen from './screen.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { baseURL } from '@/api/http'
import type { Action } from 'element-plus'
import { useStore, mapState } from 'vuex'
import editKuCunDialog from './editKuCunDialog.vue'

const $store = useStore()
const router = useRouter()
const route = useRoute()

const loading = ref(true)

let obj = mapState('skuMng', ['screen'])
let screen: any = computed(obj.screen.bind({ $store }))

const screenKey = computed(() => route.path)

watch(
  () => route.query,
  (val: any) => {
    pagination.currentPage = val.page * 1
  }
)

watch(
  () => screen,
  (newValue, oldValue) => {
    pagination.currentPage = 1
    router.push({
      path: route.path,
      query: { page: 1 }
    })
  },
  { deep: true }
)

interface SkuInfo {
  goodsId: number
  id: number
  goodsStateId: number
  specName: string
  kuCun: number
  goodsName: string
}
const skuInfo = ref<SkuInfo | {}>({})
const editKuCunDialogVisible = ref(false)
const openEditKuCunDialog = (_skuInfo: SkuInfo) => {
  editKuCunDialogVisible.value = true
  skuInfo.value = _skuInfo
}
const changeKuCun = async (kuCun: number, id: number) => {
  await updateGoodsSkuApi({
    kuCun,
    id,
    successMessage: true
  })
  editKuCunDialogVisible.value = false
  getGoodsSkuList()
}
const goodsList = ref([])
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
  router.push({ path: route.path, query: { page: currentPage } })
}

watchEffect(() => {
  pagination.currentPage && getGoodsSkuList()
})

onMounted(() => {
  pagination.currentPage = router.currentRoute.value.query.page * 1
})

interface GoodsType {
  name: string
  id: string
}
const globalDataState = mapState('globalData', ['goodsTypeList'])
const goodsTypeList = computed<GoodsType[]>(globalDataState.goodsTypeList.bind({ $store }))

async function getGoodsSkuList() {
  loading.value = true

  try {
    const { name, id, goodsTypeId } = screen.value
    interface Screen {
      goodsTypeId?: number
      name?: string
      id?: string
    }
    const screenParams: Screen = {}
    if (name !== '') {
      screenParams.name = name
    }
    if (id !== '') {
      screenParams.id = id
    }
    if (goodsTypeId) {
      screenParams.goodsTypeId = goodsTypeId
    }
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }

    const res: any = await getGoodsSkuListApi({
      ...params,
      ...screenParams
    })
    if (!res.data.list) {
      goodsList.value = []
      return
    }
    goodsList.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
