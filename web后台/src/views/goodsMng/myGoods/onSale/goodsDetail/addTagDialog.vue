<template>
  <el-dialog
    v-model="addTagDialogVisible"
    title="添加标签"
    width="20%"
    :z-index="20"
    destroy-on-close
  >
    <el-form :model="form">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="标签排序" prop="sort">
        <el-input-number v-model="form.sort" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addTagDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, reactive, computed, defineModel } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
interface Form {
  name: string
  sort?: number
  id?: string
}
interface Props {
  data: Form
}
const props = defineProps<Props>()
const emit = defineEmits(['addGoodsTag'])
const addTagDialogVisible = defineModel()

const form: Form = reactive({
  name: '',
  sort: 1
})
onMounted(() => {
  console.log(props.data)
  if (props.data.id) {
    form.name = props.data.name
    form.sort = props.data.sort
    form.id = props.data.id
  }
})
const confirm = () => {
  emit('addGoodsTag', form)
  addTagDialogVisible.value = false
}
</script>

<style lang="less" scoped></style>
