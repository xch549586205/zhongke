<template>
  <div class="screen" :key="JSON.stringify(screen)">
    <el-input
      v-model="name"
      placeholder="输入商品名称搜索"
      class="input-with-select"
      style="width: 200px"
    >
      <template #append>
        <el-button
          @click="_updateScreen('name', name)"
          style="background: var(--el-color-primary)"
          :icon="Search"
        />
      </template>
    </el-input>
    <el-input
      v-model.number="id"
      placeholder="输入商品ID搜索"
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
    <el-select v-model="screen.goodsTypeId" placeholder="选择商品分类" style="width: 200px">
      <el-option :key="'allGoodsTypeList'" label="全部分类" :value="null" />
      <el-option
        v-for="item in goodsTypeList"
        :key="item.name + 'goodsTypeList'"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { watch, ref, onMounted, reactive, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
const globalDataState = mapState('globalData', ['allAuthorityList', 'goodsTypeList'])
import moment from 'moment'
const $store = useStore()

interface GoodsType {
  name: string
  id: string
}
const goodsTypeList = computed<GoodsType[]>(globalDataState.goodsTypeList.bind({ $store }))

const obj = mapState('goodsMng', ['screen'])
const screen: any = computed(obj.screen.bind({ $store }))

const { updateScreen } = mapMutations('goodsMng', ['updateScreen'])

function _updateScreen(key: string, value: string) {
  updateScreen.bind({ $store })({ key, value })
}

const name = ref('')
const id = ref('')
onMounted(() => {
  id.value = screen.value.id
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
