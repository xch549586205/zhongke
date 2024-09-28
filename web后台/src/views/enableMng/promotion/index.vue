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
        <div
          class="categoryContentCard categoryContentAddCard"
          @click="goCategoryContent(category.id)"
        >
          <el-icon style="margin-right: 5px"><Plus /></el-icon> 添加内容
        </div>
        <div
          v-for="categoryContent in getCategoryContentListByCategoryId(category.id)"
          :key="categoryContent.id + 'categoryContent'"
          class="categoryContentCard"
        >
          <div class="image">
            <img :src="getCategoryContentBannerImage(categoryContent.categoryBanner)" />
          </div>
          <div class="categoryContentDetail">
            <div style="margin-right: 10px">{{ categoryContent.name }}</div>
            <div>{{ categoryContent.time }} 创建</div>
          </div>
          <div class="hover">
            <el-icon
              size="30"
              color="#fff"
              style="cursor: pointer"
              @click="goCategoryContent(category.id, categoryContent.id)"
            >
              <Edit />
            </el-icon>
            <el-icon
              @click="deleteContent(categoryContent.id)"
              size="30"
              color="#fff"
              style="margin-left: 10px; cursor: pointer"
            >
              <Delete />
            </el-icon>
          </div>
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
import { CircleClose, Plus, Delete, Edit, EditPen } from '@element-plus/icons-vue'
import { addBannerApi, getBannerListApi, updateBannerApi, deleteBannerApi } from '@/api/banner'
import category from './categoryDialog.vue'
import { baseURL } from '@/api/http'
import {
  addCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
  getCategoryApi,
  getCategoryListApi,
  deleteCategoryContentApi,
  getCategoryContentListApi
} from '@/api/promotion'
import type { Action } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
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
  time?: string
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
  return baseURL + '/' + categoryBanner[0].url
}

const getCategoryContentListByCategoryId = (categoryId?: number) => {
  if (!categoryContentList.value || !categoryContentList.value.length) {
    return []
  }
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
const goCategoryContent = (categoryId?: number, categoryContentId?: number) => {
  router.push({
    path: '/enableMng/promotion/categoryContent',
    query: { categoryId, categoryContentId }
  })
}

const deleteContent = (id?: number) => {
  ElMessageBox.alert('确认删除该内容吗？ 删除后将无法找回，请谨慎操作', '删除提示', {
    confirmButtonText: '确认删除',
    showCancelButton: true,
    cancelButtonText: '取消',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await deleteCategoryContentApi({
          id
        })
        getCategoryContentList()
        // emit('deleteCategory', props.data.id)
      }
    }
  })
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
  margin-top: 0 !important;
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
    .categoryContentAddCard {
      display: flex;
      justify-content: center;
      cursor: pointer;
      align-items: center;
    }
    .categoryContentCard {
      position: relative;
      margin-right: 40px;
      overflow: hidden;
      width: 280px;
      height: 208px;
      border-radius: 4px 4px 0 0;
      background: #ffffff;
      border: 1.04px solid #e9e9e9;
      border-radius: 4px;
      .image {
        width: 280px;
        height: 128px;
        background: #d8d8d8;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .categoryContentDetail {
        padding: 16px;
        div:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-weight: 500;
          font-size: 18px;
          color: #000000d9;
        }
        div:nth-child(2) {
          margin-top: 4px;
        }
      }
      .hover {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.3);
        display: none;
      }
    }
    .categoryContentCard:hover {
      .hover {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
