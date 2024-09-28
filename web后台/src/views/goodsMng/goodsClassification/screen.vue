<template>
  <div class="screen">
    <el-input v-model="name" placeholder="输入分类名称搜索" class="input-with-select">
      <template #append>
        <el-button
          @click="_updateScreen('name', name)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { watch, ref, onMounted, reactive, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import moment from 'moment'
const $store = useStore()

const obj = mapState('goodsClassificationMng', ['screen'])
const screen: any = computed(obj.screen.bind({ $store }))

const { updateScreen } = mapMutations('goodsClassificationMng', ['updateScreen'])

function _updateScreen(key: string, value: string) {
  updateScreen.bind({ $store })({ key, value })
}

const name = ref('')
onMounted(() => {
  name.value = screen.value.name
})
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
