<template>
  <tagDialog v-model="tagDialogVisible" />
  <addParamsDialog
    v-model="addParamsDialogVisible"
    @addGoodsParams="addGoodsParams"
    v-if="addParamsDialogVisible"
  />
  <div class="formBox">
    <el-form
      ref="ruleFormRef1"
      :model="formBox1"
      :rules="formBox1Rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="商品分类" prop="goodsTypeId">
        <el-select v-model="formBox1.goodsTypeId" placeholder="请选择商品分类" style="width: 240px">
          <el-option
            v-for="item in goodsTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  <div class="formBox">
    <div class="formGroupName">基础信息</div>
    <el-form
      ref="ruleFormRef2"
      style="max-width: 600px"
      :model="formBox2"
      :rules="formBox2Rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="商品名称" prop="name">
        <el-input
          maxlength="60"
          placeholder="最多可输入30个汉字（60字符）"
          show-word-limit
          v-model="formBox2.name"
        />
      </el-form-item>
      <el-form-item label="品牌名称" prop="brandName">
        <el-input
          maxlength="60"
          placeholder="最多可输入30个汉字（60字符）"
          show-word-limit
          v-model="formBox2.brandName"
        />
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input
          maxlength="60"
          placeholder="最多可输入30个汉字（60字符）"
          show-word-limit
          v-model="formBox2.description"
        />
      </el-form-item>
      <el-form-item label="商品标签" prop="goodsTags">
        <div style="display: flex">
          <el-checkbox-group v-model="formBox2.goodsTags">
            <el-checkbox-button
              v-for="tag in goodsTagList"
              :key="tag.id + 'tagId'"
              :label="tag.name"
              :value="tag.id"
            />
          </el-checkbox-group>
          <el-button style="margin-left: 15px" type="primary" @click="tagDialogVisible = true">
            添加标签
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="商品参数" prop="goodsPara" class="fullItem">
        <view style="width: 100%">
          <el-button
            type="primary"
            @click="addParamsDialogVisible = true"
            style="margin-left: 20px"
          >
            增加参数
          </el-button>
          <el-row>
            <el-col
              :span="6"
              v-for="(param, index) in formBox2.goodsPara"
              :key="index + 'param'"
              class="paramItem"
            >
              <span style="white-space: nowrap"> {{ param.name }}：</span>
              <el-input maxlength="60" v-model="param.value" />
              <el-icon :size="20" style="margin-left: 9px" @click="delParam(index)">
                <CircleClose />
              </el-icon>
            </el-col>
          </el-row>
        </view>
      </el-form-item>
    </el-form>
  </div>
  <div class="formBox">
    <div class="formGroupName">基础信息</div>
    <el-form
      ref="ruleFormRef3"
      :model="formBox3"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="销售规格" prop="goodsSku" class="fullItem">
        <el-table border :data="formBox3.goodsSku">
          <el-table-column prop="specName" label="规格名称">
            <template #default="scope">
              <el-input v-model="formBox3.goodsSku[scope.$index].specName" />
            </template>
          </el-table-column>
          <el-table-column label="原价" #default="scope">
            <el-input type="number" v-model.number="scope.row.skuPrice[0].price" />
          </el-table-column>
          <el-table-column label="一级经销商" #default="scope">
            <el-input type="number" v-model.number="scope.row.skuPrice[1].price" />
          </el-table-column>
          <el-table-column label="二级经销商" #default="scope">
            <el-input type="number" v-model.number="scope.row.skuPrice[2].price" />
          </el-table-column>
          <el-table-column prop="kuCun" label="库存">
            <template #default="scope">
              <el-input type="number" v-model.number="formBox3.goodsSku[scope.$index].kuCun" />
            </template>
          </el-table-column>
          <el-table-column prop="kuCun" label="" align="center">
            <template #default="scope">
              <el-icon @click="formBox3.goodsSku.splice(scope.$index, 1)"><Delete /></el-icon>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <el-button type="primary" @click="addSku">增加规格</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>

  <div class="formBox">
    <el-dialog v-model="previewImgUrlVisible">
      <img w-full :src="previewImgUrl" alt="Preview Image" />
    </el-dialog>
    <div class="formGroupName">基础信息</div>
    <el-form
      ref="ruleFormRef4"
      :model="formBox4"
      :rules="formBox4Rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="商品主图" prop="goodsBanners" class="fullItem">
        <el-upload
          v-model:file-list="formBox4.goodsBanners"
          :action="baseURL + '/file/uploadFile'"
          :headers="uploadHeaders"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情描述" prop="goodsDetails" class="fullItem">
        <el-upload
          v-model:file-list="formBox4.goodsDetails"
          :action="baseURL + '/file/uploadFile'"
          :headers="uploadHeaders"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 30px">
    <el-button
      type="primary"
      @click="addGoods(ruleFormRef1, ruleFormRef2, ruleFormRef3, ruleFormRef4)"
      >发布商品</el-button
    >
    <!-- <el-button v-if="!id" @click="saveLocal">存草稿 </el-button> -->
    <el-button @click="goBack">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, computed, watch } from 'vue'
import { CircleClose, Plus, Delete } from '@element-plus/icons-vue'
import { addGoodsApi, getGoodsByIdApi, updateGoodsApi } from '@/api/goods'
import { useStore, mapState, mapActions } from 'vuex'
import tagDialog from './tagDialog.vue'
import addParamsDialog from './addParamsDialog.vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/api/http'
import type { FormRules, FormInstance } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { storage } from '@/util'
const router = useRouter()
const route = useRoute()
const $store = useStore()

const ruleFormRef1 = ref<FormInstance>()
const ruleFormRef2 = ref<FormInstance>()
const ruleFormRef3 = ref<FormInstance>()
const ruleFormRef4 = ref<FormInstance>()
interface Authority {
  authorityId: string
  authorityName: string
}
const globalDataState = mapState('globalData', ['allAuthorityList', 'goodsTypeList'])

const id = computed(() => route.query.id)
onMounted(() => {
  if (id.value) {
    getGoodsInfo()
  }
})

const getGoodsInfo = async () => {
  try {
    const res: any = await getGoodsByIdApi({ id: id.value * 1 })
    console.log(res, 1234)
    const {
      goodsBanners,
      goodsDetails,
      goodsPara,
      goodsSku,
      description,
      brandName,
      goodsTags,
      goodsTypeId,
      name
    } = res.data.data
    formBox1.goodsTypeId = goodsTypeId
    formBox2.name = name
    formBox2.description = description
    formBox2.brandName = brandName
    formBox2.goodsTags = goodsTags.map((tag: GoodsTag) => tag.id)
    formBox2.goodsPara = goodsPara
    formBox3.goodsSku = goodsSku
    formBox4.goodsBanners = goodsBanners.map((b: GoodsImage) => ({
      ...b,
      url: baseURL + '/' + b.url,
      id: b.id
    }))
    formBox4.goodsDetails = goodsDetails.map((d: GoodsImage) => ({
      ...d,
      url: baseURL + '/' + d.url,
      id: d.id
    }))
  } catch (error) {
    console.error(error)
  }
}

//  FormBox1 start
interface FormBox1 {
  goodsTypeId: string
}
const formBox1 = reactive<FormBox1>({
  goodsTypeId: ''
})
const formBox1Rules = reactive<FormRules<FormBox1>>({
  goodsTypeId: [{ required: true, message: '请选择商品分类', trigger: ['blur', 'change'] }]
})
//  FormBox1 end

//  FormBox2 start
interface GoodsPara {
  name: string
  id?: string
  value?: string
}
interface FormBox2 {
  name: string
  description: string
  brandName: string
  goodsTags: Array<number>
  goodsPara: Array<GoodsPara>
}
const formBox2 = reactive<FormBox2>({
  name: '',
  description: '',
  brandName: '',
  goodsTags: [],
  goodsPara: []
})
const formBox2Rules = reactive<FormRules<FormBox2>>({
  name: [{ required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }],
  description: [{ required: true, message: '请输入商品描述', trigger: ['blur', 'change'] }],
  brandName: [{ required: true, message: '请输入品牌名称', trigger: ['blur', 'change'] }]
})
//  FormBox2 end

//  FormBox3 start
interface SkuPrice {
  price: number | undefined
  authorityId: string
}
interface GoodsSku {
  id?: string
  sort?: number
  specName: string
  kuCun: number | undefined
  skuPrice: Array<SkuPrice>
}
interface FormBox3 {
  goodsSku: Array<GoodsSku>
}
const formBox3 = reactive<FormBox3>({
  goodsSku: []
})
const formBox3Rules = reactive<FormRules<FormBox3>>({
  goodsSku: [{ required: true, message: '请检查规格', trigger: ['blur', 'change'] }]
})

const addSku = () => {
  const allAuthorityList = computed<Authority[]>(globalDataState.allAuthorityList.bind({ $store }))
  const priceAuthorityArr = allAuthorityList.value.filter(
    (authority: Authority) =>
      authority.authorityName === '普通用户' || authority.authorityId === '6'
  )
  const price1AuthorityArr = allAuthorityList.value.filter(
    (authority: Authority) =>
      authority.authorityName === '一级经销商' || authority.authorityId === '4'
  )
  const price2AuthorityArr = allAuthorityList.value.filter(
    (authority: Authority) =>
      authority.authorityName === '二级经销商' || authority.authorityId === '5'
  )
  const priceAuthorityId = priceAuthorityArr.length ? priceAuthorityArr[0].authorityId : ''
  const price1AuthorityId = price1AuthorityArr.length ? price1AuthorityArr[0].authorityId : ''
  const price2AuthorityId = price1AuthorityArr.length ? price2AuthorityArr[0].authorityId : ''
  formBox3.goodsSku.push({
    specName: '',
    kuCun: 1,
    skuPrice: [
      {
        price: undefined,
        authorityId: priceAuthorityId
      },
      {
        price: undefined,
        authorityId: price1AuthorityId
      },
      {
        price: undefined,
        authorityId: price2AuthorityId
      }
    ]
  })
}
//  FormBox3 end

// fromBox4 start
const previewImgUrl = ref('')
const previewImgUrlVisible = ref(false)
const uploadHeaders = {
  token: localStorage.getItem('token')
}

interface GoodsImage {
  url: string
  name: string
  id?: string
}
interface FormBox4 {
  goodsBanners: Array<GoodsImage>
  goodsDetails: Array<GoodsImage>
}
const formBox4 = reactive<FormBox4>({
  goodsBanners: [],
  goodsDetails: []
})
const formBox4Rules = reactive<FormRules<FormBox4>>({
  goodsBanners: [{ required: true, message: '请上传', trigger: ['blur', 'change'] }],
  goodsDetails: [{ required: true, message: '请上传', trigger: ['blur', 'change'] }]
})
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImgUrl.value = uploadFile.url!
  previewImgUrlVisible.value = true
}
// fromBox4 end

// goods type start

interface GoodsType {
  name: string
  id: string
}
const goodsTypeList = computed<GoodsType[]>(globalDataState.goodsTypeList.bind({ $store }))

// goods type end

// goods Tag start
const tagDialogVisible = ref(false)
const { getAllGoodsTagList } = mapActions('goodsMng', ['getAllGoodsTagList'])
onMounted(() => {
  getAllGoodsTagList.bind({ $store })()
})
interface GoodsTag {
  name: string
  id: number
}
const goodsState = mapState('goodsMng', ['goodsTagList'])
const goodsTagList = computed<GoodsTag[]>(goodsState.goodsTagList.bind({ $store }))
// goods Tag edn
const emit = defineEmits(['getGoodsNum'])

// GOODS PARAMS start
const addParamsDialogVisible = ref(false)
// onMounted(() => {
//   const localGoodsParamsList: Array<GoodsPara> = storage.getItem('goodsPara')
//   if (!localGoodsParamsList) {
//     return
//   }
//   if (id.value) {
//     return
//   }
//   formBox2.goodsPara = [...localGoodsParamsList]
// })
const addGoodsParams = (paramsName: string) => {
  const hasName = formBox2.goodsPara.filter((p: GoodsPara) => {
    return p.name === paramsName
  }).length
  if (hasName) {
    ElMessage({
      showClose: true,
      message: '该参数名称已存在',
      type: 'error'
    })
    return
  }
  addParamsDialogVisible.value = false
  formBox2.goodsPara.push({
    name: paramsName
  })
}
const delParam = (index: number) => {
  formBox2.goodsPara.splice(index, 1)
}
// GOODS PARAMS end

watch(
  () => formBox4,
  (formBox4: any) => {
    if (formBox4) {
      console.log(formBox4, 'formBox4')
    }
  },
  { deep: true }
)
watch(
  () => formBox2.goodsPara,
  (goodsPara: any) => {
    if (goodsPara) {
      storage.setItem('goodsPara', goodsPara)
    }
  },
  { deep: true }
)

const addGoods = async (
  ruleFormRef1: FormInstance,
  ruleFormRef2: FormInstance,
  ruleFormRef3: FormInstance,
  ruleFormRef4: FormInstance
) => {
  let ruleSuccess = true

  const rules = [ruleFormRef1, ruleFormRef2, ruleFormRef3, ruleFormRef4]
  const promiseList: any = []
  rules.forEach((element: FormInstance) => {
    promiseList.push(
      element.validate((valid, fields) => {
        if (valid) {
          console.log('submit!')
        } else {
          ruleSuccess = false
          console.log('error submit!', fields)
        }
      })
    )
  })
  await Promise.all(promiseList)
  if (!ruleSuccess) {
    return
  }
  try {
    const params: any = {
      ...formBox1,
      ...formBox2,
      ...formBox3,
      ...formBox4
    }

    if (id.value) {
      params.id = id.value * 1
    }
    console.log(params, 'formBox')
    const API = id.value ? updateGoodsApi : addGoodsApi
    console.log({
      successMessage: true,
      ...params,
      goodsBanners: params.goodsBanners.map((banner: any, index: number) => ({
        url: banner.response ? banner.response.data.url : banner.url.replace(baseURL + '/', ''),
        name: banner.name,
        sort: index + 1,
        id: banner.response ? banner.response.data.id : banner.id
      })),
      goodsDetails: params.goodsDetails.map((detail: any, index: number) => ({
        url: detail.response ? detail.response.data.url : detail.url.replace(baseURL + '/', ''),
        name: detail.name,
        sort: index + 1,
        id: detail.response ? detail.response.data.id : detail.id
      })),
      goodsTags: params.goodsTags.map((tagId: number, index) => {
        const currentTagIndex = goodsTagList.value.findIndex((tag) => tag.id === tagId)
        const currentTag = goodsTagList.value[currentTagIndex]
        return currentTag
      }),
      goodsSku: params.goodsSku.map((sku: GoodsSku) => ({
        ...sku,
        goodsName: formBox2.name
      }))
    })
    const res: any = await API({
      successMessage: true,
      ...params,
      goodsBanners: params.goodsBanners.map((banner: any, index: number) => ({
        url: banner.response ? banner.response.data.url : banner.url.replace(baseURL + '/', ''),
        name: banner.name,
        sort: index + 1,
        id: banner.response ? banner.response.data.id : banner.id
      })),
      goodsDetails: params.goodsDetails.map((detail: any, index: number) => ({
        url: detail.response ? detail.response.data.url : detail.url.replace(baseURL + '/', ''),
        name: detail.name,
        sort: index + 1,
        id: detail.response ? detail.response.data.id : detail.id
      })),
      goodsTags: params.goodsTags.map((tagId: number, index) => {
        const currentTagIndex = goodsTagList.value.findIndex((tag) => tag.id === tagId)
        const currentTag = goodsTagList.value[currentTagIndex]
        return currentTag
      }),
      goodsSku: params.goodsSku.map((sku: GoodsSku) => ({
        ...sku,
        goodsName: formBox2.name
      }))
    })

    if (res.code === 0) {
      // !id.value && storage.removeItem('goodsPara')
      // if (route.query.draftId) {
      //   const localDraftList: Array<any> = storage.getItem('localDraftList')
      //   if (localDraftList) {
      //     const index = localDraftList.findIndex((draft) => draft.draftId == route.query.draftId)
      //     localDraftList.splice(index, 1)
      //     storage.setItem('localDraftList', localDraftList)
      //   }
      // }
      emit('getGoodsNum')
      goBack()
    }
  } catch (error) {
    console.error(error)
  }
}
const saveLocal = () => {
  const localDraftList: Array<any> = storage.getItem('localDraftList') || []
  const data = {
    draftId: new Date().getTime() + 'draftId',
    ...formBox1,
    ...formBox2,
    ...formBox3,
    ...formBox4
  }
  const index = localDraftList.findIndex((draft) => draft.draftId == route.query.draftId)
  if (index === -1) {
    localDraftList.push(data)
  } else {
    localDraftList[index] = data
  }
  storage.setItem('localDraftList', localDraftList)
  ElMessage({
    showClose: true,
    message: '已保存到草稿箱',
    type: 'success'
  })
}
const goBack = () => {
  router.back()
}
</script>

<style lang="less" scoped>
.formGroupName {
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  margin-bottom: 10px;
  letter-spacing: 0;
}
::v-deep {
  .el-checkbox-button {
  }
  .el-form {
    max-width: 100% !important;
  }
  .el-form-item__content {
    max-width: 500px;
  }
}
.fullItem ::v-deep {
  .el-form-item__content {
    max-width: 100%;
  }
}
.formBox {
  padding: 10px;
  background: #fff;
  margin: 30px;
  border-radius: 10px;
}
.paramItem {
  display: flex;
  padding: 0 20px;
  margin: 10px 0;
  align-items: center;
}
</style>
