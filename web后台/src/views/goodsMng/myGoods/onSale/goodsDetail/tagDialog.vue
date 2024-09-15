<template>
  <el-dialog v-model="tagDialogVisible" title="添加分类" width="50%" :z-index="19" destroy-on-close>
    <addTagDialog
      @addGoodsTag="addGoodsTag"
      v-if="addTagDialogVisible"
      v-model="addTagDialogVisible"
      :data="addTagDialogData"
    />
    <div style="display: flex; flex-direction: row-reverse">
      <el-button type="primary" @click="addTagDialogVisible = true">新增</el-button>
    </div>
    <el-table :data="goodsTagList" style="width: 100%; min-height: 500px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="标签名称" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="sort" label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editTag(scope.row)"> 编辑 </el-button>
          <el-button link type="danger" size="small" @click="showDel(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, computed, watch } from 'vue'
import { addGoodsTagApi, deleteGoodsTagApi, updateGoodsTagApi } from '@/api/goods.ts'
import { useStore, mapState, mapActions } from 'vuex'
import { type ComponentSize, type FormInstance, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import addTagDialog from './addTagDialog.vue'

const $store = useStore()

const tagDialogVisible = defineModel()

const addTagDialogVisible = ref(false)

interface GoodsTag {
  name: string
  id: string
}
const addTagDialogData = ref<GoodsTag>({ name: '', id: '' })

const goodsState = mapState('goodsMng', ['goodsTagList'])
const goodsTagList = computed<GoodsTag[]>(goodsState.goodsTagList.bind({ $store }))
const { getAllGoodsTagList } = mapActions('goodsMng', ['getAllGoodsTagList'])

const addGoodsTag = async (tagForm: { name: string; sort: number; id?: string }) => {
  const API = tagForm.id ? updateGoodsTagApi : addGoodsTagApi
  await API({
    ...tagForm
  })
  addTagDialogVisible.value = false
  getAllGoodsTagList.bind({ $store })()
}
function showDel(id: string) {
  ElMessageBox.alert('确定删除吗', '提示', {
    confirmButtonText: '确定',
    callback: (action: Action) => {
      if (action === 'confirm') {
        delTag(id)
      }
    }
  })
}
const delTag = async (id: string) => {
  await deleteGoodsTagApi({
    id
  })
  getAllGoodsTagList.bind({ $store })()
}
const editTag = (tag: any) => {
  addTagDialogVisible.value = true
  addTagDialogData.value = tag
}
</script>

<style lang="less" scoped>
.formBox {
  padding: 10px;
  background: #fff;
  margin: 30px;
  border-radius: 10px;
}
</style>
