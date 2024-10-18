<template>
  <div style="display: flex">
    <Screen :key="screenKey" />
    <el-button type="primary" @click="goGoodsDetail('')">重置</el-button>
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
    <el-table-column prop="name" label="商品信息">
      <template #default="scope">
        <div>
          <img
            style="width: 48px; height: 48px; margin-right: 5px"
            v-if="scope.row.goodsBanners.length"
            :src="getImageUrl(scope.row.goodsBanners.length ? scope.row.goodsBanners[0].url : '')"
          />
          {{ scope.row.name }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="商品ID" />
    <el-table-column prop="brandName" label="品牌" />
    <el-table-column prop="goodsTypeId" label="商品类型">
      <template #default="scope">
        {{ getGoodsTypeName(scope.row.goodsTypeId) }}
      </template>
    </el-table-column>

    <el-table-column prop="description" label="备注" />
    <el-table-column prop="" label="详情">
      <template #default="scope">
        <a style="cursor: pointer" @click="goGoodsDetail(scope.row.id)">编辑</a>
        <a
          style="cursor: pointer; margin-left: 5px"
          @click="changeGoodsState(scope.row, scope.row.goodsStateId === 1 ? 2 : 1)"
          >{{ scope.row.goodsStateId === 1 ? '下架' : '上架' }}</a
        >
        <a style="cursor: pointer; margin-left: 5px" @click="copyMessageBox(scope.row.id)">复制</a>

        <a style="cursor: pointer; margin-left: 5px" @click="delGoods(scope.row.id, scope.row.name)"
          >删除</a
        >
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
import {
  searchGoodsApi,
  deleteGoodsApi,
  updateGoodsApi,
  updateGoodsStateApi,
  copyGoodsApi
} from '@/api/goods'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import Screen from './screen.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { baseURL } from '@/api/http'
import type { Action } from 'element-plus'
import { useStore, mapState } from 'vuex'
const emit = defineEmits(['getGoodsNum'])

const $store = useStore()
const route = useRoute()

const loading = ref(true)

let obj = mapState('goodsMng', ['screen'])
let screen: any = computed(obj.screen.bind({ $store }))

const screenKey = computed(() => route.path)

const goodsStateId = computed(() => {
  return route.name === '在售商品' ? 1 : 2
})
watch(
  () => goodsStateId.value,
  (val: number) => {
    pagination.currentPage = 1
  }
)
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

const getImageUrl = (url: string) => {
  return baseURL + '/' + url
}
const handleCurrentChange = (currentPage: any) => {
  router.push({ path: route.path, query: { page: currentPage } })
}

watchEffect(() => {
  pagination.currentPage && searchGoods()
})

const copyMessageBox = (id: number) => {
  ElMessageBox.alert('复制后，将生成相同参数的新产品，确定复制该产品吗？', '复制提示', {
    confirmButtonText: '确认复制',
    showCancelButton: true,
    cancelButtonText: '取消',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await copyGoodsApi({
          id
        })
        searchGoods()
        emit('getGoodsNum')
      }
    }
  })
}

const delGoods = (id: string, name: string) => {
  ElMessageBox.alert(`确定删除商品“${name}”吗？`, '删除商品', {
    confirmButtonText: '删除',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await deleteGoodsApi({ id, successMessage: true })
        searchGoods()
        emit('getGoodsNum')
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

const changeGoodsState = async (goods: any, goodsStateId: number) => {
  if (goodsStateId === 2) {
    ElMessageBox.alert('确认下架该商品吗？下架后小程序将无法售卖，请谨慎操作', '下架提示', {
      confirmButtonText: '确认下架',
      showCancelButton: true,
      cancelButtonText: '取消',
      callback: async (action: Action) => {
        if (action === 'confirm') {
          await updateGoodsStateApi({
            id: goods.id,
            goodsStateId,
            successMessage: true
          })
          searchGoods()
          // emit('deleteCategory', props.data.id)
        }
      }
    })
    return
  }
  await updateGoodsStateApi({
    ...goods,
    goodsStateId,
    successMessage: true
  })
  searchGoods()
}

async function searchGoods() {
  loading.value = true

  try {
    const { name, id, goodsTypeId } = screen.value
    interface Screen {
      goodsTypeId?: number
      name?: string
      id?: number
    }
    const screenParams: Screen = {}
    if (name !== '' && name !== null) {
      screenParams.name = name
    }
    if (id) {
      screenParams.id = id
    }
    if (goodsTypeId) {
      screenParams.goodsTypeId = goodsTypeId
    }
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      goodsStateId: goodsStateId.value
    }

    const res: any = await searchGoodsApi({
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
