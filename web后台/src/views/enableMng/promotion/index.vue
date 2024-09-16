<template>
  <category
    v-model="categoryDialogVisible"
    v-if="categoryDialogVisible"
    :data="categoryDialogInfo"
    @addOrUpdateCategory="addOrUpdateCategory"
    @deleteCategory="deleteCategory"
  />

  <div class="title">
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
      <div class="categoryContentCardWrap">
        <div class="categoryContentCard" @click="goCategoryContent(category.id)">
          <el-icon style="margin-right: 5px"><Plus /></el-icon> 添加内容
        </div>
        <div
          v-for="categoryContent in getCategoryContentListByCategoryId(category.id)"
          :key="categoryContent.id + 'categoryContent'"
          class="categoryContentCard"
        >
          {{ getCategoryContentBannerImage(categoryContent.categoryBanner) }}
          {{ categoryContent.name }}
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
  getCategoryListApi,
  getCategoryContentListApi
} from '@/api/promotion'

const categoryDialogVisible = ref(false)
interface Category {
  id?: number
  name?: string
  sort?: number
}
interface CategoryContent {
  id?: number
  name?: string
  sort?: number
  categoryId?: number
  categoryBanner: Array<Image>
}
interface Image {
  url: string
  name: string
  id?: string
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
const categoryContentList = ref<CategoryContent[]>([])
onMounted(async () => {
  await getCategoryList()
  getCategoryContentList()
})
const getCategoryList = async () => {
  const res: any = await getCategoryListApi({ page: 1, pageSize: 1000 })
  if (res.code === 0) {
    categoryList.value = res.data.list
  }
}
const getCategoryContentList = async () => {
  const res: any = await getCategoryContentListApi({ page: 1, pageSize: 1000 })
  if (res.code === 0) {
    categoryContentList.value = res.data.list
  }
}

const getCategoryContentBannerImage = (categoryBanner: Array<Image>) => {
  return categoryBanner[0].url
}

const getCategoryContentListByCategoryId = (categoryId?: number) => {
  return categoryContentList.value.filter((c: CategoryContent) => c.categoryId === categoryId)
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
  margin-top: 20px;
  .categoryContentCardWrap {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    .categoryContentCard {
      display: flex;
      align-items: center;
      margin-right: 40px;
      justify-content: center;
      width: 280px;
      height: 208px;
      background: #ffffff;
      border: 1.04px solid #e9e9e9;
      border-radius: 4px;
    }
  }
}
</style>
