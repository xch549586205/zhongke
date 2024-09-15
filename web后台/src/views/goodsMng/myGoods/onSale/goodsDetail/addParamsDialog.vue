<template>
  <el-dialog
    v-model="addParamsDialogVisible"
    title="添加参数"
    width="20%"
    :z-index="20"
    destroy-on-close
  >
    <el-form :model="form">
      <el-form-item label="参数名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm" :disabled="!form.name"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, reactive, computed, defineModel } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
interface Form {
  name: string
}
const emit = defineEmits(['addGoodsParams'])
const addParamsDialogVisible = defineModel()

const form: Form = reactive({
  name: '',
  sort: 1
})
onMounted(() => {})
const confirm = () => {
  emit('addGoodsParams', form.name)
}
</script>

<style lang="less" scoped></style>
