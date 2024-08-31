<template>
  <div class="screen">
    <div class="flex" style="width: 70%">
      <el-input v-model="deviceName" placeholder="输入商品名称搜索" class="input-with-select">
        <template #append>
          <el-button
            @click="_updateScreen('deviceName', deviceName)"
            style="background: var(--el-color-primary)"
            :icon="Search"
          />
        </template>
      </el-input>
      <el-input v-model="siteName" placeholder="输入商品ID搜索" class="input-with-select">
        <template #append>
          <el-button
            @click="_updateScreen('siteName', siteName)"
            style="background: var(--el-color-primary)"
            :icon="Search"
          />
        </template>
      </el-input>
      <el-select v-model="screen.online" placeholder="选择在线状态">
        <el-option
          v-for="item in options"
          :key="item.value + 'online'"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div>
      <el-button type="primary">+发布商品</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { watch, ref, onMounted, reactive, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import moment from 'moment'
const $store = useStore()

const obj = mapState('goodsMng', ['screen'])
const screen: any = computed(obj.screen.bind({ $store }))

const { updateScreen } = mapMutations('goodsMng', ['updateScreen'])

function _updateScreen(key: string, value: string) {
  updateScreen.bind({ $store })({ key, value })
}

const deviceName = ref('')
const siteName = ref('')
onMounted(() => {
  siteName.value = screen.value.siteName
  deviceName.value = screen.value.deviceName
})

const options = [
  {
    value: 0,
    label: '全部状态'
  },
  {
    value: 1,
    label: '在线'
  },
  {
    value: 2,
    label: '离线'
  }
]
</script>

<style lang="less" scoped>
.input-with-select /deep/ .el-icon {
  color: #fff;
}
.flex {
  display: flex;
}
.screen {
  margin-bottom: 20px;
  display: flex;
  div {
    margin: 0 10px;
  }
}
.exportData {
  height: 32px;
  line-height: 32px;
  background: #fb712e;
  border-radius: 4px;
  width: 100px;
  cursor: pointer;
  color: #fff;
  display: flex;
  padding: 0 8px;
  margin-left: 20px;
  > div:nth-child(2) {
    margin-left: 5px;
  }
}
</style>
