<template>
  <div class="title">小程序关联 banner</div>
  <el-form
    ref="ruleFormRef1"
    :model="formBox"
    :rules="formBoxRules"
    label-width="auto"
    class="demo-ruleForm"
    status-icon
  >
    <el-form-item label="上传图片" prop="bannerList">
      <div style="display: flex; flex-direction: column">
        <div class="imgDes">
          图片要求：尺寸为 176*686px 的横向图片，至多可上传5张，手机端将按图片顺序
        </div>
        <div style="display: flex; flex-direction: column">
          <el-upload
            v-for="(banner, index) in formBox.bannerList"
            list-type="picture"
            :on-success="
              (response: any, uploadFile: any) => handleAvatarSuccess(response, uploadFile, index)
            "
            :action="baseURL + '/file/uploadFile'"
            :before-upload="beforeAvatarUpload"
            :key="'banner' + index"
            class="avatar-uploader"
            :on-remove="handleRemove"
            :show-file-list="false"
            :headers="uploadHeaders"
          >
            <div v-if="formBox.bannerList[index].url" style="display: flex">
              <img :src="formBox.bannerList[index].url" class="avatar" />
              <div
                @click.stop="deleteBanner(formBox.bannerList[index].id)"
                style="
                  margin-left: auto;
                  width: 50px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <el-icon><Delete /></el-icon>
              </div>
            </div>

            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, watch, ref, reactive } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import type { FormRules } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { addBannerApi, getBannerListApi, updateBannerApi, deleteBannerApi } from '@/api/banner'
const imageUrl = ref([])
import { baseURL } from '@/api/http'
const uploadHeaders = {
  token: localStorage.getItem('token')
}

onMounted(async () => {
  getBannerList()
})

const getBannerList = async () => {
  const res: any = await getBannerListApi({
    page: 1,
    pageSize: 1000
  })
  if (res.code === 0) {
    formBox.bannerList.forEach((banner: Banner, index) => {
      try {
        const bannerIndex = res.data.list.findIndex((b: Banner) => b.sort === index)
        if (index !== -1) {
          const currentBanner = res.data.list[bannerIndex]
          formBox.bannerList[index].url = baseURL + '/' + currentBanner.url
          formBox.bannerList[index].id = currentBanner.id
          formBox.bannerList[index].sort = currentBanner.sort
        } else {
          formBox.bannerList[index] = { url: '', id: null, sort: null }
        }
      } catch (error) {
        formBox.bannerList[index] = { url: '', id: null, sort: null }
      }
    })
  }
}

const deleteBanner = async (id: number) => {
  await deleteBannerApi({
    id
  })
  getBannerList()
}
const handleAvatarSuccess: UploadProps['onSuccess'] = async (
  response: any,
  uploadFile: any,
  index: number
) => {
  const currentImage = formBox.bannerList[index]
  const API = currentImage.id ? updateBannerApi : addBannerApi

  const res: any = await API({ url: response.data.url, sort: index })
  if (res.code === 0) {
    formBox.bannerList[index].url = baseURL + '/' + response.data.url
    formBox.bannerList[index].id = response.data.id
    formBox.bannerList[index].sort = response.data.sort
  }
  getBannerList()
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (['image/jpeg', 'image/png', 'image/webp'].indexOf(rawFile.type) === -1) {
    ElMessage.error('请上传正确的图片格式!')
    return false
  }
  const isSize = new Promise(function (resolve, reject) {
    let width = 686
    let height = 176
    let _URL = window.URL || window.webkitURL
    let img = new Image()
    img.onload = function () {
      let valid = img.width == width && img.height == height
      valid ? resolve('success') : reject()
    }
    img.src = _URL.createObjectURL(rawFile)
  }).then(
    () => {
      return rawFile
    },
    () => {
      ElMessage.error('图片尺寸只能是176*686，请您重新选择!!')
      Promise.reject()
      return false //必须加上return false; 才能阻止
    }
  )
  return isSize
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}

interface Banner {
  url: string
  sort: number | null
  id: number | null
}

interface FormBox {
  bannerList: Array<Banner>
}
const formBox = reactive<FormBox>({
  bannerList: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }]
})
const formBoxRules = reactive<FormRules<FormBox>>({
  bannerList: [{ required: true, message: '请上次图片', trigger: 'blur' }]
})
const $store = useStore()

onMounted(() => {})

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
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 24px;
}
.imgDes {
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 12px;
  color: #00000066;
  letter-spacing: 0;
  margin-left: 30px;
}
.avatar-uploader {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon,
.avatar {
  font-size: 28px;
  color: #8c939d;
  width: 686px;
  height: 176px;
  text-align: center;
}
</style>
