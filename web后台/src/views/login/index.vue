<template>
  <div class="login">
    <div class="center">
      <div class="header1">
        <div class="title-panel">
          <div class="title">维护管理后台</div>
          <div class="sub-title">Maintenance management background</div>
        </div>
      </div>
    </div>
    <div class="from">
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="120px" status-icon>
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input v-model="ruleForm.captcha" />
        </el-form-item>
      </el-form>
      <img :src="picPath" style="margin-left: 120px" @click="getCaptcha" />
      <el-form-item>
        <div style="display: flex; margin-left: 120px; margin-top: 20px; width: calc(100% - 120px)">
          <el-button
            style="margin-left: auto; width: 100%"
            type="primary"
            @click="onSubmit(ruleFormRef)"
          >
            登录
          </el-button>
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { login, captcha } from '@/api/login'
import md5 from 'js-md5'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore, mapState, mapMutations } from 'vuex'

const { updateUserInfo } = mapMutations('userInfoMng', ['updateUserInfo'])
const $store = useStore()

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
interface RuleForm {
  username: string
  password: string
  captcha: string
}
const ruleForm = reactive<RuleForm>({
  username: '',
  password: '',
  captcha: ''
})
const captchaId = ref('')
const picPath = ref('')
const getCaptcha = async () => {
  try {
    const res: any = await captcha({})
    if (res.code === 0) {
      captchaId.value = res.data.captchaId
      picPath.value = res.data.picPath
    }
  } catch (error) {
    console.error(error)
  }
}
const rules = reactive<FormRules<RuleForm>>({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入账号'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码 ',
      trigger: 'change'
    }
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
})
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const { username, password, captcha } = ruleForm
        const params = {
          username,
          password: md5(password),
          captchaId: captchaId.value,
          captcha
        }
        const res: any = await login(params)
        const { code, data } = res
        if (code === 0) {
          localStorage.setItem('token', data.token.access_token)
          localStorage.setItem('userName', data.userName)
          localStorage.setItem('userId', data.id)
          const userInfo = {
            userName: data.userName,
            userId: data.id
          }
          updateUserInfo.bind({ $store })(userInfo)
          $store.dispatch('globalData/getGoodsTypeList')
          $store.dispatch('globalData/getAllAuthorityList')
          router.replace('/goodsMng/myGoods/onSale?page=1')
        }
      } catch (error) {
        console.error(error)
        getCaptcha()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scope lang="less">
.login {
  color: #fff;
  .center {
    text-align: center;
  }
}
.header1 {
  background: url(../../assets/loginBg.png);
  background-repeat: repeat-x;
  padding-top: 150px;
  padding-bottom: 60px;
  .title-panel {
    display: inline-block;
    border: 1px solid #ffff;
    border-radius: 10px;
    padding: 10px 90px;
    .title {
      font-size: 36px;
    }
    .sub-header {
      font-size: 14px;
    }
  }
}
.from {
  width: 500px;
  margin: 30px auto;
}
</style>
