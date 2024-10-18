<template>
  <div style="display: flex">
    <div>
      <Screen />
    </div>
    <el-button style="margin-left: 20px" type="primary" @click="addDialogVisible = true"
      >+添加分类</el-button
    >
  </div>
  <addDialog
    v-model="addDialogVisible"
    @addGoodsType="addGoodsType"
    :goodsType="currentEditGoodsType"
    v-if="addDialogVisible"
  />
  <el-table v-loading="loading" :data="filterNameGoodsTypeList" :row-style="{ height: '50px' }">
    <el-table-column type="index" label="序号" width="80">
      <template #default="scope">
        <div>
          {{ scope.$index + 1 * (pagination.currentPage - 1) * 12 + 1 }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="分类名称" />
    <el-table-column prop="" label="详情">
      <template #default="scope">
        <a style="cursor: pointer" @click="showEditDialog(scope.row)">编辑</a>
        <a
          style="cursor: pointer; margin-left: 5px"
          @click="deleteGoodsType(scope.row.id, scope.row.name)"
        >
          删除
        </a>
      </template>
    </el-table-column>
  </el-table>
  <!-- <div style="display: flex; padding-top: 10px">
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
  </div> -->
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, computed, watch } from 'vue'
import { addGoodsTypeApi, deleteGoodsTypeApi, updateGoodsTypeApi } from '@/api/goodsType.ts'
import moment from 'moment'
import addDialog from './addDialog.vue'
import type { Action } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import Screen from './screen.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore, mapState } from 'vuex'
const $store = useStore()
const route = useRoute()

const loading = ref(false)

interface GoodsType {
  name?: string
  id?: string
}
const addDialogVisible = ref(false)

const globalDataState = mapState('globalData', ['goodsTypeList'])
const goodsTypeList = computed<GoodsType[]>(globalDataState.goodsTypeList.bind({ $store }))

let obj = mapState('goodsClassificationMng', ['screen'])
let screen: any = computed(obj.screen.bind({ $store }))

const currentEditGoodsType = ref<GoodsType>({})

console.log(screen)
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

const filterNameGoodsTypeList = computed(() => {
  if (!screen.value.name) {
    return goodsTypeList.value
  }
  return goodsTypeList.value.filter(
    (goodsType: GoodsType) => goodsType.name.indexOf(screen.value.name) !== -1
  )
})
const router = useRouter()

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

const showEditDialog = (goodsType: GoodsType) => {
  addDialogVisible.value = true
  currentEditGoodsType.value = goodsType
}

const handleCurrentChange = (currentPage: any) => {
  router.push({ path: '/goodsMng/goodsClassification', query: { page: currentPage } })
}
watchEffect(() => {})

onMounted(() => {
  pagination.currentPage = router.currentRoute.value.query.page * 1
})
const deleteGoodsType = (id: string, name: string) => {
  try {
    ElMessageBox.alert(`确定删除分类“${name}”吗？`, '删除分类', {
      confirmButtonText: '删除',
      callback: async (action: Action) => {
        loading.value = true
        if (action === 'confirm') {
          await deleteGoodsTypeApi({ id, successMessage: true })
          await $store.dispatch('globalData/getGoodsTypeList')
          loading.value = false
        }
      }
    })
  } catch (error) {
    loading.value = false
  }
}
const addGoodsType = async (form: object, id: string) => {
  loading.value = true
  try {
    const API = id ? updateGoodsTypeApi : addGoodsTypeApi
    await API({
      ...form,
      id
    })
    addDialogVisible.value = false
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
    await $store.dispatch('globalData/getGoodsTypeList')
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}
</script>
