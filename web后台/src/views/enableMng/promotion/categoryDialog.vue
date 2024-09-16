<template>
  <el-dialog
    v-model="categoryDialogVisible"
    title="添加分类"
    width="30%"
    :z-index="20"
    destroy-on-close
  >
    <el-form :model="form">
      <el-form-item label="分类标题" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类标题" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button v-if="form.id" type="danger" @click="deleteConfirm"> 删除 </el-button>
        <el-button type="primary" @click="confirm"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, reactive, computed, defineModel } from 'vue'
import type { Action } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore, mapState, mapMutations } from 'vuex'
interface Form {
  name?: string
  sort?: number
  id?: number
}
interface Props {
  data: Form
}
const props = defineProps<Props>()
const emit = defineEmits(['addOrUpdateCategory', 'deleteCategory'])
const categoryDialogVisible = defineModel()

const form: Form = reactive({
  name: '',
  sort: 1
})
onMounted(() => {
  if (props.data.id) {
    form.name = props.data.name
    form.sort = props.data.sort
    form.id = props.data.id
  }
})

const deleteConfirm = () => {
  ElMessageBox.alert('确认删除该分类吗？ 删除后将无法找回，请谨慎操作', '删除提示', {
    confirmButtonText: '确认删除',
    showCancelButton: true,
    cancelButtonText: '取消',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        emit('deleteCategory', props.data.id)
      }
    }
  })
}

const confirm = () => {
  emit('addOrUpdateCategory', form)
  categoryDialogVisible.value = false
}
</script>

<style lang="less" scoped></style>
