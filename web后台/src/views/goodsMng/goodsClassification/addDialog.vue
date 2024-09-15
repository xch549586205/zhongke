<template>
  <el-dialog v-model="dialogFormVisible" title="添加分类" width="500">
    <el-form :model="form">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, reactive, computed, defineModel } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
const emit = defineEmits(['addGoodsType'])
const dialogFormVisible = defineModel()
interface Form {
  name: string
}
const form: Form = reactive({
  name: ''
})
onMounted(() => {})
const confirm = () => {
  emit('addGoodsType', form)
}
</script>

<style lang="less" scoped></style>
