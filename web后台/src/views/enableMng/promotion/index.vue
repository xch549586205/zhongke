<template>
  <category
    v-model="categoryDialogVisible"
    v-if="categoryDialogVisible"
    :data="categoryDialogInfo"
    @addOrUpdateCategory="addOrUpdateCategory"
    @deleteCategory="deleteCategory"
  />

  <div class="title" @click="goCategoryContent(0)">
    内容分类管理
    <el-button type="primary" style="margin-left: auto" @click="categoryDialogVisible = true">
      <el-icon style="margin-left: 5px"><Plus /></el-icon>
      添加分类
    </el-button>
  </div>

  <div class="categoryContent">
    <div
      v-for="(category, index) in categoryList"
      :key="index + 'categoryContent'"
      class="category"
    >
      <div class="categoryName">
        {{ category.name }}
        <el-icon @click="editCategoryDialog(category)" style="margin-left: 10px; cursor: pointer"
          ><EditPen
        /></el-icon>
      </div>
      <div class="categoryContent">
        <div class="categoryContentCard" @click="goCategoryContent(category.id)">
          <el-icon style="margin-right: 5px"><Plus /></el-icon> 添加内容
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, watch, ref, reactive } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import type { FormRules } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CircleClose, Plus, Delete, EditPen } from '@element-plus/icons-vue'
import { addBannerApi, getBannerListApi, updateBannerApi, deleteBannerApi } from '@/api/banner'
import category from './categoryDialog.vue'
import { baseURL } from '@/api/http'
import {
  addCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
  getCategoryApi,
  getCategoryListApi
} from '@/api/promotion'

const categoryDialogVisible = ref(false)
interface Category {
  id?: number
  name?: string
  sort?: number
}
const categoryDialogInfo = ref<Category>({})

const editCategoryDialog = (dialogInfo: Category) => {
  categoryDialogInfo.value = dialogInfo
  categoryDialogVisible.value = true
}
watch(
  () => categoryDialogVisible.value,
  (visible: any) => {
    if (!visible) {
      categoryDialogInfo.value = {}
    }
  }
)

const categoryList = ref<Category[]>([])
onMounted(() => {
  getCategoryList()
})
const getCategoryList = async () => {
  const res: any = await getCategoryListApi({ page: 1, pageSize: 1000 })
  if (res.code === 0) {
    categoryList.value = res.data.list
  }
}

const addOrUpdateCategory = async (params: Category) => {
  const API = params.id ? updateCategoryApi : addCategoryApi
  await API({ ...params, successMessage: true })
  getCategoryList()
}
const deleteCategory = async (id: number) => {
  await deleteCategoryApi({ id, successMessage: true })
  categoryDialogVisible.value = false
  getCategoryList()
}
const goCategoryContent = (categoryId?: number) => {
  router.push({ path: '/enableMng/promotion/categoryContent', query: { categoryId } })
}
const router = useRouter()
</script>
<style scope lang="less">
::v-deep {
  .el-form-item__content {
    display: block !important;
  }
}
.title {
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 18px;
  display: flex;
  color: #000000;
  letter-spacing: 0;
  height: 60px;
  background: #ffffff;
  border-radius: 12px;
}
.category {
  margin-top: 30px;
}
.category:nth-child(1) {
  margin-top: 0;
}
.categoryName {
  font-family: PingFangSC-Medium;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0;
}
.categoryContent {
  margin-top: 10px;
  .categoryContentCard {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280px;
    height: 208px;
    background: #ffffff;
    border: 1.04px solid #e9e9e9;
    border-radius: 4px;
  }
}
</style>
