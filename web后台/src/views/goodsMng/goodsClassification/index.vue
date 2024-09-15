<template>
  <div style="display: flex">
    <div>
      <Screen />
    </div>
    <el-button style="margin-left: 20px" type="primary" @click="addDialogVisible = true"
      >+添加分类</el-button
    >
  </div>
  <addDialog v-model="addDialogVisible" @addGoodsType="addGoodsType" />
  <el-table v-loading="loading" :data="goodsTypeList" :row-style="{ height: '50px' }">
    <el-table-column type="index" label="序号" width="80">
      <template #default="scope">
        <div>
          {{ scope.$index + 1 * (pagination.currentPage - 1) * 12 + 1 }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分类名称" />
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
import { addGoodsTypeApi, getGoodsTypeListApi } from '@/api/goodsType.ts'
import moment from 'moment'
import addDialog from './addDialog.vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Screen from './screen.vue'
import { useStore, mapState } from 'vuex'
const $store = useStore()
const route = useRoute()

const loading = ref(true)
const addDialogVisible = ref(false)

let obj = mapState('deviceMng', ['screen'])
let screen: any = computed(obj.screen.bind({ $store }))

watch(
  () => route.query,
  (val: any) => {
    if (route.path === '/goodsMng/goodsClassification') {
      pagination.currentPage = val.page * 1
    }
  }
)

watch(
  () => screen,
  (newValue, oldValue) => {
    pagination.currentPage = 1
    router.push({
      path: '/goodsMng/goodsClassification',
      query: { page: 1 }
    })
  },
  { deep: true }
)

const router = useRouter()

const goodsTypeList = ref<Object[]>([])
const currentDevice = ref<any>({})

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
  router.push({ path: '/deviceMng/goodsTypeList', query: { page: currentPage } })
}
watchEffect(() => {
  pagination.currentPage && getGoodsTypeList()
})

const goDeviceDetail = (did: string) => {
  router.push({
    path: '/deviceMng/deviceDetail',
    query: { did, type: 'info', page: 1 }
  })
}

onMounted(() => {
  pagination.currentPage = router.currentRoute.value.query.page * 1
})

const addGoodsType = async (form: object) => {
  try {
    await addGoodsTypeApi({
      ...form
    })
    addDialogVisible.value = false
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
    getGoodsTypeList()
  } catch (error) {
    console.error(error)
  }
}

async function getGoodsTypeList() {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    const res: any = await getGoodsTypeListApi({
      ...params
    })
    if (!res.data.list) {
      goodsTypeList.value = []
      return
    }
    let list = [...res.data.list]
    goodsTypeList.value = list
    pagination.total = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
