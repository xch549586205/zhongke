<template>
  <div class="screen" :key="JSON.stringify(screen)">
    <el-input
      v-model="goodsName"
      placeholder="输入商品名称搜索"
      class="input-with-select"
      style="width: 200px"
    >
      <template #append>
        <el-button
          @click="_updateScreen('goodsName', goodsName)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
    <el-input
      v-model="goodsId"
      placeholder="输入商品ID搜索"
      class="input-with-select"
      style="width: 200px"
    >
      <template #append>
        <el-button
          @click="_updateScreen('goodsId', goodsId)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
    <el-input
      v-model="specName"
      placeholder="输入SKU 名称搜索"
      class="input-with-select"
      style="width: 200px"
    >
      <template #append>
        <el-button
          @click="_updateScreen('specName', specName)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
    <el-input
      v-model.number="id"
      placeholder="输入SKU 编码搜索"
      class="input-with-select"
      style="width: 200px"
    >
      <template #append>
        <el-button
          @click="_updateScreen('id', id)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
    <el-select
      v-model="screen.goodsStateId"
      filterable
      class="m-2"
      placeholder="商品状态"
      size="large"
      clearable
      style="width: 200px; margin-left: 15px"
    >
      <el-option label="上架" :value="1" />
      <el-option label="下架" :value="2" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { watch, ref, onMounted, reactive, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import moment from 'moment'
const $store = useStore()

const obj = mapState('skuMng', ['screen'])
const screen: any = computed(obj.screen.bind({ $store }))

const { updateScreen } = mapMutations('skuMng', ['updateScreen'])

function _updateScreen(key: string, value: string | null | number) {
  updateScreen.bind({ $store })({ key, value })
}

const goodsName = ref('')
const specName = ref('')
const id = ref(null)
const goodsId = ref<number | null>(null)
onMounted(() => {
  id.value = screen.value.id
  goodsName.value = screen.value.goodsName
  goodsId.value = screen.value.goodsId
  specName.value = screen.value.specName
})
watch(
  () => screen.value,
  (newValue, oldValue) => {
    id.value = newValue.id
    goodsName.value = newValue.goodsName
    goodsId.value = newValue.goodsId
    specName.value = newValue.specName
  },
  { deep: true }
)
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
