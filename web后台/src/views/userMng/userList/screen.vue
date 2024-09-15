<template>
  <div class="screen">
    <el-select
      v-if="allAuthorityList.length"
      v-model="authorityId"
      filterable
      class="m-2"
      placeholder="选择角色过滤"
      size="large"
      clearable
      style="width: 200px; margin-left: 15px"
    >
      <el-option
        v-for="item in allAuthorityList"
        :key="item.authorityId"
        :label="item.authorityName"
        :value="item.authorityId"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { Search, Folder } from '@element-plus/icons-vue'
import { watch, ref, onMounted, reactive, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
const $store = useStore()

const { updateScreen } = mapMutations('userMng', ['updateScreen'])
const globalDataState = mapState('globalData', ['allAuthorityList'])
interface Authority {
  authorityId: string
  authorityName: string
}
const allAuthorityList = computed<Authority[]>(
  globalDataState.allAuthorityList.bind({ $store }) || []
)
const authorityId = ref('')

function _updateScreen(key: string, value: string) {
  updateScreen.bind({ $store })({ key, value })
}
watch(
  () => authorityId,
  (newValue, oldValue) => {
    _updateScreen('authorityId', newValue.value || '')
  },
  { deep: true }
)
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
