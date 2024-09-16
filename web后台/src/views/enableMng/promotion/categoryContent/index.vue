<template>
  <div class="title">添加新内容</div>
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
import { baseURL } from '@/api/http'
import {
  addCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
  getCategoryApi,
  getCategoryListApi
} from '@/api/promotion'

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
