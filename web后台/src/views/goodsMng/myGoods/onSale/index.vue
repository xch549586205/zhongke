<template>
  <Screen />
  <el-table v-loading="loading" :data="goodList" :row-style="{ height: '50px' }">
    <el-table-column type="index" label="序号" width="80">
      <template #default="scope">
        <div>
          {{ scope.$index + 1 * (pagination.currentPage - 1) * 12 + 1 }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="设备名称" />
    <el-table-column prop="did" label="ID" />
    <el-table-column prop="site" label="所属站点">
      <template #default="scope">
        <div v-if="scope.row.sites && scope.row.sites.length">
          {{ scope.row.sites[0].name }}
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="location" label="当前位置（经纬度）" min-width="120">
      <template #default="scope">
        <div v-if="scope.row.location">
          {{ scope.row.location.longitude }},
          {{ scope.row.location.latitude + ' ' }}
          <a
            style="cursor: pointer; margin-left: 5px"
            @click="currentDevice = { ...scope.row, modalType: 'location' }"
          >
            查看地图
          </a>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="online" label="在线状态">
      <template #default="scope">
        <div :style="{ color: scope.row.online ? '#333' : '#EB415F' }">
          {{ scope.row.online ? '在线' : '离线' }}
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="online" label="运行状态">
      <template #default="scope">
        <div v-if="scope.row.state" style="color: #333">
          {{ scope.row.state.pwr && scope.row.state.pwr ? '使用' : '空闲' }}
        </div>
        <div v-if="!scope.row.state">空闲</div>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="备注" />
    <el-table-column prop="" label="详情">
      <template #default="scope">
        <a style="cursor: pointer" @click="goDeviceDetail(scope.row.did)">详情</a>
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
import { searchGoods } from '@/api/goods.ts'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import Screen from './screen.vue'
import { useStore, mapState } from 'vuex'
const $store = useStore()
const route = useRoute()

const loading = ref(true)

let obj = mapState('deviceMng', ['screen'])
let screen: any = computed(obj.screen.bind({ $store }))

watch(
  () => route.query,
  (val: any) => {
    if (route.path === '/deviceMng/goodList') {
      pagination.currentPage = val.page * 1
    }
  }
)

watch(
  () => screen,
  (newValue, oldValue) => {
    pagination.currentPage = 1
    router.push({
      path: '/deviceMng/goodList',
      query: { page: 1 }
    })
  },
  { deep: true }
)

const router = useRouter()

const goodList = ref([])
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
  router.push({ path: '/deviceMng/goodList', query: { page: currentPage } })
}
watchEffect(() => {
  pagination.currentPage && _searchGoods()
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

const closeLocationModal = () => {
  currentDevice.value = {}
}
async function _searchGoods() {
  loading.value = true

  try {
    const { deviceName, siteName, online } = screen.value
    interface Screen {
      online?: Boolean
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
    if (online) {
      screenParams.online = online * 1 === 1 ? true : false
      screenParams.time = 300
    }
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }

    const res: any = await searchGoods({
      ...params,
      ...screenParams
    })
    if (!res.data.list) {
      goodList.value = []
      return
    }
    let list = [...res.data.list]
    list = list.map((dev) => {
      if (dev.heartBeat && dev.heartBeat.time) {
        const diffMinutes = moment().diff(moment(dev.heartBeat.time * 1000), 'minutes')
        return {
          ...dev,
          online: diffMinutes < 5 ? true : false
        }
      }
      return { ...dev, online: false }
    })
    goodList.value = list
    pagination.total = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
