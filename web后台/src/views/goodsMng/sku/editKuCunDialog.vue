<template>
  <el-dialog
    v-model="editKuCunDialogVisible"
    title="库存编辑"
    :z-index="220"
    destroy-on-close
    width="30%"
  >
    <el-form-item label="商品名称：" prop="specName">
      {{ props.skuInfo.specName }}
    </el-form-item>
    <el-form-item label="商品ID：" prop="goodsId">
      {{ props.skuInfo.goodsId }}
    </el-form-item>
    <el-form-item label="SKU编码：" prop="id">
      {{ props.skuInfo.id }}
    </el-form-item>
    <el-form-item label="销售规格：" prop="specName">
      {{ props.skuInfo.specName }}
    </el-form-item>
    <el-form :model="form" label-suffix="：" ref="ruleFormRef" :rules="formRules">
      <el-form-item label="可售库存" prop="kuCun">
        <el-input type="number" min="0" v-model.number="form.kuCun" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editKuCunDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save(ruleFormRef)"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, reactive, computed, defineModel } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import type { FormInstance, FormRules } from 'element-plus'

interface SkuInfo {
  goodsId: number
  id: number
  goodsStateId: number
  specName: string
  kuCun: number
}

interface Props {
  skuInfo: SkuInfo
}
interface Form {
  kuCun: number
}

const props = defineProps<Props>()
// const emit = defineEmits(['addGoodsParams'])
const editKuCunDialogVisible = defineModel()
const form: Form = reactive({ kuCun: props.skuInfo.kuCun })
const formRules = reactive<FormRules<Form>>({
  kuCun: [{ required: true, message: '请输入库存', trigger: 'blur' }]
})
const ruleFormRef = ref<FormInstance>()

const emit = defineEmits(['changeKuCun'])

const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const { kuCun } = form
        emit('changeKuCun', kuCun, props.skuInfo.id)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  console.log(props)
})
// const confirm = () => {
//   emit('addGoodsParams', form.name)
// }
</script>

<style lang="less" scoped></style>
