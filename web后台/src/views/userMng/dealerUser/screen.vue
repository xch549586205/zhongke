<template>
  <div class="screen">
    <el-input
      v-model="contactName"
      placeholder="输入联系人搜索"
      class="input-with-select"
      style="width: 200px"
    >
      <template #append>
        <el-button
          @click="_updateScreen('contactName', contactName)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { Search, Folder } from '@element-plus/icons-vue'
import { watch, ref, onMounted, reactive, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
const $store = useStore()

const { updateScreen1 } = mapMutations('userMng', ['updateScreen1'])
const globalDataState = mapState('globalData', ['allAuthorityList'])
interface Authority {
  authorityId: string
  authorityName: string
}
const allAuthorityList = computed<Authority[]>(
  globalDataState.allAuthorityList.bind({ $store }) || []
)
const contactName = ref('')

function _updateScreen(key: string, value: string) {
  updateScreen1.bind({ $store })({ key, value })
}
</script>

<style lang="less" scoped>
.input-with-select /deep/ .el-icon {
  color: #fff;
}
.screen /deep/ .el-input__inner {
  height: 32px !important;
}
.screen /deep/.el-select el-select--large m-2 {
  height: 32px !important;
}
.screen /deep/ el-input__wrapper {
  height: 32px !important;
}
.screen {
  margin-bottom: 20px;
  display: flex;
}
</style>
