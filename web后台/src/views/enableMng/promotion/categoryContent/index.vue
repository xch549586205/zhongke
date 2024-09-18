<template>
  <el-dialog v-model="previewImgUrlVisible">
    <img w-full :src="previewImgUrl" alt="Preview Image" />
  </el-dialog>
  <div class="title">添加新内容</div>

  <el-form ref="formRef" :model="form" :rules="formRules" label-width="130" label-position="left">
    <el-form-item label="内容名称" prop="name">
      <el-input
        show-word-limit
        v-model="form.name"
        style="width: 500px"
        maxlength="20"
        placeholder="最多可输入10个汉字（20字符）"
      />
    </el-form-item>
    <el-form-item label="内容封面" prop="categoryBanner">
      <div style="display: flex; flex-direction: column">
        <div class="imgDes">图片要求：尺寸为 680*256x 的横向图片</div>
        <div style="display: flex; flex-direction: column">
          <el-upload
            v-model:file-list="form.categoryBanner"
            :action="baseURL + '/file/uploadFile'"
            :headers="uploadHeaders"
            :before-upload="categoryBannerBeforeUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="详情描述" prop="detailBanner">
      <div style="display: flex; flex-direction: column">
        <div class="imgDes">图片要求：上传张数不限制，比例不限制，手机端将按图片顺序展示</div>
        <div style="display: flex; flex-direction: column">
          <el-upload
            v-model:file-list="form.detailBanner"
            :headers="uploadHeaders"
            :action="baseURL + '/file/uploadFile'"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
      </div>
    </el-form-item>
  </el-form>
  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 30px">
    <el-button type="primary" @click="save(formRef)">保存</el-button>
    <el-button @click="goBack">取消</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, watch, ref, reactive } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CircleClose, Plus, Delete, EditPen } from '@element-plus/icons-vue'
import { addBannerApi, getBannerListApi, updateBannerApi, deleteBannerApi } from '@/api/banner'
import { baseURL } from '@/api/http'
import type { FormInstance, FormRules } from 'element-plus'
import moment from 'moment'
import {
  addCategoryContentApi,
  getCategoryContentApi,
  updateCategoryContentApi
} from '@/api/promotion'

const formRef = ref<FormInstance>()
const previewImgUrl = ref('')
const previewImgUrlVisible = ref(false)
const uploadHeaders = {
  token: localStorage.getItem('token')
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImgUrl.value = uploadFile.url!
  previewImgUrlVisible.value = true
}
interface Image {
  url: string
  name: string
  id?: string
}
interface Form {
  name: string
  categoryBanner: Array<Image>
  detailBanner: Array<Image>
}

const form: Form = reactive({
  name: '',
  categoryBanner: [],
  detailBanner: []
})

onMounted(async () => {
  if (route.query.categoryContentId) {
    const res: any = await getCategoryContentApi({ id: route.query.categoryContentId * 1 })
    const { name, categoryBanner, detailBanner } = res.data.goods
    form.name = name
    form.categoryBanner = categoryBanner.map((b: Image) => ({
      ...b,
      url: baseURL + '/' + b.url
    }))
    form.detailBanner = detailBanner.map((b: Image) => ({
      ...b,
      url: baseURL + '/' + b.url
    }))
  }
})

watch(
  () => form,
  (formBox4: any) => {
    if (formBox4) {
      console.log(formBox4, 'formBox4')
    }
  },
  { deep: true }
)
const categoryBannerBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (['image/jpeg', 'image/png', 'image/webp'].indexOf(rawFile.type) === -1) {
    ElMessage.error('请上传正确的图片格式!')
    return false
  }
  const isSize = new Promise(function (resolve, reject) {
    let width = 680
    let height = 256
    let _URL = window.URL || window.webkitURL
    let img = new Image()
    img.onload = function () {
      let valid = img.width % width === 0 && img.height % height === 0
      valid ? resolve('success') : reject()
    }
    img.src = _URL.createObjectURL(rawFile)
  }).then(
    () => {
      return rawFile
    },
    () => {
      ElMessage.error('图片尺寸只能是680*256，请您重新选择!!')
      Promise.reject()
      return false //必须加上return false; 才能阻止
    }
  )
  return isSize
}
const formRules = reactive<FormRules<Form>>({
  name: [{ required: true, message: '请输入内容名称', trigger: 'blur' }],
  categoryBanner: [{ required: true, message: '请上传', trigger: 'blur' }],
  detailBanner: [{ required: true, message: '请上传', trigger: 'blur' }]
})
const router = useRouter()
const route = useRoute()
const goBack = () => {
  router.back()
}

const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const API = route.query.categoryContentId ? updateCategoryContentApi : addCategoryContentApi
      const params: any = {
        ...form,
        categoryBanner: form.categoryBanner.map((banner: any, index: number) => ({
          url: banner.response ? banner.response.data.url : banner.url.replace(baseURL + '/', ''),
          name: banner.name,
          sort: index + 1,
          id: banner.response ? banner.response.data.id : banner.id
        })),
        detailBanner: form.detailBanner.map((banner: any, index: number) => ({
          url: banner.response ? banner.response.data.url : banner.url.replace(baseURL + '/', ''),
          name: banner.name,
          sort: index + 1,
          id: banner.response ? banner.response.data.id : banner.id
        })),
        sort: 1,
        categoryId: route.query.categoryId * 1,
        successMessage: true
      }
      if (route.query.categoryContentId) {
        params.id = route.query.categoryContentId * 1
      } else {
        params.time = moment().format('YYYY-MM-DD HH:mm:ss')
      }
      const res: any = await API({ ...params })
      if (res.code === 0) {
        router.back()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
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
.imgDes {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 12px;
  color: #00000066;
  letter-spacing: 0;
}
</style>
